// components/useChatLogic.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatLogic = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { isSignedIn, user, isLoaded } = useUser();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleClick = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }
    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = { role: 'user', content: input };
    setHistory((prev) => [...prev, userMessage]);
    setDisplayText((prev) => [...prev, input]);
    setCurrentIndices((prev) => [...prev, input.length]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.message };
      setHistory((prev) => [...prev, assistantMessage]);
      setDisplayText((prev) => [...prev, '']);
      setCurrentIndices((prev) => [...prev, 0]);
      
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Typewriter effect with auto-scroll
  useEffect(() => {
    const latestAssistantIndex = history.findLastIndex((msg) => msg.role === 'assistant');
    if (
      latestAssistantIndex >= 0 &&
      currentIndices[latestAssistantIndex] < history[latestAssistantIndex].content.length
    ) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayText((prev) => {
          const newDisplay = [...prev];
          newDisplay[latestAssistantIndex] +=
            history[latestAssistantIndex].content[currentIndices[latestAssistantIndex]];
          return newDisplay;
        });
        setCurrentIndices((prev) => {
          const newIndices = [...prev];
          newIndices[latestAssistantIndex]++;
          return newIndices;
        });
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [history, currentIndices]);

  // Auto-scroll on history or displayText change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history, displayText]);

  return {
    input,
    history,
    displayText,
    currentIndices, // Added
    isTyping,
    error,
    isLoading,
    chatContainerRef,
    lastMessageRef,
    isSignedIn,
    user,
    isLoaded,
    handleInputChange,
    handleClick,
  };
};