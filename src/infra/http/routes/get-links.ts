import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get all shortened URLs',
        description: 'Retrieves a paginated list of all shortened URLs with optional filtering and sorting.',
        tags: ['links'],
        querystring: z.object({
          searchQuery: z
            .string()
            .optional()
            .describe('Search term to filter links by original or shortened URL'),
          sortBy: z
            .enum(['createdAt', 'accessCount'])
            .optional()
            .describe('Field to sort by'),
          sortDirection: z
            .enum(['asc', 'desc'])
            .optional()
            .describe('Sort direction (ascending or descending)'),
          page: z
            .coerce.number()
            .optional()
            .default(1)
            .describe('Page number for pagination (default: 1)'),
          pageSize: z
            .coerce.number()
            .optional()
            .default(20)
            .describe('Number of links per page (default: 20)'),
        }),
        response: {
          200: z
            .object({
              links: z
                .array(
                  z.object({
                    id: z.string().describe('Unique identifier for the link'),
                    originalUrl: z.string().describe('The original long URL'),
                    shortenedUrl: z.string().describe('The shortened/custom URL'),
                    accessCount: z.number().describe('Number of times this link has been accessed'),
                    createdAt: z.date().describe('Date and time the link was created'),
                  })
                )
                .describe('List of shortened links'),
              total: z.number().describe('Total number of links matching the query'),
            })
            .describe('Paginated list of shortened URLs'),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } = request.query

      const result = await getLinks({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      })

      const { total, links } = unwrapEither(result)
      return reply.status(200).send({ total, links })
    }
  )
}