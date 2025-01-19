// src/components/Header.js
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname hook to get current path
  
  // Toggle the mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Check login state when the component mounts
  useEffect(() => {
    const token = Cookies.get("jwt"); // Check if the token exists in cookies
    if (token) {
      setIsLoggedIn(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("jwt"); // Remove the token from cookies
    setIsLoggedIn(false); // Update the login state
    router.push("/auth/sign-in"); // Redirect to the sign-in page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-green-500">
          <Link href="/">Testit</Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none hover:text-green-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:gap-6`}
        >
          <Link
            href="/"
            className="block px-3 py-2 text-gray-700 hover:text-green-500"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-gray-700 hover:text-green-500"
          >
            About
          </Link>
          <Link
            href= {isLoggedIn ? "/project" : "/auth/sign-in" }
            className="block px-3 py-2 text-gray-700 hover:text-green-500"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 text-gray-700 hover:text-green-500"
          >
            Contact
          </Link>

          {/* Conditional rendering for login/logout buttons */}
          {!isLoggedIn ? (
            <div className="flex gap-4">
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
