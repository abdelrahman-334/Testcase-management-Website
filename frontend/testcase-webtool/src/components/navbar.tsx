"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies
import { usePathname } from "next/navigation"; // Import usePathname hook
import Image from "next/image";
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname hook to get current path

  const toggleMenu = () => setIsOpen(!isOpen);

  // Check login state when the component mounts
  useEffect(() => {
    const token = Cookies.get("jwt"); // Check if the token exists in cookies
    if (token) {
      alert("logged in");
      setIsLoggedIn(true); 
    }
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("jwt"); // Remove the token from cookies
    setIsLoggedIn(false); // Update the login state
    router.push("/auth/sign-in"); // Redirect to the SignIn page
  };

  return (
    <nav className="bg-blue-600 text-white" suppressHydrationWarning>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="text-lg font-bold">
          <Link href="/">MyApp</Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none hover:text-gray-200"
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
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/projects", label: "Projects" },
            { path: "/contact", label: "Contact" },
          ].map((link) => (
            <Link key={link.path} href={link.path}>
              <span
                className={`block px-3 py-2 rounded hover:bg-blue-700 lg:inline-block ${
                  pathname === link.path ? "bg-blue-800" : ""
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* Conditional rendering of Sign In/Sign Up or User Avatar */}
          {!isLoggedIn ? (
            <div className="flex gap-4">
              <Link href="/auth/sign-in">
                <button className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/sign-up">
                <button className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* <Image
                src="https://www.placecage.com/50/50" // Placeholder user avatar image
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
                width={20}
                height={20}
              /> */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded"
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

export default Navbar;
