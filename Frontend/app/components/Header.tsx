"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import { useRouter } from "next/navigation"; // Import useRouter for navigation

function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to control menu
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded: any = jwt.decode(storedToken);
        if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
          setIsTokenValid(false);
        } else {
          setToken(storedToken);
          setIsTokenValid(true);
        }
      } catch (err) {
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setIsTokenValid(false); // Set token as invalid
    setToken(null); // Clear token
    setMenuOpen(false); // Close menu if it's open
    router.push("/login"); // Redirect to login page or homepage
  };

  return (
    <div className="top-0 left-0 w-full z-50 sticky bg-white shadow-md">
      <div className="p-5 pb-3 pl-10 flex justify-between items-center py-5">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-[24px]">
          EasiRail
        </Link>

        {/* Regular Menu for larger screens */}
        <div className="hidden md:flex gap-10 items-center">
          <Link href="/models" className="font-medium text-[18px]">
            Models
          </Link>
          <Link href="/contact" className="font-medium text-[18px]">
            Contact
          </Link>
        </div>

        {/* User Avatar / Login, Sign Up, and Logout */}
        <div className="hidden md:flex gap-5 items-center">
          {isTokenValid ? (
            <>
              <Link href="/me">
                <img
                  src="/avatar.png"
                  alt="Avatar"
                  className="w-11 h-11 rounded-full cursor-pointer"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium text-[18px] text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-[18px] bg-black hover:bg-opacity-75 transition-all text-white px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="font-medium text-[18px] text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Burger Icon for smaller screens */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white absolute top-0 left-0 w-full z-40 p-5 shadow-md">
          {/* Close button inside the mobile menu */}
          <div className="flex justify-between items-center mb-5">
            <Link href="/" className="font-extrabold text-[24px]">
              EasiRail
            </Link>
            <button onClick={toggleMenu} aria-label="Close menu">
              <FaTimes className="text-2xl text-gray-600 hover:text-gray-800" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-center">
            <Link
              href="/models"
              onClick={toggleMenu} // Close the menu when a link is clicked
              className="font-medium text-[18px] hover:text-gray-700"
            >
              Models
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className="font-medium text-[18px] hover:text-gray-700"
            >
              Contact
            </Link>

            {isTokenValid ? (
              <>
                <Link href="/me" onClick={toggleMenu}>
                  <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="w-11 h-11 rounded-full mx-auto"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-medium text-[18px] text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-all mt-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={toggleMenu}
                  className="font-medium text-[18px] bg-black hover:bg-opacity-75 transition-all text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={toggleMenu}
                  className="font-medium text-[18px] text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;
