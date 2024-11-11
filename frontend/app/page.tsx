"use client";

import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {

  
  return (
    <div  className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">IIIT Kottayam</span>
          <img src="logo.png" alt="" className="w-[3rem]" />
          <span className="ml-2 text-xl font-bold text-gray-800">IIIT Kottayam</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" href="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-800">
                    Face Recognition Attendance System
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Streamline attendance tracking at IIIT Kottayam with our cutting-edge face recognition technology.
                    Efficient, accurate, and secure.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700"
                    href="/capture"
                  >
                    Get Started
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700"
                    href="/attendance"
                  >
                    Check Attendance
                  </Link>
                </div>
              </div>
              <Image
                alt="Face Recognition"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src="/hero.webp"
                width="550"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Key Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
                <svg
                  className=" h-12 w-12 text-green-600"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Accurate Recognition</h3>
                <p className="text-gray-500 text-center">
                  State-of-the-art facial recognition ensures precise attendance tracking for all students.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
                <svg
                  className=" h-12 w-12 text-green-600"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Time-Efficient</h3>
                <p className="text-gray-500 text-center">
                  Drastically reduce time spent on manual attendance, allowing more focus on education.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
                <svg
                  className=" h-12 w-12 text-green-600"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Secure & Private</h3>
                <p className="text-gray-500 text-center">
                  Advanced encryption and data protection measures ensure student privacy and data security.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-green-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to Revolutionize Attendance?
                </h2>
                <p className="max-w-[900px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join IIIT Kottayam in embracing the future of attendance tracking. Get started with our face
                  recognition system today.
                </p>
              </div>
              <a
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-green-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                href="capture"
              >
                Get Started
                <svg
                  className=" ml-2 h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Pratham S K. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}