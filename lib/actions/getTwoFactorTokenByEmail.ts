import { db } from '@/lib/db';

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findFirst({
			where: {
				email,
			},
		});

		return twoFactorToken;
	} catch {
		return null;
	}
};
