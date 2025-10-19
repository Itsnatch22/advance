// components/CursorWithClickEffect.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CursorWithClickEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleClick = (e: MouseEvent) => {
      const clickEffect = document.createElement('div');
      clickEffect.className = `fixed w-8 h-8 border-4 ${
        isPointer ? 'border-green-300' : 'border-blue-300'
      } rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 animate-ping`;
      clickEffect.style.left = `${e.clientX}px`;
      clickEffect.style.top = `${e.clientY}px`;
      
      document.body.appendChild(clickEffect);
      
      setTimeout(() => {
        document.body.removeChild(clickEffect);
      }, 600);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [isPointer]);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed top-0 left-0 w-4 h-4 bg-blue-500 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-50 transition-all duration-75 ${
          isPointer ? 'scale-150 bg-green-500' : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      
      {/* Cursor trail */}
      <div
        className="fixed top-0 left-0 w-6 h-6 border-2 border-blue-300 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-150"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}