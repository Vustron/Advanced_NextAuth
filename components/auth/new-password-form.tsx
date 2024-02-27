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
import { FormSuccess } from '@/components/ui/form-success';
import { newPassword } from '@/lib/actions/newPassword';
import { FormError } from '@/components/ui/form-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { NewPasswordSchema } from '@/lib/schemas';
import { Button } from '@/components//ui/button';
import { useTransition, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const NewPasswordForm = () => {
	// init search params
	const searchParams = useSearchParams();
	// init token
	const token = searchParams.get('token');
	// init state
	const [error, setIsError] = useState<string | undefined>('');
	const [success, setIsSuccess] = useState<string | undefined>('');
	// init transition
	const [isPending, startTransition] = useTransition();

	// init form
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	});

	// handle submit
	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setIsError('');
		setIsSuccess('');

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setIsError(data?.error);
				// TODO: add 2-factor
				setIsSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Enter a new password'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						{/* Email */}
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>

									<FormControl>
										<Input
											disabled={isPending}
											{...field}
											placeholder='******'
											type='password'
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
						Reset password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
