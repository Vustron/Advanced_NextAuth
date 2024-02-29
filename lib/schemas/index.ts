import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z
	.object({
		name: z.optional(
			z.string().min(1, {
				message: 'Name is required',
			})
		),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.optional(z.string().email()),
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
	})
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: 'Password is required!',
			path: ['Password'],
		}
	)
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		}
	);

export const NewPasswordSchema = z.object({
	password: z.string().min(6, {
		message: 'Minimum of 6 characters is required',
	}),
});

export const ResetPasswordSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
});

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),
	code: z.optional(
		z.string().min(1, {
			message: 'Two-Factor code is required',
		})
	),
});

export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'Email is required',
	}),
	password: z.string().min(6, {
		message: 'Minimum of 6 characters is required',
	}),
	name: z.string().min(1, {
		message: 'Name is required',
	}),
});
