// import GitHub from 'next-auth/providers/github';
import { getUserByEmail } from '@/lib/actions/getUserByEmail';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { LoginSchema } from '@/lib/schemas';
import bcrypt from 'bcryptjs';

export default {
	providers: [
		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);

					if (!user || !user.password) return null;

					const passwordMatch = await bcrypt.compare(password, user.password);

					if (passwordMatch) return user;
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
