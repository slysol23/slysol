// import { NextResponse } from 'next/server';
// import { db } from 'db';
// import { userSchema } from 'db/schema';
// import { eq } from 'drizzle-orm';
// import bcrypt from 'bcryptjs';
// import { auth } from 'auth';

// export async function POST(req: Request) {
//   try {
//     // Check if user is authenticated and is admin
//     const session = await auth();

//     if (!session?.user) {
//       return NextResponse.json(
//         { error: 'Unauthorized - Please login' },
//         { status: 401 },
//       );
//     }

//     if (!(session.user as any).isAdmin) {
//       return NextResponse.json(
//         { error: 'Forbidden - Only admins can register users' },
//         { status: 403 },
//       );
//     }

//     // Parse request body
//     const body = await req.json();
//     const { name, email, password } = body;

//     // Validate input
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: 'Name, email, and password are required' },
//         { status: 400 },
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 },
//       );
//     }

//     // Validate password length
//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'Password must be at least 6 characters long' },
//         { status: 400 },
//       );
//     }

//     // Check if user already exists
//     const [existingUser] = await db
//       .select()
//       .from(userSchema)
//       .where(eq(userSchema.email, email))
//       .limit(1);

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User with this email already exists' },
//         { status: 409 },
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const [newUser] = await db
//       .insert(userSchema)
//       .values({
//         name,
//         email,
//         password: hashedPassword,
//       })
//       .returning({
//         id: userSchema.id,
//         name: userSchema.name,
//         email: userSchema.email,
//         createdAt: userSchema.createdAt,
//       });

//     return NextResponse.json(
//       {
//         message: 'User registered successfully',
//         user: newUser,
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 },
//     );
//   }
// }
