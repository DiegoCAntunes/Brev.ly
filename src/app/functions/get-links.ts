import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { asc, count, desc, ilike } from 'drizzle-orm'
import { z } from 'zod'

const getLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt', 'accessCount']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
  links: {
    id: string
    originalUrl: string
    shortenedUrl: string
    accessCount: number
    createdAt: Date
  }[]
  total: number
}

export async function getLinks(
  input: GetLinksInput
): Promise<Either<never, GetLinksOutput>> {
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getLinksInput.parse(input)

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortenedUrl: schema.links.shortenedUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortenedUrl, `%${searchQuery}%`)
          : undefined
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.createdAt)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({ total: count(schema.links.id) })
      .from(schema.links)
      .where(
        searchQuery
          ? ilike(schema.links.shortenedUrl, `%${searchQuery}%`)
          : undefined
      ),
  ])

  return makeRight({ links, total })
}