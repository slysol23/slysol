import { z } from 'zod';
import { PRODUCT_CATEGORY_PAGE_SIZE } from '@/utils/product-category';

const jsonStringArraySchema = z.union([
  z.array(z.string().min(1)),
  z.string().transform((value, ctx) => {
    try {
      const parsed = JSON.parse(value);

      if (
        !Array.isArray(parsed) ||
        parsed.some((item) => typeof item !== 'string')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be an array of strings',
        });
        return z.NEVER;
      }

      return parsed;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON array string',
      });
      return z.NEVER;
    }
  }),
]);

export const productGetQuerySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  categoryId: z.string().trim().toUpperCase().optional(),
  published: z.coerce.boolean(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const productCategoryGetQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(PRODUCT_CATEGORY_PAGE_SIZE),
});

export const productPostSchema = z.object({
  category_id: z.string().trim().min(1, 'category is required'),
  title: z.string().trim().min(1, 'title is required'),
  images: jsonStringArraySchema,
  overview: z.string().trim().min(1, 'overview is required'),
  challenges: z.string().trim().default(''),
  approach: z.string().trim().default(''),
  outcomes: z.string().trim().default(''),
  feedback: z.string().trim().default(''),
  techstack: jsonStringArraySchema,
  description: z.string().trim().min(1, 'description is required'),
  updated_by: z.string().trim().min(1, 'updated_by is required'),
  is_published: z.coerce.boolean(),
});

export const productPatchSchema = productPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

const productCategoryIdSchema = z
  .string()
  .trim()
  .min(1, 'id is required')
  .max(255);

const productCategoryNameSchema = z
  .string()
  .trim()
  .min(1, 'name is required')
  .max(255);

export const productCategoryPostSchema = z.object({
  name: productCategoryNameSchema,
});

export const productCategoryPatchSchema = z
  .object({
    id: productCategoryIdSchema.optional(),
    name: productCategoryNameSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type ProductGetQueryInput = z.infer<typeof productGetQuerySchema>;
export type ProductCategoryGetQueryInput = z.infer<
  typeof productCategoryGetQuerySchema
>;
export type ProductPostInput = z.infer<typeof productPostSchema>;
export type ProductPatchInput = z.infer<typeof productPatchSchema>;
export type ProductCategoryPostInput = z.infer<
  typeof productCategoryPostSchema
>;
export type ProductCategoryPatchInput = z.infer<
  typeof productCategoryPatchSchema
>;
