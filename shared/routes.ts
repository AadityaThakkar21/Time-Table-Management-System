import { z } from "zod";
import { generatedFiles, scheduleEntries } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  files: {
    list: {
      method: "GET" as const,
      path: "/api/files",
      responses: {
        200: z.array(z.custom<typeof generatedFiles.$inferSelect>()),
      },
    },
    upload: {
      method: "POST" as const,
      path: "/api/upload",
      // input is multipart/form-data, handled by multer, so we don't strictly validate body schema here
      responses: {
        201: z.custom<typeof generatedFiles.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    download: {
      method: "GET" as const,
      path: "/api/files/:id/download",
      responses: {
        200: z.any(), // File stream
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
