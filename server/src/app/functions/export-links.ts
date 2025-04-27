import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { db, pg } from "../../infra/db";
import { schema } from "../../infra/db/schemas";
import { type Either, makeRight, makeLeft } from "../../infra/shared/either";
import { uploadFileToStorage } from "../../infra/storage/upload-file-to-storage";
import { stringify } from "csv-stringify";
import { z } from "zod";
import { format } from "date-fns";

export const exportLinksInput = z.object({
  format: z.enum(["csv"]).default("csv"),
});

type ExportLinksInput = z.input<typeof exportLinksInput>;
type ExportLinksOutput = { url: string };
type ExportLinksError = "EXPORT_FAILED";

export async function exportLinks(
  input: ExportLinksInput
): Promise<Either<ExportLinksError, ExportLinksOutput>> {
  const { format: exportFormat } = exportLinksInput.parse(input);

  try {
    const { sql, params } = db
      .select({
        id: schema.links.id,
        original_url: schema.links.originalUrl,
        shortened_url: schema.links.shortenedUrl,
        access_count: schema.links.accessCount,
        created_at: schema.links.createdAt,
      })
      .from(schema.links)
      .toSQL();

    const cursor = pg.unsafe(sql, params as string[]).cursor(2);

    const csv = stringify({
      delimiter: ",",
      header: true,
      columns: [
        { key: "id", header: "ID" },
        { key: "original_url", header: "Original URL" },
        { key: "shortened_url", header: "Short URL" },
        { key: "access_count", header: "Access Count" },
        { key: "created_at", header: "Created At" },
      ],
    });

    const uploadToStorageStream = new PassThrough();

    const convertToCSVPipeline = pipeline(
      cursor,
      new Transform({
        objectMode: true,
        transform(chunks: unknown[], encoding, callback) {
          for (const chunk of chunks) {
            const row = chunk as {
              id: string;
              original_url: string;
              shortened_url: string;
              access_count: number;
              created_at: Date;
            };

            const formattedRow = {
              ...row,
              created_at: format(row.created_at, "yyyy-MM-dd HH:mm:ss"),
            };

            this.push(formattedRow);
          }

          callback();
        },
      }),
      csv,
      uploadToStorageStream
    );

    const uploadToStorage = uploadFileToStorage({
      contentType: "text/csv",
      folder: "downloads",
      fileName: `${new Date().toISOString()}-links.csv`,
      contentStream: uploadToStorageStream,
    });

    const [{ url }] = await Promise.all([
      uploadToStorage,
      convertToCSVPipeline,
    ]);

    return makeRight({ url });
  } catch (err) {
    console.error(err);
    return makeLeft("EXPORT_FAILED");
  }
}
