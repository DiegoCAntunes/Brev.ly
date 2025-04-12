import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const incrementAccessInput = z.object({
  shortenedUrl: z.string(),
})

type IncrementAccessInput = z.input<typeof incrementAccessInput>
type IncrementAccessOutput = void
type IncrementAccessError = 'SHORTENED_URL_NOT_FOUND'

export async function incrementAccess(
  input: IncrementAccessInput
): Promise<Either<IncrementAccessError, IncrementAccessOutput>> {
  const { shortenedUrl } = incrementAccessInput.parse(input)

  const [link] = await db
    .update(schema.links)
    .set({
      accessCount: sql`${schema.links.accessCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(schema.links.shortenedUrl, shortenedUrl))
    .returning()

  if (!link) {
    return makeLeft('SHORTENED_URL_NOT_FOUND')
  }

  return makeRight(undefined)
}