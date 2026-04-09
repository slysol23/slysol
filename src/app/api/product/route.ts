import { NextResponse } from 'next/server';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../../../db';
import { productCategorySchema, productSchema } from '../../../db/schema';
import { productGetQuerySchema, productPostSchema } from '../../../db/zod';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedQuery = productGetQuerySchema.safeParse({
      id: searchParams.get('id') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
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

    const { id, categoryId, page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;

    if (id) {
      const product = await db.query.productSchema.findFirst({
        where: eq(productSchema.id, id),
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

    const countQuery = categoryId
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(productSchema)
          .where(eq(productSchema.categoryId, categoryId))
      : db.select({ count: sql<number>`count(*)::int` }).from(productSchema);

    const [{ count }] = await countQuery;
    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

    const products = await db.query.productSchema.findMany({
      where: categoryId ? eq(productSchema.categoryId, categoryId) : undefined,
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

    const normalizedCategoryId = data.category_id
      .trim()
      .replace(/\s+/g, '_')
      .toUpperCase();

    const [existingCategory] = await db
      .select()
      .from(productCategorySchema)
      .where(eq(productCategorySchema.id, normalizedCategoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        {
          message: 'Product category not found',
        },
        { status: 404 },
      );
    }

    const [product] = await db
      .insert(productSchema)
      .values({
        categoryId: existingCategory.id,
        category: existingCategory.name,
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
      })
      .returning();

    const createdProduct = await db.query.productSchema.findFirst({
      where: eq(productSchema.id, product.id),
      with: {
        productCategory: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        data: createdProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);

    return NextResponse.json(
      {
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
