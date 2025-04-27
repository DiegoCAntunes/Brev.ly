import {
  exportLinks,
  exportLinksInput,
} from "../../../app/functions/export-links";
import { isRight } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links/export",
    {
      schema: {
        summary: "Export all shortened URLs",
        description:
          "Generates a CSV file of all shortened links and returns a temporary public URL.",
        tags: ["links"],
        querystring: exportLinksInput,
        response: {
          200: z.object({
            url: z
              .string()
              .url()
              .describe("Public URL to download the exported CSV"),
          }),
          500: z.object({
            message: z.literal("Failed to export links"),
          }),
        },
      },
    },
    async (request, reply) => {
      const parsed = exportLinksInput.parse(request.query);
      const result = await exportLinks(parsed);

      if (isRight(result)) {
        const { url } = result.right;

        return reply.status(200).send({
          url,
        });
      }

      return reply.status(500).send({ message: "Failed to export links" });
    }
  );
};
