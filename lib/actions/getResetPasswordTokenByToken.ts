import { db } from '@/lib/db';

export const getResetPasswordTokenByToken = async (token: string) => {
	try {
		const resetPasswordToken = await db.passwordResetToken.findUnique({
			where: {
				token,
			},
		});

		return resetPasswordToken;
	} catch {
		return null;
	}
};
