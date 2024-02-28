'use client';

import { logout } from '@/lib/actions/logout';
import { useCurrentUser } from '@/lib/hooks/useCurrentSession';

const SettingsPage = () => {
	// get auth
	const user = useCurrentUser();

	// sign-out handler
	const onClick = () => {
		logout();
	};

	return (
		<div className='bg-white p-10 rounded-xl'>
			<button type='submit' onClick={onClick}>
				Sign out
			</button>
		</div>
	);
};

export default SettingsPage;
