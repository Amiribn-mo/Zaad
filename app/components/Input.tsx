// app/components/PromptInput.tsx
'use client';

import { SignInButton } from '@clerk/nextjs';
import { useChatLogic } from '../api/chatbot/useChatLogic';


export default function PromptInput() {
  const {
    input,
    history,
    displayText,
    currentIndices,
    isTyping,
    error,
    isLoading,
    chatContainerRef,
    lastMessageRef,
    isSignedIn,
    user,
    // isLoaded, // Removed
    handleInputChange,
    handleClick,
  } = useChatLogic();

  return (
    <div className="container flex flex-col items-center gap-5 h-auto py-6">
      <div
        ref={chatContainerRef}
        className="w-full max-w-7xl rounded-lg p-4 max-h-[60vh] overflow-y-auto overflow-x-hidden hide-scrollbar"
      >
        {history.length === 0 ? (
          <h1 className="text-zinc-500 text-center text-5xl">
            Welcome, {isSignedIn ? user!.firstName || 'User' : ''}!
            {!isSignedIn && (
              <SignInButton mode="modal">
                {/* <button className="ml-2 text-blue-500 underline">Sign In</button> */}
              </SignInButton>
            )}
          </h1>
        ) : (
          history.map((msg, index) => (
            <div
              key={index}
              ref={index === history.length - 1 ? lastMessageRef : null}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[100%] p-3 rounded-lg border-b-cyan-600 ${
                  msg.role === 'user' ? 'bg-white text-black' : 'bg-white text-zinc-800'
                }`}
              >
                <p className="font-mono whitespace-pre-wrap border-r-indigo-500">
                  {displayText[index]}
                  {msg.role === 'assistant' &&
                    isTyping &&
                    index === history.findLastIndex((m) => m.role === 'assistant') &&
                    currentIndices[index] < msg.content.length && (
                      <span className="animate-blink">|</span>
                    )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      {/* Input form */}
      <form
        onSubmit={handleClick}
        className="w-full max-w-2xl flex items-center gap-2"
      >
        <div className="relative rounded-full overflow-hidden bg-white shadow-xl flex-grow w-full">
          <input
            className="bg-transparent outline-none border-none pl-6 pr-16 py-4 w-full font-sans text-lg font-semibold"
            placeholder="Type a message..."
            name="text"
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-yellow-600 group shadow-xl flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform duration-100"
              disabled={isLoading}
            >
              <svg
                className="relative z-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 64 64"
                height="40"
                width="40"
              >
                <path
                  fillOpacity="0.01"
                  fill="white"
                  d="M63.6689 29.0491L34.6198 63.6685L0.00043872 34.6194L29.0496 1.67708e-05L63.6689 29.0491Z"
                />
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="3.76603"
                  stroke="white"
                  d="M42.8496 18.7067L21.0628 44.6712"
                />
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="3.76603"
                  stroke="white"
                  d="M26.9329 20.0992L42.85 18.7067L44.2426 34.6238"
                />
              </svg>
              <div className="w-full h-full rotate-45 absolute left-[32%] top-[32%] bg-black group-hover:-left-[100%] group-hover:-top-[100%] duration-1000" />
              <div className="w-full h-full -rotate-45 absolute -left-[32%] -top-[32%] group-hover:left-[100%] group-hover:top-[100%] bg-black duration-1000" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}