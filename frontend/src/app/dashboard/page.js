'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '../../../utils/auth'
import PomodoroDial from '../components/pomo-clock/pomo-clock'

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
      {/* <button 
        type="button"
        onClick={handleSignOut}
        className="w-fit bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
          signOut
      </button> */}
      <div className='w-fit h-auto bg-gray-800 p-5 rounded-md shadow-gray-700 shadow-md hover:shadow-gray-600'>
        <PomodoroDial/>
      </div>
    </div>
  )
}
