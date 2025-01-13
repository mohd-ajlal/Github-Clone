// "use client";
 
// import SliderToggle from "@/components/ui/SliderToggle";
// import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
// import { useEffect, useState } from "react";
// import { ShootingStars } from "@/components/ui/shooting-stars";
// import { StarsBackground } from "@/components/ui/stars-background";

// export default function Home() {
//   const [selected, setSelected] = useState("light");
//   const placeholders = [
//     "What's the first rule of Fight Club?",
//     "Who is Tyler Durden?",
//     "Where is Andrew Laeddis Hiding?",
//     "Write a Javascript method to reverse a string",
//     "How to assemble your own PC?",
//   ];

//   useEffect(() => {
//     document.body.className = selected;
//   }, [selected]);
 
//   const handleChange = (e) => {
//     console.log(e.target.value);
//   };
//   const onSubmit = (e) => {
//     e.preventDefault();
//     console.log("submitted");
//   };
//   return (
//     <>
//     <div className="fixed top-4 right-4">
//         <SliderToggle selected={selected} setSelected={setSelected} />
//       </div>
//     <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
//       <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
//         Github Profile
//       </h2>
//       <PlaceholdersAndVanishInput
//         placeholders={placeholders}
//         onChange={handleChange}
//         onSubmit={onSubmit}
//         />
//     </div>
    
//     </>
//   );
// }

"use client";

import React, { useEffect, useState } from 'react';
import SliderToggle from "@/components/ui/SliderToggle";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
 

export default function Home() {
  const [selected, setSelected] = useState("light");
  const placeholders = [
    "Github Rep",
    "Github username",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setSelected(savedTheme);
    document.body.className = savedTheme + '-mode';
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  const toggleTheme = () => {
    const newTheme = selected === 'light' ? 'dark' : 'light';
    setSelected(newTheme);
    document.body.className = newTheme + '-mode';
    localStorage.setItem('theme', newTheme);
  };

    useEffect(() => {
    document.body.className = selected;
  }, [selected]);

  return (
    <>
      <Navbar className="top-2" />
      <div className="fixed top-4 right-4">
      <SliderToggle selected={selected} setSelected={setSelected} />

      </div>
      <div className="h-[40rem] flex flex-col justify-center items-center px-4">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
          Github Profile
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}