"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";
import PomodoroDial from "../components/pomo-clock";
import SessionHistory from "../components/sessionHistory";
import DocumentUploader from "../components/DocumentUploader";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Only runs on client
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!isAuthenticated()) {
      router.replace("/sign-in");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/sign-in");
    }
  }, []);

  const handleSignOut = async () => {
    const res = await fetch("api/v0/auth/sign-out", {
      method: "POST",
    });

    //remove token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "sign out failed");

    router.push("/sign-in");
  };

  return (
    <div className="p-6 flex items-center content-center gap-5">
      {/* <button 
        type="button"
        onClick={handleSignOut}
        className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
          signout
      </button> */}
      <div className="w-full sm:w-fit h-auto bg-gray-800 p-4 sm:p-5 rounded-md shadow-black shadow-md hover:shadow-lg mx-auto">
        <PomodoroDial />
        <SessionHistory token={token} />
      </div>
      <div className="w-full h-10">
        <DocumentUploader />
      </div>
    </div>
  );
}
