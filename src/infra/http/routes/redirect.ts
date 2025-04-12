import { getOriginalUrl } from '@/app/functions/get-original-url'
import { isRight } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const redirectRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/:shortenedUrl',
    {
      schema: {
        summary: 'Redirect to original URL',
        tags: ['links'],
        params: z.object({
          shortenedUrl: z.string(),
        }),
        response: {
          302: z.void(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortenedUrl } = request.params

      const result = await getOriginalUrl({ shortenedUrl })

      if (isRight(result)) {
        const { originalUrl } = result.right
        return reply.redirect(originalUrl)
      }

      return reply.status(404).send({ message: 'Shortened URL not found' })
    }
  )
}