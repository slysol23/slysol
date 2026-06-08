import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
import { auth } from 'auth';

import { db } from '../../../db';
import { productCategorySchema } from '../../../db/schema';
import {
  productCategoryGetQuerySchema,
  productCategoryPostSchema,
} from '../../../db/zod';
import {
  normalizeCategoryId,
  normalizeCategoryName,
} from '../../../utils/product-category';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedQuery = productCategoryGetQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: parsedQuery.error.issues,
        },
        { status: 400 },
      );
    }

    const { page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productCategorySchema);

    const records = Number(count);
    const totalPages = Math.ceil(records / limit);

    const categories = await db
      .select()
      .from(productCategorySchema)
      .orderBy(desc(productCategorySchema.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(
      {
        message: 'Product categories fetched successfully',
        meta: {
          records,
          page,
          limit,
          total_pages: totalPages,
        },
        data: categories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching product categories:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch product categories',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth().catch(() => null);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 },
      );
    }

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

    const normalizedName = normalizeCategoryName(parsedBody.data.name);
    const normalizedId = normalizeCategoryId(normalizedName);

    if (!normalizedId) {
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
      .where(eq(productCategorySchema.id, normalizedId))
      .limit(1);

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Product category with this name already exists' },
        { status: 409 },
      );
    }

    const [createdCategory] = await db
      .insert(productCategorySchema)
      .values({
        id: normalizedId,
        name: normalizedName,
        updatedBy: session.user.name?.trim() || 'Dashboard User',
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Product category created successfully',
        data: createdCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product category:', error);

    return NextResponse.json(
      {
        message: 'Failed to create product category',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
