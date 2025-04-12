import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { S3Client } from '@/infra/storage/s3-client'
import { type Either, makeRight } from '@/infra/shared/either'
import { format } from 'date-fns'
import { stringify } from 'csv-stringify/sync'
import { z } from 'zod'

const exportLinksInput = z.object({
  format: z.enum(['csv']).default('csv'),
})

type ExportLinksInput = z.input<typeof exportLinksInput>
type ExportLinksOutput = { url: string; expiresAt: Date }

export async function exportLinks(
  input: ExportLinksInput
): Promise<Either<never, ExportLinksOutput>> {
  const { format: exportFormat } = exportLinksInput.parse(input)

  const links = await db.query.links.findMany({
    columns: {
      id: true,
      originalUrl: true,
      shortenedUrl: true,
      accessCount: true,
      createdAt: true,
    },
  })

  const csvData = stringify(
    links.map(link => ({
      id: link.id,
      original_url: link.originalUrl,
      shortened_url: link.shortenedUrl,
      access_count: link.accessCount,
      created_at: format(link.createdAt, 'yyyy-MM-dd HH:mm:ss'),
    })),
    {
      header: true,
    }
  )

  const fileName = `links-export-${Date.now()}.csv`
  const { url, expiresAt } = await S3Client.uploadFile({
    bucket: env.STORAGE_BUCKET_NAME,
    key: `exports/${fileName}`,
    body: csvData,
    contentType: 'text/csv',
  })

  return makeRight({ url, expiresAt })
}