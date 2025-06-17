import { ENDPOINTS } from "@/configs/endpoints"
import { refreshAccessToken } from "@/helpers/auth-helpers"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number // timestamp
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number // timestamp
    error?: string
  }

}

const NextAuthConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        const res = await fetch(ENDPOINTS.AUTH.SIGN_IN, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })

        const user = await res.json()

        if (!res.ok) throw new Error("Invalid credentials")
        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = user?.expiresAt ? Date.now() + user?.expiresAt * 1000 : undefined
      }

      // If access token expired, try refreshing
      if (token?.expiresAt && Date.now() > token.expiresAt) {
        try {
          const refreshed = await refreshAccessToken(token)
          return {
            ...token,
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            expiresAt: Date.now() + refreshed.expiresAt * 1000
          }
        } catch (error) {
          token.error = "RefreshAccessTokenError"
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error = token.error
      return session
    }
  }
}

export default NextAuthConfig
