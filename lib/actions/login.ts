'use server';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/lib/schemas';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields!' };
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid Credentials' };

				default:
					return { error: 'Something went wrong' };
			}
		}

		throw error;
	}
};
