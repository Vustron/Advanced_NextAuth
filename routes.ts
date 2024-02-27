/**
 * An array of routes that are accessible to public
 * @type {string[]}
 */

export const publicRoutes = ['/', '/auth/new-verification'];

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */

export const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
	'/auth/reset-password',
	'/auth/new-password',
];

/**
 * Prefix for API authentication routes
 * Routes with this prefix are used for API authentication
 * @type {string}
 */

export const apiAuthPrefix = '/api/auth';

/**
 *
 * Default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/settings';
