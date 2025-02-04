"use client";

import React, { useState } from "react";

const Disclaimer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg hover:bg-red-700 transition"
      >
        Disclaimer
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-white p-4 shadow-lg rounded-md border border-gray-300 text-sm text-black">
          <p>
            Our portfolio handler provides informational recommendations only
            and does not constitute financial advice. We are not liable for any
            losses, damages, or legal consequences from investment decisions.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 px-3 py-1 bg-red-400 text-white text-xs rounded hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Disclaimer;
