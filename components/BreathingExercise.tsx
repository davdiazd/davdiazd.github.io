'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

type BreathingPhase = 'inhale' | 'exhale' | 'pause';

interface BreathingState {
  phase: BreathingPhase;
  cycle: number;
  timeInPhase: number;
}

export function BreathingExercise() {
  const [state, setState] = useState<BreathingState>({
    phase: 'inhale',
    cycle: 1,
    timeInPhase: 0
  });

  // Phase durations in milliseconds - 4-6 breathing method
  const phaseDurations = {
    'inhale': 4000,  // 4 seconds
    'exhale': 6000,  // 6 seconds
    'pause': 1000    // 1 second between cycles
  };

  const totalCycles = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prevState => {
        const currentPhaseDuration = phaseDurations[prevState.phase];
        const newTimeInPhase = prevState.timeInPhase + 100;

        // If current phase is complete
        if (newTimeInPhase >= currentPhaseDuration) {
          let nextPhase: BreathingPhase;
          let nextCycle = prevState.cycle;

          switch (prevState.phase) {
            case 'inhale':
              nextPhase = 'exhale';
              break;
            case 'exhale':
              if (prevState.cycle < totalCycles) {
                nextPhase = 'pause';
              } else {
                // Reset to beginning for seamless loop
                nextPhase = 'inhale';
                nextCycle = 1;
              }
              break;
            case 'pause':
              nextPhase = 'inhale';
              nextCycle = prevState.cycle + 1;
              break;
          }

          return {
            phase: nextPhase,
            cycle: nextCycle,
            timeInPhase: 0
          };
        }

        return {
          ...prevState,
          timeInPhase: newTimeInPhase
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Calculate orb size based on phase
  const getOrbScale = () => {
    const progress = state.timeInPhase / phaseDurations[state.phase];
    
    switch (state.phase) {
      case 'inhale':
        // Smooth expansion over 4 seconds
        const easeInProgress = 1 - Math.pow(1 - progress, 2); // Ease in
        return 1 + (0.7 * easeInProgress); // Scale from 1 to 1.7
      case 'exhale':
        // Slow smooth contraction over 6 seconds
        const easeOutProgress = 1 - Math.pow(progress, 0.3); // Very slow ease out
        return 1.7 - (0.7 * (1 - easeOutProgress)); // Scale from 1.7 to 1
      case 'pause':
        return 1;
    }
  };

  // Calculate glow intensity
  const getGlowIntensity = () => {
    const progress = state.timeInPhase / phaseDurations[state.phase];
    
    switch (state.phase) {
      case 'inhale':
        return 0.6 + (0.4 * progress); // Gradually increase to 1.0
      case 'exhale':
        return 1 - (0.4 * progress); // Gradually decrease to 0.6
      case 'pause':
        return 0.6;
    }
  };

  // Get text for current phase
  const getPhaseText = () => {
    switch (state.phase) {
      case 'inhale':
        return 'Inhale';
      case 'exhale':
        return 'Now exhale slowly...';
      case 'pause':
        return '';
    }
  };

  // Text opacity based on phase timing
  const getTextOpacity = () => {
    if (state.phase === 'pause') return 0;
    const progress = state.timeInPhase / phaseDurations[state.phase];
    if (progress < 0.15) return progress / 0.15; // Fade in over first 15%
    if (progress > 0.85) return (1 - progress) / 0.15; // Fade out over last 15%
    return 1;
  };

  const scale = getOrbScale();
  const glowIntensity = getGlowIntensity();
  const textOpacity = getTextOpacity();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Calming gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              rgba(75, 0, 130, 0.3) 0%, 
              rgba(25, 25, 112, 0.5) 30%, 
              rgba(72, 61, 139, 0.7) 60%, 
              rgba(25, 25, 112, 0.9) 100%
            ),
            linear-gradient(45deg,
              #191970 0%,
              #483d8b 25%,
              #6a5acd 50%,
              #4b0082 75%,
              #2f1b69 100%
            )
          `
        }}
      />

      {/* Subtle background particles/stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Main breathing orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: scale,
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        >
          {/* Main orb */}
          <div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-white/20 to-purple-200/30 backdrop-blur-sm"
            style={{
              boxShadow: `
                0 0 ${60 * glowIntensity}px rgba(147, 112, 219, ${0.6 * glowIntensity}),
                0 0 ${120 * glowIntensity}px rgba(147, 112, 219, ${0.4 * glowIntensity}),
                0 0 ${200 * glowIntensity}px rgba(147, 112, 219, ${0.2 * glowIntensity}),
                inset 0 0 ${40 * glowIntensity}px rgba(255, 255, 255, ${0.1 * glowIntensity})
              `,
            }}
          />
          
          {/* Inner glow */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-purple-100/20"
            animate={{
              opacity: glowIntensity * 0.8,
            }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Core light */}
          <motion.div
            className="absolute inset-1/3 rounded-full bg-white/40"
            animate={{
              opacity: glowIntensity,
              scale: 0.8 + (glowIntensity * 0.4),
            }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>

      {/* Text overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingTop: '320px' }}
      >
        <motion.p
          className="text-white/90 text-center tracking-wide"
          style={{
            opacity: textOpacity,
            fontSize: '18px',
            fontWeight: '300',
            letterSpacing: '0.05em',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          {getPhaseText()}
        </motion.p>
      </motion.div>

      {/* Cycle indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[...Array(totalCycles)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i + 1 <= state.cycle ? 'bg-white/60' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Breathing method indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="text-white/70 text-center">
          <p className="text-sm tracking-wide" style={{ fontSize: '14px', fontWeight: '300' }}>
            4-6 Breathing Method
          </p>
          <p className="text-xs opacity-60 mt-1" style={{ fontSize: '12px' }}>
            4s inhale • 6s exhale
          </p>
        </div>
      </div>
    </div>
  );
}