"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchMe } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const refresh = searchParams.get("refresh");

    if (token && refresh) {
      // 1. Tokens save karo
      Cookies.set("accessToken", token, { expires: 7, sameSite: "lax" });
      Cookies.set("refreshToken", refresh, { expires: 30, sameSite: "lax" });

      // 2. fetchMe call karke user details sync karo
      fetchMe()
        .then((userData) => {
          // fetchMe return mein aksar user data bhejta hai
          // Check karo tumhara AuthContext kya return kar raha hai
          const role = userData?.role || userData?.user?.role;
          
          if (role) {
            router.replace(`/${role}/dashboard`);
          } else {
            // Agar role nahi mila toh default home
            router.replace("/");
          }
        })
        .catch((err) => {
          console.error("Auth sync failed:", err);
          router.replace("/login");
        });
    } else {
      router.replace("/login");
    }
  }, [searchParams, fetchMe, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#050507]">
      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
      <p className="text-zinc-400 text-lg font-medium">Authenticating your profile...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-white bg-[#050507]">Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
}