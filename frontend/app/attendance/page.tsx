"use client";

import React, { useState } from 'react'
import axios from 'axios'

type AttendanceRecord = {
  date: string
  status: 'Present' | 'Absent'
}

type AttendanceData = {
  status: string
  attendance_data: {
    RollNo: string
    FullName: string
    DatesPresent: string[]
  }
}

export default function AttendanceRecords() {
  const [rollNo, setRollNo] = useState('')
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendanceData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<AttendanceData>(`http://localhost:8000/attendance/${rollNo}`)
      setAttendanceData(response.data)
    } catch (err) {
      setError("Failed to fetch attendance data. Please check the roll number and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rollNo) {
      fetchAttendanceData()
    }
  }

  const getAttendanceRecords = (): AttendanceRecord[] => {
    if (!attendanceData) return []

    const allDates = new Set<string>()
    const presentDates = new Set(attendanceData.attendance_data.DatesPresent)
    console.log(presentDates)

    // Assuming we want to show records for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      allDates.add(date.toISOString().split('T')[0])
    }

    return Array.from(allDates).map(date => ({
      date,
      status: presentDates.has(date) ? 'Present' : 'Absent' as 'Present' | 'Absent'
    })).sort((a, b) => b.date.localeCompare(a.date))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-2">Attendance Records</h1>
          <p className="text-gray-600 mb-6">Enter a roll number to view attendance records</p>
          
          <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-stone-800"
            />
            <button
              type="submit"
              disabled={!rollNo || loading}
              className={`px-4 py-2 rounded-md text-white font-semibold ${
                loading || !rollNo ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Fetch Records'
              )}
            </button>
          </form>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {attendanceData && (
            <div>
              <h2 className="text-xl text-slate-600 font-semibold mb-4">
                {attendanceData.attendance_data.FullName} ({attendanceData.attendance_data.RollNo})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getAttendanceRecords().map((record) => (
                      <tr key={record.date}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}