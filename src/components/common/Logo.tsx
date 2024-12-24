import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/kodol-logo.svg" 
        alt="Kodol" 
        className="h-8 w-8"
      />
      <span className="ml-2 text-xl font-bold">Kodol</span>
    </div>
  );
}