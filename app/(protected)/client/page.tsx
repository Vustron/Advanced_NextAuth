'use client';

import { UserInfo } from '@/components/navbar/user-info';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

const ClientPage = () => {
	// init session
	const user = useCurrentUser();

	return <UserInfo user={user} label='📱Client Component' />;
};

export default ClientPage;
