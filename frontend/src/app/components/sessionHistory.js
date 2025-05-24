"use client";
import { useState, useEffect } from "react";

export default function SessionHistory({ token }) {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/v0/sessions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    };

    fetchSessions();
  }, [token]);

  return (
    <div className="bg-white rounded-md p-4 shadow mt-4 w-full text-black">
      <h2 className="text-lg font-semibold mb-2 text-black">Session History</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions
            .slice(-3) // gets the last 3 sessions
            .reverse() // optional: shows the most recent first
            .map((s) => (
              <li key={s._id} className="text-sm text-gray-700">
                ✅ {s.duration} min, {s.title}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
