import { refreshAccessToken } from "@/helpers/auth-helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.refreshToken) {
    return res.status(401).json({ error: "No refresh token" })
  }

  try {
    const refreshed = await refreshAccessToken(token)

    return res.status(200).json({
      accessToken: refreshed.accessToken,
      expiresAt: refreshed.expiresAt,
    })
  } catch (err) {
    return res.status(401).json({ error: "Failed to refresh token" })
  }
}
