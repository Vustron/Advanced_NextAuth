'use client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { resetPassword } from '@/lib/actions/resetPassword';
import { FormSuccess } from '@/components/ui/form-success';
import { FormError } from '@/components/ui/form-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '@/lib/schemas';
import { Button } from '@/components//ui/button';
import { useTransition, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const ResetPasswordForm = () => {
	// init state
	const [error, setIsError] = useState<string | undefined>('');
	const [success, setIsSuccess] = useState<string | undefined>('');
	// init transition
	const [isPending, startTransition] = useTransition();

	// init form
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	// handle submit
	const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
		setIsError('');
		setIsSuccess('');

		startTransition(() => {
			resetPassword(values).then((data) => {
				setIsError(data?.error);
				// TODO: add 2-factor
				setIsSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Forgot your password?'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						{/* Email */}
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>

									<FormControl>
										<Input
											disabled={isPending}
											{...field}
											placeholder='johndoe@example.com'
											type='email'
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormError message={error} />
					<FormSuccess message={success} />

					<Button disabled={isPending} type='submit' className='w-full'>
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
