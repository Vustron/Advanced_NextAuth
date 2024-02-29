import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Email Verification',
		html: `<p>Click <a href='${confirmLink}'>here</a> to verify your email</p>`,
	});
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
	const resetPasswordLink = `${domain}/auth/new-password?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Reset Password',
		html: `<p>Click <a href='${resetPasswordLink}'>here</a> to reset your password</p>`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Two-Factor Code',
		html: `<p>Your two-factor code: ${token}</p>`,
	});
};
