import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '../../../../db';
import { productCategorySchema, productSchema } from '../../../../db/schema';
import { productPostSchema } from '../../../../db/zod';
import { auth } from 'auth';
import {
  normalizeCategoryId,
  normalizeCategoryName,
} from '../../../../utils/product-category';

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

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

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

    if (!normalizedCategoryId) {
      return NextResponse.json(
        {
          message: 'Invalid category name. Please use at least one letter.',
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
        name: normalizedCategoryName,
        updatedBy: session.user.name?.trim() || 'Dashboard User',
      });
    }

    const categoryName = existingCategory?.name ?? normalizedCategoryName;

    const [updatedProduct] = await db
      .update(productSchema)
      .set({
        categoryId: normalizedCategoryId,
        category: categoryName,
        title: data.title,
        images: data.images,
        overview: data.overview,
        challenges: data.challenges,
        approach: data.approach,
        outcomes: data.outcomes,
        feedback: data.feedback,
        techstack: data.techstack,
        description: data.description,
        updatedBy: session.user.name,
      })
      .where(eq(productSchema.id, productId))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json(
        {
          message: 'Failed to update product',
          error: 'Product update did not return a row',
        },
        { status: 500 },
      );
    }

    const product = await db.query.productSchema.findFirst({
      where: eq(productSchema.id, updatedProduct.id),
      with: {
        productCategory: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: 'Failed to update product',
          error: 'Updated product could not be reloaded',
        },
        { status: 500 },
      );
    }

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

    if (!deletedProduct) {
      return NextResponse.json(
        {
          message: 'Failed to delete product',
          error: 'Product deletion did not return a row',
        },
        { status: 500 },
      );
    }

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

    if (typeof body.is_published !== 'boolean') {
      return NextResponse.json(
        { message: 'is_published must be boolean' },
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

    const [updatedProduct] = await db
      .update(productSchema)
      .set({
        is_published: body.is_published,
      })
      .where(eq(productSchema.id, productId))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json(
        {
          message: 'Failed to update publish status',
          error: 'Publish update did not return a row',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: `Product ${
          body.is_published ? 'published' : 'drafted'
        } successfully`,
        data: updatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating publish status:', error);

    return NextResponse.json(
      {
        message: 'Failed to update publish status',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
