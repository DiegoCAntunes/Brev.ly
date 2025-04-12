import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const deleteLinkInput = z.object({
  id: z.string().uuid(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>
type DeleteLinkOutput = void
type DeleteLinkError = 'LINK_NOT_FOUND'

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<DeleteLinkError, DeleteLinkOutput>> {
  const { id } = deleteLinkInput.parse(input)

  const [link] = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning()

  if (!link) {
    return makeLeft('LINK_NOT_FOUND')
  }

  return makeRight(undefined)
}