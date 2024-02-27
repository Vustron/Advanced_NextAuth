import { db } from '@/lib/db';

export const getResetPasswordTokenByEmail = async (email: string) => {
	try {
		const resetPasswordToken = await db.passwordResetToken.findFirst({
			where: {
				email,
			},
		});

		return resetPasswordToken;
	} catch {
		return null;
	}
};
