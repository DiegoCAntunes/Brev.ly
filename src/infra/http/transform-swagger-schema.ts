import { FastifySchema } from 'fastify'

export function transformSwaggerSchema({
  schema,
  url,
}: {
  schema: FastifySchema
  url: string
}) {
  return {
    ...schema,
    tags: [...(schema.tags || []), url.startsWith('/links') ? 'links' : 'other'],
  }
}