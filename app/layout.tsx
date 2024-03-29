import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Advanced NextAuth',
	description: 'Advanced NextAuth',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// init session
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={inter.className}>
					{children}
					<Toaster richColors position='top-center' />
				</body>
			</html>
		</SessionProvider>
	);
}
