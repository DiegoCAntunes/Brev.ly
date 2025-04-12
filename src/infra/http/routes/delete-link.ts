import { deleteLink } from '@/app/functions/delete-link'
import { isRight } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links/:id',
    {
      schema: {
        summary: 'Delete a shortened URL',
        tags: ['links'],
        params: z.object({
          id: z.string().uuid(),
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
      const { id } = request.params

      const result = await deleteLink({ id })

      if (isRight(result)) {
        return reply.status(204).send()
      }

      return reply.status(404).send({ message: 'Link not found' })
    }
  )
}