import { Amplify } from 'aws-amplify';
import {
  COGNITO_DOMAIN,
  GOOGLE_ENABLED,
  REDIRECT_URL,
  USER_POOL_CLIENT_ID,
  USER_POOL_ID,
} from './config';

// Configure Cognito auth once, at app startup.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
        // OAuth (Google) is only configured once a Hosted-UI domain exists.
        ...(GOOGLE_ENABLED
          ? {
              oauth: {
                domain: COGNITO_DOMAIN,
                scopes: ['email', 'openid', 'profile'],
                redirectSignIn: [REDIRECT_URL],
                redirectSignOut: [REDIRECT_URL],
                responseType: 'code',
              },
            }
          : {}),
      },
    },
  },
});
