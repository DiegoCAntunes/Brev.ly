import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const createLinkInput = z.object({
  originalUrl: z.string().url(),
  shortenedUrl: z.string().regex(/^[a-zA-Z0-9_-]*$/).optional(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

type CreateLinkOutput = {
  id: string
  originalUrl: string
  shortenedUrl: string
  accessCount: number
  createdAt: Date
}

export async function createLink(
  input: CreateLinkInput
): Promise<Either<'SHORTENED_URL_EXISTS' | 'SHORTENED_URL_REQUIRED', CreateLinkOutput>> {
  const { originalUrl, shortenedUrl } = createLinkInput.parse(input)

  if (!shortenedUrl) {
    return makeLeft('SHORTENED_URL_REQUIRED');
  }
  const shortUrl = shortenedUrl;

  // Check if shortened URL already exists
  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortenedUrl, shortUrl),
  })

  if (existingLink) {
    return makeLeft('SHORTENED_URL_EXISTS')
  }

  const [link] = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortenedUrl: shortUrl,
      accessCount: 0,
    })
    .returning()

  return makeRight(link)
}