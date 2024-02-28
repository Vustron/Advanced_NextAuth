import { UserInfo } from '@/components/navbar/user-info';
import { currentUser } from '@/lib/actions/currentUser';

const ServerPage = async () => {
	// init session
	const user = await currentUser();

	return <UserInfo label='💻Server Component' user={user} />;
};

export default ServerPage;
