import { db } from '@/lib/db';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from '@/lib/actions/getUserById';
import { getTwoFactorConfirmationByUserId } from '@/lib/actions/getTwoFactorConfirmationByUserId';
import { getAccountByUserId } from '@/lib/actions/getAccountByUserId';

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

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);

				if (!twoFactorConfirmation) return false;

				await db.twoFactorConfirmation.delete({
					where: {
						id: twoFactorConfirmation.id,
					},
				});
			}

			return true;
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email! = token.email!;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},

		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
	debug: process.env.NODE_ENV === 'development',
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
	secret: process.env.NEXTAUTH_SECRET,
});
