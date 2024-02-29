'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}

export const LoginButton = ({
	children,
	mode = 'redirect',
	asChild,
}: LoginButtonProps) => {
	// init router
	const router = useRouter();

	// handle onClick
	const onClick = () => {
		router.push('/auth/login');
	};

	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className='p-0 w-auto bg-transparent'>
					<LoginForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<span onClick={onClick} className='cursor-pointer'>
			{children}
		</span>
	);
};
