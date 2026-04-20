import { z } from 'zod';

export const parseMultilineList = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export const parseTechStackList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

export const productBaseFormShape = {
  category_id: z.string().trim().min(1, 'Category is required'),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  overview: z.string().trim().min(1, 'Overview is required'),
  challenges: z.string().trim().min(1, 'Challenges are required'),
  approach: z.string().trim().min(1, 'Approach is required'),
  outcomes: z.string().trim().min(1, 'Outcomes are required'),
  feedback: z.string().trim().min(1, 'Feedback is required'),
  imagesText: z
    .string()
    .trim()
    .refine(
      (value) => parseMultilineList(value).length > 0,
      'Add at least one image URL or path',
    ),
  techstackText: z
    .string()
    .trim()
    .refine(
      (value) => parseTechStackList(value).length > 0,
      'Add at least one tech stack item',
    ),
};

export const ProductEditFormSchema = z.object(productBaseFormShape);

export const ProductCreateFormSchema = ProductEditFormSchema.extend({
  is_published: z.boolean().default(false),
});

export type ProductCreateForm = z.input<typeof ProductCreateFormSchema>;
export type ProductEditForm = z.infer<typeof ProductEditFormSchema>;
