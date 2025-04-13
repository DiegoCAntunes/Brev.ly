import { incrementAccess } from '@/app/functions/increment-access'
import { isRight } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const incrementAccessRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/:shortenedUrl',
    {
      schema: {
        summary: 'Increment access count for a shortened URL',
        description: 'Increments the access count and returns the original URL for redirection.',
        tags: ['links'],
        params: z.object({
          shortenedUrl: z.string().describe('The custom alias of the shortened URL'),
        }),
        response: {
          200: z.object({
            originalUrl: z.string().url().describe('The original long URL for redirection'),
          }).describe('Returns the original URL after incrementing access count'),
          404: z.object({
            message: z.string().describe('Error message when the alias is not found'),
          }).describe('Shortened URL not found'),
        },
      },
    },
    async (request, reply) => {
      const { shortenedUrl } = request.params

      const result = await incrementAccess({ shortenedUrl })

      if (isRight(result)) {
        return reply.status(200).send(result.right)
      }

      return reply.status(404).send({ message: 'Shortened URL not found' })
    }
  )
}