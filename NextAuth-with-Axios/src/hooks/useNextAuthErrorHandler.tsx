import { signOut } from "next-auth/react";
import { useEffect } from "react";

export function useNextAuthErrorHandler(error: any) {
  useEffect(() => {
    if (error?.response?.data?._shouldSignOut) {
      signOut({ callbackUrl: "/login" });
    }
  }, [error]);
}
