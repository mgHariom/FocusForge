'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '../../../utils/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/sign-in')
    }
  }, [])

  const handleSignOut = async() => {
    const res = await fetch('api/v0/auth/sign-out', {
      method: 'POST',
    })

    //remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "sign out failed")

    router.push('/sign-in')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
      <button 
        type="button"
        onClick={handleSignOut}
        className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
      >
          signOut
      </button>
    </div>
  )
}
