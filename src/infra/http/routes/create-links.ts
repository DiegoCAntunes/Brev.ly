import { createLink } from '@/app/functions/create-link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a shortened URL',
        description: 'Creates a shortened URL using a custom alias and the original long URL.',
        tags: ['links'],
        body: z.object({
          originalUrl: z
            .string()
            .url()
            .describe('The original long URL to shorten'),
          shortenedUrl: z
            .string()
            .regex(/^[a-zA-Z0-9_-]*$/)
            .min(3)
            .max(20)
            .describe('Custom alias for the shortened URL (3-20 characters)'),
        }),
        response: {
          201: z.object({
            id: z.string().describe('Unique identifier for the shortened link'),
            originalUrl: z.string().describe('The original long URL'),
            shortenedUrl: z.string().describe('The user-defined shortened URL'),
            accessCount: z.number().describe('Number of times the link has been accessed'),
            createdAt: z.date().describe('Date and time the link was created'),
          }).describe('Successfully created shortened URL'),
          409: z.object({
            message: z.string().describe('Error message when the alias already exists'),
          }).describe('Shortened URL already exists'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortenedUrl } = request.body
      const result = await createLink({ originalUrl, shortenedUrl })

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result))
      }

      return reply.status(409).send({ message: 'Shortened URL already exists' })
    }
  )
}