import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { login?: string }
  }
}

const adminLogin = process.env.ADMIN_GITHUB_LOGIN

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: 'jwt' },
  callbacks: {
    signIn({ profile }) {
      const login = profile && 'login' in profile ? String(profile.login) : ''
      return Boolean(adminLogin && login === adminLogin)
    },
    jwt({ token, profile }) {
      if (profile && 'login' in profile) token.login = profile.login
      return token
    },
    session({ session, token }) {
      session.user.login = typeof token.login === 'string' ? token.login : undefined
      return session
    },
  },
})

export function isOwnerLogin(login?: string | null) {
  return Boolean(adminLogin && login === adminLogin)
}
