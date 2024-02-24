'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}

const LoginButton = ({
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
		return <span>TODO: Implement modal</span>;
	}

	return (
		<span onClick={onClick} className='cursor-pointer'>
			{children}
		</span>
	);
};

export default LoginButton;
