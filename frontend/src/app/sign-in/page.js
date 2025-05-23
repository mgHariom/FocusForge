'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/v0/auth/sign-in', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data.message || 'failed to sign up');
            
            //save token in localStorage
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            //redirect
            router.push('/dashboard')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-4 gap-2 text-sm">
          <h4 className="text-gray-700">Don't have an account?</h4>
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Sign-up
          </button>
        </div>
      </form>
    </div>
  )

}