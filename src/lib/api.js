/**
 * Sprint Shoes — API client
 * Base URL: http://localhost:3000/api
 */

const BASE_URL = 'http://localhost:3000/api';

/**
 * Core fetch wrapper.
 * Throws a plain Error with `.status` and `.data` on non-2xx responses.
 */
export async function apiFetch(endpoint, { body, method = 'GET', token, ...opts } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...opts,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* ---- Auth helpers ---- */

export const userAuth = {
  requestLoginOtp: (phoneNumber) =>
    apiFetch('/user/auth/login/request-otp', { method: 'POST', body: { phoneNumber } }),

  resendLoginOtp: (phoneNumber) =>
    apiFetch('/user/auth/login/resend-otp', { method: 'POST', body: { phoneNumber } }),

  loginWithPhone: (phoneNumber, otp) =>
    apiFetch('/user/auth/login/phone', { method: 'POST', body: { phoneNumber, otp } }),

  initiateRegisterPhone: (phoneNumber) =>
    apiFetch('/user/auth/register/initiate-phone', { method: 'POST', body: { phoneNumber } }),

  resendRegisterPhoneOtp: (phoneNumber) =>
    apiFetch('/user/auth/register/resend-phone-otp', { method: 'POST', body: { phoneNumber } }),

  verifyRegisterPhone: (phoneNumber, otp) =>
    apiFetch('/user/auth/register/verify-phone', { method: 'POST', body: { phoneNumber, otp } }),

  initiateEmail: (email, firstName) =>
    apiFetch('/user/auth/register/initiate-email', { method: 'POST', body: { email, firstName } }),

  resendEmail: (email, firstName) =>
    apiFetch('/user/auth/register/resend-email', { method: 'POST', body: { email, firstName } }),

  verifyEmail: (token) =>
    apiFetch(`/user/auth/register/verify-email?token=${encodeURIComponent(token)}`),

  completeRegistration: (payload) =>
    apiFetch('/user/auth/register/complete', { method: 'POST', body: payload }),

  getMe: (token) =>
    apiFetch('/user/auth/me', { token }),

  updateMe: (payload, token) =>
    apiFetch('/user/auth/me', { method: 'PUT', body: payload, token }),

  logout: (refreshToken, token) =>
    apiFetch('/user/auth/logout', { method: 'POST', body: { refreshToken }, token }),

  refreshTokens: (refreshToken) =>
    apiFetch('/user/auth/refresh', { method: 'POST', body: { refreshToken } }),
};

/* ---- Reviews ---- */

export const reviewsApi = {
  /**
   * GET /api/products/:productId/reviews?page=1&limit=5
   * Public — no auth needed.
   */
  getReviews: (productId, page = 1, limit = 5) =>
    apiFetch(`/products/${productId}/reviews?page=${page}&limit=${limit}`),

  /**
   * POST /api/products/:productId/reviews
   * Auth required.
   * Body: { rating, title, comment?, images? }
   */
  createReview: (productId, payload, token) =>
    apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: payload, token }),
};
