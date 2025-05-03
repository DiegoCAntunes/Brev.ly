import { incrementAccess } from "../../../app/functions/increment-access";
import { isRight } from "../../shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const incrementAccessRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links/:shortenedUrl",
    {
      schema: {
        summary: "Get and increment access count for a shortened URL",
        description:
          "Fetches the original URL and increments the access count. Used for client-side redirection.",
        tags: ["links"],
        params: z.object({
          shortenedUrl: z
            .string()
            .describe("The custom alias of the shortened URL"),
        }),
        response: {
          200: z
            .object({
              originalUrl: z
                .string()
                .url()
                .describe("The original long URL for redirection"),
            })
            .describe("Returns the original URL"),
          404: z
            .object({
              message: z
                .string()
                .describe("Error message when the alias is not found"),
            })
            .describe("Shortened URL not found"),
        },
      },
    },
    async (request, reply) => {
      const { shortenedUrl } = request.params;

      const result = await incrementAccess({ shortenedUrl });

      if (isRight(result)) {
        return reply.status(200).send(result.right);
      }

      return reply.status(404).send({ message: "Shortened URL not found" });
    }
  );
};
