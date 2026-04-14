import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '../../../../db';
import { productCategorySchema, productSchema } from '../../../../db/schema';
import { productCategoryPostSchema } from '../../../../db/zod';
import {
  normalizeCategoryId,
  normalizeCategoryName,
} from '../../../../utils/product-category';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const categoryId = normalizeCategoryId(params.id);

    if (!categoryId) {
      return NextResponse.json(
        { message: 'Invalid product category id' },
        { status: 400 },
      );
    }

    const category = await db.query.productCategorySchema.findFirst({
      where: eq(productCategorySchema.id, categoryId),
      with: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Product category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Product category fetched successfully',
        data: category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching product category:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch product category',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const currentCategoryId = normalizeCategoryId(params.id);

    if (!currentCategoryId) {
      return NextResponse.json(
        { message: 'Invalid product category id' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsedBody = productCategoryPostSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: parsedBody.error.issues,
        },
        { status: 400 },
      );
    }

    const [existingCategory] = await db
      .select()
      .from(productCategorySchema)
      .where(eq(productCategorySchema.id, currentCategoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Product category not found' },
        { status: 404 },
      );
    }

    const nextCategoryName = normalizeCategoryName(parsedBody.data.name);
    const nextCategoryId = normalizeCategoryId(nextCategoryName);

    if (!nextCategoryId) {
      return NextResponse.json(
        {
          message:
            'Invalid category name. Please use at least one letter.',
        },
        { status: 400 },
      );
    }

    if (nextCategoryId !== currentCategoryId) {
      const [conflictingCategory] = await db
        .select()
        .from(productCategorySchema)
        .where(eq(productCategorySchema.id, nextCategoryId))
        .limit(1);

      if (conflictingCategory) {
        return NextResponse.json(
          { message: 'Product category with this id already exists' },
          { status: 409 },
        );
      }
    }

    const updatedCategory = await db.transaction(async (tx) => {
      const [category] = await tx
        .update(productCategorySchema)
        .set({
          id: nextCategoryId,
          name: nextCategoryName,
          updatedAt: new Date(),
        })
        .where(eq(productCategorySchema.id, currentCategoryId))
        .returning();

      await tx
        .update(productSchema)
        .set({
          category: nextCategoryName,
          updatedAt: new Date(),
        })
        .where(eq(productSchema.categoryId, nextCategoryId));

      return category;
    });

    return NextResponse.json(
      {
        message: 'Product category updated successfully',
        data: updatedCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating product category:', error);

    return NextResponse.json(
      {
        message: 'Failed to update product category',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export const PATCH = PUT;

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const categoryId = normalizeCategoryId(params.id);

    if (!categoryId) {
      return NextResponse.json(
        { message: 'Invalid product category id' },
        { status: 400 },
      );
    }

    const [existingCategory] = await db
      .select()
      .from(productCategorySchema)
      .where(eq(productCategorySchema.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Product category not found' },
        { status: 404 },
      );
    }

    const linkedProducts = await db
      .select({ id: productSchema.id })
      .from(productSchema)
      .where(eq(productSchema.categoryId, categoryId));

    if (linkedProducts.length > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete product category. It is associated with ${linkedProducts.length} product(s).`,
          error: 'Product category is in use',
          productsCount: linkedProducts.length,
        },
        { status: 409 },
      );
    }

    const [deletedCategory] = await db
      .delete(productCategorySchema)
      .where(eq(productCategorySchema.id, categoryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Product category deleted successfully',
        data: deletedCategory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting product category:', error);

    return NextResponse.json(
      {
        message: 'Failed to delete product category',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
