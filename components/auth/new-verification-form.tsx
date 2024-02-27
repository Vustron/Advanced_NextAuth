'use client';

import { newVerification } from '@/lib/actions/newVerification';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormSuccess } from '@/components/ui/form-success';
import { useCallback, useEffect, useState } from 'react';
import { FormError } from '@/components/ui/form-error';
import { useSearchParams } from 'next/navigation';
import { PropagateLoader } from 'react-spinners';

export const NewVerificationForm = () => {
	// init search params
	const searchParams = useSearchParams();
	// init token
	const token = searchParams.get('token');
	// init state
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const onSubmit = useCallback(() => {
		if (success || error) return;

		if (!token) {
			setError('Missing token!');
			return;
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError('Something went wrong!');
			});
	}, [token, success, error]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel='Confirming your verification'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<div className='flex items-center w-full justify-center'>
				{!success && !error && <PropagateLoader />}

				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
