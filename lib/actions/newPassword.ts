'use server';

import { getResetPasswordTokenByToken } from '@/lib/actions/getResetPasswordTokenByToken';
import { getUserByEmail } from '@/lib/actions/getUserByEmail';
import { NewPasswordSchema } from '@/lib/schemas';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import * as z from 'zod';

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null
) => {
	if (!token) {
		return { error: 'Missing token!' };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields' };
	}

	const { password } = validatedFields.data;

	const existingToken = await getResetPasswordTokenByToken(token);

	if (!existingToken) {
		return { error: 'Missing token!' };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: 'Token has expired!' };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: 'Email does not exist!' };
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	await db.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({
		where: {
			id: existingToken.id,
		},
	});

	return { success: 'Password updated!' };
};
