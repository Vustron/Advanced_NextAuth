'use server';

import {
	generateVerificationToken,
	generateTwoFactorToken,
} from '@/lib/actions/generateToken';
import {
	sendVerificationEmail,
	sendTwoFactorTokenEmail,
} from '@/lib/actions/sendVerificationEmail';
import { getTwoFactorConfirmationByUserId } from '@/lib/actions/getTwoFactorConfirmationByUserId';
import { getTwoFactorTokenByEmail } from '@/lib/actions/getTwoFactorTokenByEmail';
import { getUserByEmail } from '@/lib/actions/getUserByEmail';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/lib/schemas';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { db } from '@/lib/db';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields!' };
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: 'Email does not exist' };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return {
			success:
				'Confirmation email sent! Please confirm your email first in order to login',
		};
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: 'Invalid code!' };
			}

			if (twoFactorToken.token !== code) {
				return { error: 'Invalid code' };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: 'Code expired!' };
			}

			await db.twoFactorToken.delete({
				where: {
					id: twoFactorToken.id,
				},
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: {
						id: existingConfirmation.id,
					},
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
	}

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
