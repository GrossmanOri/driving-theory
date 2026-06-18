import { Amplify } from 'aws-amplify';
import { USER_POOL_CLIENT_ID, USER_POOL_ID } from './config';

// Configure Cognito auth once, at app startup.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
      loginWith: { email: true },
    },
  },
});
