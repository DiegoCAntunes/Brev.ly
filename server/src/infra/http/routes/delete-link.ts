import { deleteLink } from "../../../app/functions/delete-link";
import { isRight } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/links/:id",
    {
      schema: {
        summary: "Delete a shortened URL",
        description:
          "Deletes a shortened URL. Returns 204 if successful or 404 if not found.",
        tags: ["links"],
        params: z.object({
          id: z.string().uuid().describe("The UUID of the link to delete"),
        }),
        response: {
          200: z
            .object({
              message: z.string().describe("Confirmation message"),
            })
            .describe("Link successfully deleted."),
          404: z
            .object({
              message: z
                .string()
                .describe("No link found with the provided ID"),
            })
            .describe("Link does not exist"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const result = await deleteLink({ id });

      if (isRight(result)) {
        return reply.status(200).send({ message: "Link successfully deleted" });
      }

      return reply.status(404).send({ message: "Link not found" });
    }
  );
};
