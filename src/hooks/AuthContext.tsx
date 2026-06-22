import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirm,
  resendSignUpCode,
  signOut as amplifySignOut,
  getCurrentUser,
} from 'aws-amplify/auth';

interface AuthUser {
  userId: string;
  email?: string;
}

interface AuthApi {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  confirm: (email: string, code: string) => Promise<void>;
  resend: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const cur = await getCurrentUser();
      console.log('[auth] signed in as', cur.userId, cur.signInDetails?.loginId);
      setUser({ userId: cur.userId, email: cur.signInDetails?.loginId });
    } catch (e) {
      console.log('[auth] no active session', e);
      setUser(null);
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const api: AuthApi = {
    user,
    loading,
    async signIn(email, password) {
      console.log('[auth] signIn ->', email);
      const out = await amplifySignIn({ username: email, password });
      console.log('[auth] signIn step:', out.nextStep?.signInStep);
      await refresh();
    },
    async signUp(email, password) {
      console.log('[auth] signUp ->', email);
      const out = await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      console.log('[auth] signUp step:', out.nextStep?.signUpStep);
    },
    async confirm(email, code) {
      console.log('[auth] confirm ->', email);
      await amplifyConfirm({ username: email, confirmationCode: code });
      console.log('[auth] confirm ok');
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

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
