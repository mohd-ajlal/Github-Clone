"use client"

import { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="About">
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Pricing">
        </MenuItem>


        <MenuItem setActive={setActive} active={active} item="Sign In">
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar;