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
import Link from 'next/link';
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
	const [showTwoFactor, setShowTwoFactor] = useState(false);
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
			login(values)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setIsError(data.error);
					}

					if (data?.success) {
						form.reset();
						setIsSuccess(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch(() => {
					setIsError('Something went wrong!');
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
						{showTwoFactor && (
							<>
								{/* Email */}
								<FormField
									control={form.control}
									name='code'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Two Factor Code</FormLabel>

											<FormControl>
												<Input
													disabled={isPending}
													{...field}
													placeholder='123456'
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}

						{!showTwoFactor && (
							<>
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

											<Button
												size='sm'
												variant='link'
												asChild
												className='px-0 font-normal'
											>
												<Link href='/auth/reset-password'>
													Forgot password?
												</Link>
											</Button>

											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>

					<FormError message={error || urlError} />
					<FormSuccess message={success} />

					<Button disabled={isPending} type='submit' className='w-full'>
						{showTwoFactor ? 'Confirm' : 'Login'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
