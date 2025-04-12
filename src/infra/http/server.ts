import { env } from '@/env'
import { createLinkRoute } from '@/infra/http/routes/create-links'
import { deleteLinkRoute } from '@/infra/http/routes/delete-link'
import { exportLinksRoute } from '@/infra/http/routes/export-links'
import { getLinksRoute } from '@/infra/http/routes/get-links'
import { incrementAccessRoute } from '@/infra/http/routes/increment-access'
import { redirectRoute } from '@/infra/http/routes/redirect'
import { transformSwaggerSchema } from '@/infra/http/transform-swagger-schema'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  console.error(error)
  return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.iy URL Shortener',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(createLinkRoute)
server.register(getLinksRoute)
//server.register(deleteLinkRoute)
//server.register(redirectRoute)
//server.register(incrementAccessRoute)
//server.register(exportLinksRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server running!')
})