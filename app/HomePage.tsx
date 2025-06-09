import React from "react";
import PromptInput from "./components/Input";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const HomePage = () => {
  const publishableKey = process.env.CLERK_SECRET_KEY;
  return (
    <main className="h-95vh  bg-gray-100  flex flex-col items-center p-4 sm:p-3">
      <div className=" flex flex-col gap-2 max-w-full mx-auto">
        <div className="text-center text-zinc-800">
          <h2 className="text-4xl font-semibold font-mono">ZAD</h2>
        </div>

        <ClerkProvider publishableKey={publishableKey}>
          <SignedIn>
            {/* Your form component goes here */}
            <PromptInput />
          </SignedIn>
           
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </ClerkProvider>
      </div>
    </main>
  );
};

export default HomePage;
