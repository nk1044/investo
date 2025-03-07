// Navbar04.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const defaultLinks = [
  { name: "Home", link: "/" },
  { name: "Stocks", link: "/stocks" },
  { name: "About", link: "/" },
  { name: "Contact", link: "/" },
];

const Navbar05 = ({ links = defaultLinks }) => {
  const navigate = useNavigate();
  return (
    <div
      className="fixed top-2 left-1/2 z-30 pointer-events-auto bg-black bg-opacity-80 backdrop-blur-md cursor-default flex items-center justify-center p-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      style={{ transform: "translateX(-50%)", marginTop: "10px" }}
    >
      {links.map((link, i) => (
        <div key={i} onClick={()=>navigate(link.link)} className="bg-black text-white px-3 py-1 cursor-pointer rounded-full text-xs shadow-md">
          {link.name}
        </div>
      ))}
    </div>
  );
};

export default Navbar05;
