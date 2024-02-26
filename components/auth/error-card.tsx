import { CardWrapper } from '@/components/auth/card-wrapper';
import { AlertTriangle } from 'lucide-react';

export const ErrorCard = () => {
	return (
		<CardWrapper
			headerLabel='Oops! something went wrong!'
			backButtonHref='/auth/login'
			backButtonLabel='Back to login'
		>
			<div className='w-full flex justify-center items-center'>
				<AlertTriangle className='text-destructive' />
			</div>
		</CardWrapper>
	);
};
