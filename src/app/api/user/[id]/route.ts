import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { userSchema } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/** GET — Get user by ID */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = Number(params.id);

    const user = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User fetched successfully', data: user[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user', error: String(error) },
      { status: 500 },
    );
  }
}

/** PATCH — Update user with hashed password */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = Number(params.id);
    const body = await req.json();
    const { name, email, password, isAdmin } = body;

    if (email) {
      const [existingUser] = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email))
        .limit(1);

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 },
        );
      }
    }

    const updateData: Record<string, any> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (password !== undefined && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (isAdmin !== undefined) {
      updateData.isAdmin = isAdmin;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No fields to update' },
        { status: 400 },
      );
    }

    const [updatedUser] = await db
      .update(userSchema)
      .set(updateData)
      .where(eq(userSchema.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User updated successfully', data: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user', error: String(error) },
      { status: 500 },
    );
  }
}

/** DELETE — Delete user */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = Number(params.id);

    const deleted = await db
      .delete(userSchema)
      .where(eq(userSchema.id, userId))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting User:', error);
    return NextResponse.json(
      { message: 'Failed to delete user', error: String(error) },
      { status: 500 },
    );
  }
}
