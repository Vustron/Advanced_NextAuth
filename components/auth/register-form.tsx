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
import { Button } from '@/components//ui/button';
import { useTransition, useState } from 'react';
import { Input } from '@/components/ui/input';
import { register } from '@/lib/actions/register';
import { RegisterSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';

import * as z from 'zod';

export const RegisterForm = () => {
	// init state
	const [setError, setIsError] = useState<string | undefined>('');
	const [setSuccess, setIsSuccess] = useState<string | undefined>('');
	// init transition
	const [isPending, startTransition] = useTransition();

	// init form
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	// handle submit
	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setIsError('');
		setIsSuccess('');

		startTransition(() => {
			register(values).then((data) => {
				setIsError(data.error);
				setIsSuccess(data.success);
			});
		});
	};

	return (
		<CardWrapper
			headerLabel='Create an Account'
			backButtonLabel='Already have an account?'
			backButtonHref='/auth/login'
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

						{/* Name */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>

									<FormControl>
										<Input
											disabled={isPending}
											{...field}
											placeholder='John Doe'
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormError message={setError} />
					<FormSuccess message={setSuccess} />

					<Button disabled={isPending} type='submit' className='w-full'>
						Register
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
