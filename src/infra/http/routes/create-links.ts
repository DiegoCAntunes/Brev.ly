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
        description: 'Creates a new shortened URL. Returns 409 if the shortened URL already exists.',
        tags: ['links'],
        body: z.object({
          originalUrl: z.string().url(),
          shortenedUrl: z.string().regex(/^[a-zA-Z0-9_-]*$/).min(3).max(20),
        }),
        response: {
          201: {
            description: 'Successful creation',
            content: {
              'application/json': {
                schema: z.object({
                  id: z.string(),
                  originalUrl: z.string(),
                  shortenedUrl: z.string(),
                  accessCount: z.number(),
                  createdAt: z.date(),
                }),
                example: {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  originalUrl: 'https://example.com/long-url',
                  shortenedUrl: 'exmpl',
                  accessCount: 0,
                  createdAt: '2023-01-01T00:00:00.000Z'
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
                example: {
                  message: 'Invalid URL format',
                  issues: [
                    {
                      code: 'invalid_string',
                      validation: 'url',
                      path: ['originalUrl'],
                      message: 'Invalid URL'
                    }
                  ]
                }
              }
            }
          },
          409: {
            description: 'Conflict - Shortened URL exists',
            content: {
              'application/json': {
                schema: z.object({
                  message: z.string()
                }),
                example: {
                  message: 'Shortened URL already exists'
                }
              }
            }
          }
        }
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