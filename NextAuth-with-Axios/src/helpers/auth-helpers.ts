import { ENDPOINTS } from "@/configs/endpoints"
import { JWT } from "next-auth/jwt"

export async function refreshAccessToken(token: JWT) {
  const res = await fetch(ENDPOINTS.AUTH.REFRESH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token.refreshToken })
  })

  if (!res.ok) throw new Error("Failed to refresh token")

  const data = await res.json()
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt
  }
}

export async function requestTokenRefresh() {
  const res = await fetch("/api/auth/refresh", { method: "POST" })
  if (!res.ok) throw new Error("Refresh failed")
  return res.json()
}