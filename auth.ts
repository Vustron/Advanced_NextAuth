import { db } from '@/lib/db';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from '@/lib/actions/getUserById';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},

	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: {
					id: user.id,
				},
				data: {
					emailVerified: new Date(),
				},
			});
		},
	},

	callbacks: {
		async signIn({ user, account }) {
			// Allow OAuth without email verification
			if (account?.provider !== 'credentials') return true;

			const existingUser = await getUserById(user.id!);

			// prevent sign-in without email verification
			if (!existingUser?.emailVerified) return false;

			// TODO: add 2fa check

			return true;
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			return session;
		},

		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.role = existingUser.role;

			return token;
		},
	},
	debug: process.env.NODE_ENV === 'development',
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
	secret: process.env.NEXTAUTH_SECRET,
});
