'use server';

import { LoginSchema } from '@/lib/schemas';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid Fields!' };
	}

	return { success: 'Email sent!' };
};
