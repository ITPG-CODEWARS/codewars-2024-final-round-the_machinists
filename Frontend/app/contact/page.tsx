import React from "react";

function Contact() {
  return (
    <div className="flex items-center justify-center mt-10 h-screen w-full">
      <form className="bg-white shadow-xl rounded-lg p-8 w-[408px]">
        <h2 className="text-center text-2xl font-semibold mb-6">Contact Us</h2>
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          required
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          required
        />
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-md  hover:opacity-85 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;
