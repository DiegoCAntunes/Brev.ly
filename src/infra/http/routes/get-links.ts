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
        description: 'Retrieves paginated list of shortened URLs with filtering and sorting options',
        tags: ['links'],
        querystring: z.object({
          searchQuery: z.string()
            .optional()
            .describe('Filter links by search term (matches against shortened URL)'),
          sortBy: z.enum(['createdAt', 'accessCount'])
            .optional()
            .describe('Field to sort by (createdAt or accessCount)'),
          sortDirection: z.enum(['asc', 'desc'])
            .optional()
            .describe('Sort direction (asc or desc)'),
          page: z.coerce.number()
            .min(1)
            .optional()
            .default(1)
            .describe('Page number (default: 1)'),
          pageSize: z.coerce.number()
            .min(1)
            .max(100)
            .optional()
            .default(20)
            .describe('Number of items per page (default: 20, max: 100)'),
        }),
        response: {
          200: {
            description: 'Successful response with paginated links',
            content: {
              'application/json': {
                schema: z.object({
                  links: z.array(
                    z.object({
                      id: z.string(),
                      originalUrl: z.string(),
                      shortenedUrl: z.string(),
                      accessCount: z.number(),
                      createdAt: z.date(),
                    })
                  ),
                  total: z.number(),
                }),
                examples: {
                  default: {
                    value: {
                      links: [
                        {
                          id: '550e8400-e29b-41d4-a716-446655440000',
                          originalUrl: 'https://example.com/long-url',
                          shortenedUrl: 'exmpl',
                          accessCount: 42,
                          createdAt: '2023-01-01T00:00:00.000Z'
                        }
                      ],
                      total: 1
                    }
                  },
                  empty: {
                    value: {
                      links: [],
                      total: 0
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: z.object({
                  message: z.string(),
                  issues: z.array(z.any()).optional()
                }),
                examples: {
                  invalidPage: {
                    value: {
                      message: 'Invalid query parameters',
                      issues: [
                        {
                          code: 'invalid_type',
                          path: ['page'],
                          message: 'Expected number, received string'
                        }
                      ]
                    }
                  },
                  invalidPageSize: {
                    value: {
                      message: 'Invalid query parameters',
                      issues: [
                        {
                          code: 'too_big',
                          path: ['pageSize'],
                          message: 'Number must be less than or equal to 100'
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    async (request, reply) => {
      try {
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
      } catch (error) {
        return reply.status(400).send({
          message: 'Invalid query parameters',
          issues: error.errors || [],
        })
      }
    }
  )
}