'use server';

import { sendResetPasswordEmail } from '@/lib/actions/sendVerificationEmail';
import { generateResetPasswordToken } from '@/lib/actions/generateToken';
import { getUserByEmail } from '@/lib/actions/getUserByEmail';
import { ResetPasswordSchema } from '@/lib/schemas';
import * as z from 'zod';

export const resetPassword = async (
	values: z.infer<typeof ResetPasswordSchema>
) => {
	const validatedFields = ResetPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid email!' };
	}

	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: 'Email not found!' };
	}

	const passwordResetToken = await generateResetPasswordToken(email);

	await sendResetPasswordEmail(
		passwordResetToken.email,
		passwordResetToken.token
	);

	return { success: 'Reset password email sent!' };
};
