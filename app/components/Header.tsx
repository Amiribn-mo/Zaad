import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  return (
    <div>
      <div>
        <div className="container  flex justify-around bg-transparent h-auto  items-center sticky">
          <h4 className="text-2xl font-semibold  text-white p-5">Exlorer</h4>
          <div className="flex gap-2 text-white  ">
          

            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
          
            <SignedIn>
              <UserButton />
            </SignedIn>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

