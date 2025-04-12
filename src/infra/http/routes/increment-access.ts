import { incrementAccess } from '@/app/functions/increment-access'
import { isRight } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const incrementAccessRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/:shortenedUrl/access',
    {
      schema: {
        summary: 'Increment access count for a shortened URL',
        tags: ['links'],
        params: z.object({
          shortenedUrl: z.string(),
        }),
        response: {
          204: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortenedUrl } = request.params

      const result = await incrementAccess({ shortenedUrl })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      return reply.status(404).send({ message: 'Shortened URL not found' })
    }
  )
}