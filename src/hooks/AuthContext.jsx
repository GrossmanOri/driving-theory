import { useEffect, useState } from 'react';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirm,
  resendSignUpCode,
  signOut as amplifySignOut,
  getCurrentUser,
} from 'aws-amplify/auth';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    getCurrentUser()
      .then((cur) => setUser({ userId: cur.userId, email: cur.signInDetails?.loginId }))
      .catch(() => setUser(null));

  useEffect(() => {
    refresh().finally(() => setLoading(false));

  }, []);

  const api = {
    user,
    loading,
    async signIn(email, password) {
      await amplifySignIn({ username: email, password });
      await refresh();
    },
    async signUp(email, password) {
      await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
    },
    async confirm(email, code) {
      await amplifyConfirm({ username: email, confirmationCode: code });
    },
    async resend(email) {
      await resendSignUpCode({ username: email });
    },
    async signOut() {
      await amplifySignOut();
      setUser(null);
    },
    refresh,
  };

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
