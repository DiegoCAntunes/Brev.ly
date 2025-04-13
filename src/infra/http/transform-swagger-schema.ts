import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import type { FastifySchema } from 'fastify'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  // Convert Zod-based responses to OpenAPI format
  if (schema.response) {
    const responses: Record<string, any> = {}
    for (const [statusCode, response] of Object.entries(schema.response)) {
      if (response && typeof response === 'object' && '_def' in response) {
        responses[statusCode] = {
          description: statusCode === '200' ? 'Successful response' : 'Error response',
          content: {
            'application/json': { schema: response }
          }
        }
      } else {
        responses[statusCode] = response
      }
    }
    schema.response = responses
  }

  return { schema, url }
}