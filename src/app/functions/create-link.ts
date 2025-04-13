import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'

type CreateLinkInput = {
  originalUrl: string
  shortenedUrl: string
}

type CreateLinkOutput = {
  id: string
  originalUrl: string
  shortenedUrl: string
  accessCount: number
  createdAt: Date
}

export async function createLink(
  input: CreateLinkInput
): Promise<Either<'SHORTENED_URL_EXISTS', CreateLinkOutput>> {
  const { originalUrl, shortenedUrl } = input

  const existingLink = await db.query.links.findFirst({
    where: eq(schema.links.shortenedUrl, shortenedUrl),
  })

  if (existingLink) {
    return makeLeft('SHORTENED_URL_EXISTS')
  }

  const [link] = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortenedUrl,
      accessCount: 0,
    })
    .returning()

  return makeRight(link)
}