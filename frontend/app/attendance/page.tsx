"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input, Button } from '@/components/ui/input' // Assumes you have these components

type AttendanceData = {
  status: string
  attendance_data: {
    RollNo: string
    FullName: string
    DatesPresent: string[]
  }
}

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [rollNo, setRollNo] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendanceData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<AttendanceData>(`http://localhost:8000/attendance/${rollNo}`)
      setAttendanceData(response.data)
    } catch (err) {
      setError("Could not fetch attendance data. Please check the roll number.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (rollNo) fetchAttendanceData()
  }

  const isDatePresent = (date: Date) => {
    return attendanceData?.attendance_data.DatesPresent.some(presentDate => 
      isSameDay(new Date(presentDate), date)
    )
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  })

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Card className="max-w-3xl w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-green-600">Attendance Calendar</CardTitle>
          <CardDescription>
            {attendanceData ? (
              <>
                Roll No: {attendanceData.attendance_data.RollNo} | Name: {attendanceData.attendance_data.FullName}
              </>
            ) : (
              <span className="text-gray-500">Enter a Roll No. to view attendance</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Enter Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="border border-green-500 px-4 py-2 rounded-md focus:ring focus:ring-green-300"
            />
            <Button 
              onClick={handleSearch}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              disabled={!rollNo || loading}
            >
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-green-300 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 text-green-600">
                {format(selectedDate, 'MMMM yyyy')}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day) => (
                  <div key={day.toISOString()} className="text-center">
                    <Badge 
                      variant={isDatePresent(day) ? "default" : "secondary"}
                      className={`w-10 h-10 flex items-center justify-center ${
                        isSameMonth(day, selectedDate) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      } rounded-full`}
                    >
                      {format(day, 'd')}
                    </Badge>
                    <span className="text-xs mt-1 block">
                      {isDatePresent(day) ? 'P' : 'A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
