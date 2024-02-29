'use client';

import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { FormSuccess } from '@/components/ui/form-success';
import { FormError } from '@/components/ui/form-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { settings } from '@/lib/actions/settings';
import { Switch } from '@/components/ui/switch';
import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SettingsSchema } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SettingsPage = () => {
	// get user
	const user = useCurrentUser();
	// init state
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	// session
	const { update } = useSession();
	// init pending
	const [isPending, startTransition] = useTransition();

	// init form
	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	});

	// update name
	const updateData = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}

					if (data.success) {
						update();
						setSuccess(data.success);
					}
				})
				.catch(() => setError('Something went wrong!'));
		});
	};
	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>⚙️Settings</p>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form className='space-y-6' onSubmit={form.handleSubmit(updateData)}>
						<div className='space-y-4'>
							{/* Name */}
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='John Doe'
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{user?.isOAuth === false && (
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
														{...field}
														type='email'
														placeholder='john.doe@email.com'
														disabled={isPending}
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
														{...field}
														type='password'
														placeholder='******'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* NewPassword */}
									<FormField
										control={form.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														type='password'
														placeholder='******'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							{/* Role */}
							<FormField
								control={form.control}
								name='role'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a role' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
												<SelectItem value={UserRole.USER}>User</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							{user?.isOAuth === false && (
								<>
									{/* TwoFactor */}
									<FormField
										control={form.control}
										name='isTwoFactorEnabled'
										render={({ field }) => (
											<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
												<div className='space-y-0.5'>
													<FormLabel>Two Factor Authentication</FormLabel>
													<FormDescription>
														Enable two factor authentication for your account
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														disabled={isPending}
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</>
							)}
						</div>

						<FormError message={error} />
						<FormSuccess message={success} />

						<Button type='submit' disabled={isPending}>
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;
