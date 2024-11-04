"use client";

export function LavaFlow() {
  return (
    <>
      <div 
        className="fixed bottom-0 left-64 right-0 h-24 bg-gradient-to-t from-orange-600/30 via-red-500/20 to-transparent pointer-events-none" 
        style={{
          filter: 'blur(20px)',
          animation: 'glow 3s ease-in-out infinite alternate'
        }}
      />
      
      <style jsx>{`
        @keyframes glow {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}