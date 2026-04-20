import { NextResponse } from 'next/server';
import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../../../db';
import { productCategorySchema, productSchema } from '../../../db/schema';
import { productGetQuerySchema, productPostSchema } from '../../../db/zod';
import { auth } from 'auth';
import {
  normalizeCategoryId,
  normalizeCategoryName,
} from '../../../utils/product-category';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedQuery = productGetQuerySchema.safeParse({
      id: searchParams.get('id') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      published: searchParams.get('published') ?? undefined,
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

    const { id, categoryId, published, page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;

    if (id) {
      const productWhere =
        published === true
          ? and(
              eq(productSchema.id, id),
              eq(productSchema.is_published, true),
            )
          : eq(productSchema.id, id);

      const product = await db.query.productSchema.findFirst({
        where: productWhere,
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
    }

    const conditions: SQL[] = [];

    if (categoryId) {
      conditions.push(eq(productSchema.categoryId, categoryId));
    }

    if (published === true) {
      conditions.push(eq(productSchema.is_published, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countQuery = whereClause
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(productSchema)
          .where(whereClause)
      : db.select({ count: sql<number>`count(*)::int` }).from(productSchema);

    const [{ count }] = await countQuery;
    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

    const products = await db.query.productSchema.findMany({
      where: whereClause,
      with: {
        productCategory: true,
      },
      orderBy: [desc(productSchema.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json(
      {
        message: 'Products fetched successfully',
        page,
        limit,
        total,
        totalPages,
        count: products.length,
        data: products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      {
        message: 'Failed to fetch products',
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

    const parsedBody = productPostSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsedBody.error.issues },
        { status: 400 },
      );
    }

    const data = parsedBody.data;

    // Auto-slugify - no checks, just transform
    const categoryName = normalizeCategoryName(data.category_id);
    const categoryId = normalizeCategoryId(data.category_id);

    // Auto-create or get category
    let category = await db.query.productCategorySchema.findFirst({
      where: eq(productCategorySchema.id, categoryId),
    });

    if (!category) {
      const [newCategory] = await db
        .insert(productCategorySchema)
        .values({
          id: categoryId, // "web-dev"
          name: categoryName, // "Web dev"
          updatedBy: session.user.name?.trim() || 'Dashboard User',
        })
        .returning();

      category = newCategory;
    }

    // Create product
    const [product] = await db
      .insert(productSchema)
      .values({
        categoryId: category.id,
        category: category.name,
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
        is_published: data.is_published,
      })
      .returning();

    const createdProduct = await db.query.productSchema.findFirst({
      where: eq(productSchema.id, product.id),
      with: { productCategory: true },
    });

    return NextResponse.json(
      { message: 'Product created successfully', data: createdProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product', error: String(error) },
      { status: 500 },
    );
  }
}
