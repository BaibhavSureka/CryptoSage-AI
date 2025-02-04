"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = ["Home", "Dashboard", "Chat", "Profile"]

  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3">
            <Link href="/" className="text-2xl font-bold text-purple-500">
              CryptoSage AI
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <div
                  key={item}
                  className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                >
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                        ? "text-purple-400"
                        : "text-gray-300 hover:text-purple-400"
                    }`}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-purple-400" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-purple-600 px-4 py-2 rounded-full text-white hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
              Connect Wallet
            </Button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-gray-800 py-2 transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
            <button className="block w-full text-left px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-300 ease-in-out">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

