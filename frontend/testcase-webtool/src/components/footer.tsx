// src/components/Footer.js
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Testit</h3>
          <p className="text-gray-400">
            Testit is your AI-driven solution for smarter, faster, and more
            efficient test case management. Empower your testing process today!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:text-green-500 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-green-500 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/test-cases"
                className="hover:text-green-500 transition-colors duration-200"
              >
                Work
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-green-500 transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.926 9.926 0 01-2.828.775 4.927 4.927 0 002.165-2.724 9.865 9.865 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.149a4.908 4.908 0 001.523 6.573 4.9 4.9 0 01-2.229-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.631 1.965 2.445 3.396 4.604 3.437a9.867 9.867 0 01-6.102 2.104c-.396 0-.79-.023-1.175-.067a13.945 13.945 0 007.557 2.209c9.054 0 14.002-7.496 14.002-13.986 0-.213-.004-.425-.014-.637A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.462.099 2.795.143v3.24h-1.917c-1.504 0-1.796.715-1.796 1.762v2.309h3.591l-.467 3.622h-3.124V24h6.116c.729 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.725v20.551C0 23.226.792 24 1.771 24h20.451C23.208 24 24 23.226 24 22.275V1.725C24 .774 23.208 0 22.225 0zM7.087 20.452H3.542V9.021h3.545v11.431zM5.314 7.644a2.056 2.056 0 01-2.061-2.05 2.056 2.056 0 012.061-2.05c1.14 0 2.06.912 2.06 2.05a2.056 2.056 0 01-2.06 2.05zM20.452 20.452h-3.545v-5.895c0-1.405-.025-3.217-1.962-3.217-1.962 0-2.262 1.532-2.262 3.117v6h-3.543V9.021h3.403v1.561h.047c.472-.892 1.628-1.832 3.353-1.832 3.58 0 4.241 2.35 4.241 5.409v6.293z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 text-sm text-gray-500 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Testit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
