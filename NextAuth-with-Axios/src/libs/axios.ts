import { requestTokenRefresh } from "@/helpers/auth-helpers"
import axios from "axios"
import { getSession, signOut } from "next-auth/react"

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 401 &&
      !original._retry
    ) {
      original._retry = true

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      isRefreshing = true

      try {
        const { accessToken } = await requestTokenRefresh()
        processQueue(null, accessToken)

        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch (e) {
        processQueue(e, null)

        if (typeof window !== undefined) {
          signOut({ callbackUrl: "/login" }) // client-side only
        }

        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
