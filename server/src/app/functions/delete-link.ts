import { db } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { type Either, makeLeft, makeRight } from "../../infra/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";

const deleteLinkInput = z.object({
  id: z.string().uuid(),
});

type DeleteLinkInput = z.input<typeof deleteLinkInput>;
type DeleteLinkOutput = true;
type DeleteLinkError = "LINK_NOT_FOUND";

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<DeleteLinkError, DeleteLinkOutput>> {
  const { id } = deleteLinkInput.parse(input);

  // Step 1: Check if the link exists
  const link = await db.query.links.findFirst({
    where: eq(schema.links.id, id),
  });

  if (!link) {
    return makeLeft("LINK_NOT_FOUND");
  }

  // Step 2: Delete the link
  await db.delete(schema.links).where(eq(schema.links.id, id));

  return makeRight(true);
}
