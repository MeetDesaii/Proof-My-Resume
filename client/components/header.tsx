import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogIn, User } from "lucide-react";

function Header() {
  return (
    <div className="py-6 container mx-auto">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI tailor
        </Link>
        <div className="flex items-center gap-4 ">
          <Link
            href="/login"
            className="flex justify-between gap-2 items-center"
          >
            <Button variant="outline">
              <LogIn />
              Login
            </Button>
          </Link>
          <Link
            href="/register"
            className="flex justify-between gap-2 items-center"
          >
            <Button>
              <User />
              Register
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
