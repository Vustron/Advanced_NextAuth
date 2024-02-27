import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Email Verification',
		html: `<p>Click <a href='${confirmLink}'>here</a> to verify your email</p>`,
	});
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
	const resetPasswordLink = `http://localhost:3000/auth/new-password?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Reset Password',
		html: `<p>Click <a href='${resetPasswordLink}'>here</a> to reset your password</p>`,
	});
};
