import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const getOriginalUrlInput = z.object({
  shortenedUrl: z.string(),
})

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>
type GetOriginalUrlOutput = { originalUrl: string }
type GetOriginalUrlError = 'SHORTENED_URL_NOT_FOUND'

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<Either<GetOriginalUrlError, GetOriginalUrlOutput>> {
  const { shortenedUrl } = getOriginalUrlInput.parse(input)

  const link = await db.query.links.findFirst({
    where: eq(schema.links.shortenedUrl, shortenedUrl),
    columns: {
      originalUrl: true,
    },
  })

  if (!link) {
    return makeLeft('SHORTENED_URL_NOT_FOUND')
  }

  return makeRight({ originalUrl: link.originalUrl })
}