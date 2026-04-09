import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '../../../../db';
import { productCategorySchema, productSchema } from '../../../../db/schema';
import { productPostSchema } from '../../../../db/zod';

const normalizeCategoryName = (value: string) =>
  value.trim().replace(/\s+/g, ' ');

const normalizeCategoryId = (value: string) =>
  value
    .trim()
    .replace(/[0-9]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, { params }: Props) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product id' },
        { status: 400 },
      );
    }

    const product = await db.query.productSchema.findFirst({
      where: eq(productSchema.id, productId),
      with: {
        productCategory: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Product fetched successfully',
        data: product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching product:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch product',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product id' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsedBody = productPostSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: parsedBody.error.issues,
        },
        { status: 400 },
      );
    }

    const data = parsedBody.data;

    const [existingProduct] = await db
      .select()
      .from(productSchema)
      .where(eq(productSchema.id, productId))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    const normalizedCategoryName = normalizeCategoryName(data.category_id);
    const normalizedCategoryId = normalizeCategoryId(normalizedCategoryName);
    const normalizedCategory = normalizedCategoryName.toLowerCase();

    if (!normalizedCategoryId) {
      return NextResponse.json(
        {
          message: 'Invalid category name. Please use letters or spaces only.',
        },
        { status: 400 },
      );
    }

    const [existingCategory] = await db
      .select()
      .from(productCategorySchema)
      .where(eq(productCategorySchema.id, normalizedCategoryId))
      .limit(1);

    if (!existingCategory) {
      await db.insert(productCategorySchema).values({
        id: normalizedCategoryId,
        name: normalizedCategory,
      });
    }

    const [updatedProduct] = await db
      .update(productSchema)
      .set({
        categoryId: normalizedCategoryId,
        category: normalizedCategory,
        title: data.title,
        images: data.images,
        subtitle: data.subtitle,
        overview: data.overview,
        challenges: data.challenges,
        approach: data.approach,
        outcomes: data.outcomes,
        feedback: data.feedback,
        techstack: data.techstack,
        date: data.date,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(productSchema.id, productId))
      .returning();

    const product = await db.query.productSchema.findFirst({
      where: eq(productSchema.id, updatedProduct.id),
      with: {
        productCategory: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Product updated successfully',
        data: product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating product:', error);

    return NextResponse.json(
      {
        message: 'Failed to update product',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Props) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { message: 'Invalid product id' },
        { status: 400 },
      );
    }

    const [existingProduct] = await db
      .select()
      .from(productSchema)
      .where(eq(productSchema.id, productId))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    const [deletedProduct] = await db
      .delete(productSchema)
      .where(eq(productSchema.id, productId))
      .returning();

    return NextResponse.json(
      {
        message: 'Product deleted successfully',
        data: deletedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting product:', error);

    return NextResponse.json(
      {
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
