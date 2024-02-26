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
import { FormError } from '@/components/ui/form-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components//ui/button';
import { useTransition, useState } from 'react';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions/login';
import { LoginSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const LoginForm = () => {
	// init searchParams
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with different provider'
			: '';

	// init state
	const [error, setIsError] = useState<string | undefined>('');
	const [success, setIsSuccess] = useState<string | undefined>('');
	// init transition
	const [isPending, startTransition] = useTransition();

	// init form
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// handle submit
	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setIsError('');
		setIsSuccess('');

		startTransition(() => {
			login(values).then((data) => {
				setIsError(data?.error);
				// TODO: add when 2-factor
				//setIsSuccess(data?.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel='Don`t have an account?'
			backButtonHref='/auth/register'
			showSocial
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

						{/* Password */}
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

					<FormError message={error || urlError} />
					<FormSuccess message={success} />

					<Button disabled={isPending} type='submit' className='w-full'>
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
