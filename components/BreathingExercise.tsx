'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

type BreathingPhase = 'inhale' | 'exhale';

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

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // Single audio ref for the 10-second looping MP4
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Phase durations in milliseconds - 4-6 breathing method
  const phaseDurations = {
    'inhale': 4000,  // 4 seconds
    'exhale': 6000   // 6 seconds
  };

  const totalCycles = 3; // 3 cycles = 30 seconds total

  // Initialize audio element
  useEffect(() => {
    // Create audio element with your custom 10-second MP4 file
    // Place your audio file in the public/audio/ directory
    audioRef.current = new Audio('/audio/breathing.mp4');
    audioRef.current.preload = 'auto';
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true; // Loop the 10-second audio continuously

    // Check if audio file is loaded
    const checkAudioLoaded = () => {
      if (audioRef.current?.readyState === 4) {
        setAudioLoaded(true);
      }
    };

    // Add event listener for when audio is loaded
    audioRef.current.addEventListener('canplaythrough', checkAudioLoaded);

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', checkAudioLoaded);
      }
    };
  }, []);

  // Toggle audio on/off
  const toggleAudio = () => {
    if (!audioLoaded || !audioRef.current) return;

    const newAudioState = !isAudioEnabled;
    setIsAudioEnabled(newAudioState);
    
    if (newAudioState) {
      // Start the looping audio
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
    } else {
      // Stop the audio
      audioRef.current.pause();
    }
  };

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
              // Go directly to next inhale
              nextPhase = 'inhale';
              nextCycle = prevState.cycle < totalCycles ? prevState.cycle + 1 : 1; // Reset to 1 for seamless loop
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
        // Smooth, consistent contraction over 6 seconds
        const linearProgress = progress;
        const gentleEaseProgress = 1 - Math.pow(1 - progress, 1.2);
        const blendedProgress = (linearProgress * 0.7) + (gentleEaseProgress * 0.3);
        return 1.7 - (0.7 * blendedProgress); // Scale from 1.7 to 1
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
    }
  };

  // Get text for current phase
  const getPhaseText = () => {
    switch (state.phase) {
      case 'inhale':
        return 'Inhale';
      case 'exhale':
        return 'Now exhale slowly...';
    }
  };

  // Text opacity based on phase timing
  const getTextOpacity = () => {
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

      {/* Audio control button */}
      <div className="absolute top-8 right-8 z-10">
        <button
          onClick={toggleAudio}
          disabled={!audioLoaded}
          className={`flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-sm border transition-all duration-300 ${
            audioLoaded 
              ? 'bg-white/10 border-white/20 hover:bg-white/15 cursor-pointer' 
              : 'bg-white/5 border-white/10 cursor-not-allowed opacity-50'
          }`}
          style={{
            boxShadow: isAudioEnabled && audioLoaded
              ? '0 0 20px rgba(147, 112, 219, 0.4)' 
              : '0 0 10px rgba(255, 255, 255, 0.1)'
          }}
          aria-label={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {!audioLoaded ? (
            // Loading icon
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white/60 animate-spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          ) : isAudioEnabled ? (
            // Audio on icon
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white/90"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            // Audio off icon
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white/90"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="22" y1="9" x2="16" y2="15"></line>
              <line x1="16" y1="9" x2="22" y2="15"></line>
            </svg>
          )}
        </button>
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
          {isAudioEnabled && audioLoaded && (
            <p className="text-xs opacity-50 mt-1" style={{ fontSize: '11px' }}>
              🎵 Audio enabled
            </p>
          )}
          {!audioLoaded && (
            <p className="text-xs opacity-50 mt-1" style={{ fontSize: '11px' }}>
              Loading audio...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}