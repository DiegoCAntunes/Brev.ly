import { exportLinks } from '@/app/functions/export-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/export',
    {
      schema: {
        summary: 'Export links to CSV',
        tags: ['links'],
        querystring: z.object({
          format: z.enum(['csv']).optional().default('csv'),
        }),
        response: {
          200: z.object({
            url: z.string().url(),
            expiresAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { format } = request.query

      const result = await exportLinks({ format })

      const { url, expiresAt } = unwrapEither(result)

      return reply.status(200).send({ url, expiresAt })
    }
  )
}