// AWS resource identifiers for the frontend.
// These are public client identifiers (safe to commit) — not secrets.

export const AWS_REGION = 'eu-central-1';
export const USER_POOL_ID = 'eu-central-1_FMibhSlR6';
export const USER_POOL_CLIENT_ID = '3utcfgvp9macp5tgelj42dmsbv';

// API Gateway (HTTP API) invoke URL.
export const API_BASE = 'https://ds3xpsvhx3.execute-api.eu-central-1.amazonaws.com';

// Cognito Hosted-UI domain for social (Google) login.
// Fill this in after creating the domain in the Cognito console, then set
// GOOGLE_ENABLED = true. Example: 'theory-app-ori.auth.eu-central-1.amazoncognito.com'
export const COGNITO_DOMAIN = '';
export const GOOGLE_ENABLED = COGNITO_DOMAIN.length > 0;

// Where Cognito redirects back to after social login.
export const REDIRECT_URL =
  typeof window !== 'undefined' ? window.location.origin + '/' : 'http://localhost:5173/';
