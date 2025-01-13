"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SliderToggle from '@/components/ui/SliderToggle'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [selected, setSelected] = useState("light");
  const [open, setOpen] = useState(false);
  
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setSelected(savedTheme);
    document.body.className = savedTheme + '-mode';
  }, []);

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

      <div
        className={cn(
            "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden mt-10",
            "h-[60vh]"
        )} 
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col justify-center items-center px-4 mt-5">
        <SliderToggle selected={selected} setSelected={setSelected} />
          </div>
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Mohd Ajlal",
                  href: "#",
                  icon: (
                    <Image
                      src="/assets/photo.jpg"
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        <Dashboard />
      </div>
    </>
  );
};

export default Page;

export const Logo = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      Github
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

const Dashboard = () => (
  <div className="flex flex-1">
    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
      <div className="flex gap-2">
        {[...new Array(4)].map((_, i) => (
          <div
            key={"first-array" + i}
            className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          ></div>
        ))}
      </div>
      <div className="flex gap-2 flex-1">
        {[...new Array(2)].map((_, i) => (
          <div
            key={"second-array" + i}
            className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  </div>
);
