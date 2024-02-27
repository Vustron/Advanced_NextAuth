import { getVerificationTokenByEmail } from '@/lib/actions/getVerificationTokenByEmail';
import { getResetPasswordTokenByEmail } from './getResetPasswordTokenByEmail';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await db.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return verificationToken;
};

export const generateResetPasswordToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getResetPasswordTokenByEmail(email);

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	const resetPasswordToken = await db.passwordResetToken.create({
		data: {
			email,
			token,
			expires,
		},
	});

	return resetPasswordToken;
};
