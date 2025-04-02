import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-gray-500 text-sm mt-8">
      © {new Date().getFullYear()} Restaurant Culinary Assistant | All rights reserved | Created by @tharinduxd
    </footer>
  );
};

export default Footer;
