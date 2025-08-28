import React from "react";

export const Footer = ({ text, onChange }) => {
  return (
    <footer className="border-t-2 border-gray-900 bg-gray-50 p-6">
      <div className="text-center">
        <textarea
          className="w-full max-w-2xl mx-auto p-2 border rounded resize-y text-center text-sm text-gray-700 bg-white"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
        />
      </div>
    </footer>
  );
};