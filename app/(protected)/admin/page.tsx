'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useCurrentRole } from '@/lib/hooks/useCurrentRole';
import { FormSuccess } from '@/components/ui/form-success';
import { RoleGate } from '@/components/auth/role-gate';
import { Button } from '@/components/ui/button';
import { admin } from '@/lib/actions/admin';
import { UserRole } from '@prisma/client';
import { toast } from 'sonner';

const AdminPage = () => {
	// init role
	const role = useCurrentRole();

	// handle onClick
	const onApiRouteClick = () => {
		fetch('/api/admin').then((response) => {
			if (response.ok) {
				toast.success('Allowed API route');
			} else {
				toast.error('Forbidden API route');
			}
		});
	};

	const onServerActionClick = () => {
		admin().then((data) => {
			if (data.error) {
				toast.error(data.error);
			}

			if (data.success) {
				toast.success(data.success);
			}
		});
	};

	return (
		<Card className='w-[600px]'>
			<CardHeader>
				<p className='text-2xl font-semibold text-center'>🔑Admin</p>
			</CardHeader>

			<CardContent className='space-y-4'>
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message='You are allowed to see this content' />
				</RoleGate>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 font-medium'>
					<p className='text-sm font-medium'>Admin-only API Route</p>

					<Button onClick={onApiRouteClick}>Click to test</Button>
				</div>

				<div className='flex flex-row items-center justify-between rounded-lg border p-3 font-medium'>
					<p className='text-sm font-medium'>Admin-only Server Action</p>

					<Button onClick={onServerActionClick}>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
