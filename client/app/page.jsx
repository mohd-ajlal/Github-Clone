"use client";

import React, { useEffect, useState } from 'react';
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import Navbar from '@/components/Navbar';
import { GithubNav } from '@/components/GithubNav';
 

export default function Home() {
  const [selected, setSelected] = useState("light");
  const placeholders = [
    "Github Rep",
    "Github username",
    "Github Repository",
    "Github Profile"
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
      <Navbar className="top-2"/>
      <div className="h-[40rem] flex flex-col justify-center items-center px-4">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
          Github Profile
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          />
          <div className='m-5'></div>
      </div>
      

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <GithubNav />
      </div>
    </>
  );
}