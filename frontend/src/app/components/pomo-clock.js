'use client'

import React, { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa'

const PomodoroTimer = () => {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [token, setToken] = useState(null);
  const [duration, setDuration] = useState(25 * 60) // 25 minutes

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'))
    }
  }, [])
  const presets = [25, 40, 60] // in minutes

  const handlePresetClick = (minutes) => {
    setDuration(minutes * 60)
    setKey(prev => prev + 1) // reset timer
    setIsPlaying(false)
  }

  const toggleTimer = () => setIsPlaying(prev => !prev)

  const resetTimer = () => {
    setKey(prev => prev + 1)
    setIsPlaying(false)
  }

  const saveSession = async(duration, token) => {
    try {
      const res = await fetch('/api/v0/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({duration, title})
      });
      if(res.ok) {console.log('successfully added to db')}
      return res.json()
    } catch (error) {
      console.log("Failed to save session", err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      
      <input
        type="text"
        placeholder="Session Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />

      {/* Timer */}
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="flex md:flex-col gap-2">
        {presets.map((min) => (
          <button
            key={min}
            onClick={() => handlePresetClick(min)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-full shadow"
          >
            {min}
          </button>
        ))}
      </div>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={duration}
          colors='#1d4ed8'
          size={180}
          onComplete={() => {
            saveSession(duration, token);
            return {shouldRepeat: false}
          }}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60)
            const seconds = remainingTime % 60
            return (
              <div className="text-3xl font-semibold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            )
          }}
        </CountdownCircleTimer>
      </div>
      <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className="bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={resetTimer}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full flex items-center gap-2"
          >
            <FaRedo /> Reset
          </button>
        </div>
    </div>
  )
}

export default PomodoroTimer
