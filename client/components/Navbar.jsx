"use client"

import { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import SliderToggle from "./ui/SliderToggle";
import Link from "next/link";


function Navbar({ className }) {

  const [active, setActive] = useState(null);
    const [selected, setSelected] = useState("light");
  
  useEffect(() => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setSelected(savedTheme);
      document.body.className = savedTheme + '-mode';
    }, [])

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
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="About">
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Sign In">
        </MenuItem>
        <Link href="/dashboard">
        
        <MenuItem setActive={setActive} active={active} item="Dashboard">
        </MenuItem>
        </Link>
        
        <SliderToggle selected={selected} setSelected={setSelected} />
      </Menu>
    </div>
  );
}

export default Navbar;