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
        tags: ['links'],
        body: z.object({
          originalUrl: z.string().url(),
          shortenedUrl: z.string().regex(/^[a-zA-Z0-9_-]*$/).min(3).max(20),
        }),
        response: {
          201: z.object({
            id: z.string(),
            originalUrl: z.string(),
            shortenedUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortenedUrl } = request.body

      const result = await createLink({ originalUrl, shortenedUrl })

      if (isRight(result)) {
        const link = unwrapEither(result)
        return reply.status(201).send(link)
      }

      return reply.status(409).send({ message: 'Shortened URL already exists' })
    }
  )
}