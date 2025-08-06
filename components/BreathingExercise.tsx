'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackAudio, setUsingFallbackAudio] = useState(false);
  
  // Single audio ref for the 10-second looping MP4
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Phase durations in milliseconds - 4-6 breathing method
  const phaseDurations = {
    'inhale': 4000,  // 4 seconds
    'exhale': 6000   // 6 seconds
  };

  const totalCycles = 3; // 3 cycles = 30 seconds total

  // Create fallback audio using Web Audio API
  const createFallbackAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Lower frequency for calming effect
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Very low volume
      
      oscillatorRef.current = oscillator;
      setUsingFallbackAudio(true);
      setAudioLoaded(true);
      setError(null);
      
      console.log('Fallback audio created successfully');
    } catch (err) {
      console.error('Failed to create fallback audio:', err);
      setError('Audio not available');
    }
  };

  // Start fallback audio with breathing rhythm
  const startFallbackAudio = () => {
    if (!oscillatorRef.current || !audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const oscillator = oscillatorRef.current;
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a gentle pulsing effect
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.03, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.start();
    console.log('Fallback audio started with breathing rhythm');
  };

  // Initialize audio element
  useEffect(() => {
    try {
      console.log('Initializing audio element...');
      // Create audio element with your custom 10-second MP3 file
      // Place your audio file in the public/audio/ directory
      const isProduction = window.location.hostname !== 'localhost';
      const audioPath = isProduction ? '/audio/breathing.mp3' : '/audio/breathing.mp3';
      console.log('Loading audio from:', audioPath);
      audioRef.current = new Audio(audioPath);
      
      // Add additional debugging
      console.log('Audio element created:', audioRef.current);
      console.log('Audio src:', audioRef.current.src);
      console.log('Audio readyState:', audioRef.current.readyState);
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true; // Loop the 10-second audio continuously

      // Check if audio file is loaded
      const checkAudioLoaded = () => {
        console.log('Audio loaded successfully');
        if (audioRef.current?.readyState === 4) {
          setAudioLoaded(true);
          setError(null);
          console.log('MP3 audio ready to play');
        }
      };

      // Add error handling
      const handleAudioError = (error: Event) => {
        console.error('Audio loading error:', error);
        setError('MP3 audio failed to load - trying alternatives');
        // Try alternative paths if first one fails
        if (audioRef.current) {
          const isProduction = window.location.hostname !== 'localhost';
          const alternativePaths = isProduction ? [
            '/audio/breathing.mp3',
            './audio/breathing.mp3',
            '/breathing-app/audio/breathing.mp3'
          ] : [
            '/audio/breathing.mp3',
            './audio/breathing.mp3',
            '/breathing-app/audio/breathing.mp3'
          ];
          
          const currentSrc = audioRef.current.src;
          const currentPathIndex = alternativePaths.findIndex(path => currentSrc.includes(path));
          const nextPathIndex = (currentPathIndex + 1) % alternativePaths.length;
          
          console.log(`Trying alternative audio path: ${alternativePaths[nextPathIndex]}`);
          audioRef.current.src = alternativePaths[nextPathIndex];
          audioRef.current.load();
        }
      };

      // Add event listener for when audio is loaded
      audioRef.current.addEventListener('canplaythrough', checkAudioLoaded);
      audioRef.current.addEventListener('error', handleAudioError);

      // Add timeout to handle slow loading
      const timeoutId = setTimeout(() => {
        if (!audioLoaded && audioRef.current) {
          console.log('Audio loading timeout, checking readyState...');
          if (audioRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
            setAudioLoaded(true);
            setError(null);
          } else {
            setError('Audio loading timed out - trying fallback');
            // Try fallback audio only after MP3 completely fails
            createFallbackAudio();
          }
        }
      }, 10000); // 10 second timeout to give MP3 more time

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('canplaythrough', checkAudioLoaded);
          audioRef.current.removeEventListener('error', handleAudioError);
        }
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError('Failed to initialize audio');
      // Try fallback audio
      createFallbackAudio();
    }
  }, []);

  // Toggle audio on/off
  const toggleAudio = () => {
    if (!audioLoaded) return;

    const newAudioState = !isAudioEnabled;
    setIsAudioEnabled(newAudioState);
    
    if (newAudioState) {
      if (usingFallbackAudio && oscillatorRef.current && audioContextRef.current) {
        // Start fallback audio with breathing rhythm
        startFallbackAudio();
      } else if (audioRef.current) {
        // Start the looping audio
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
    } else {
      if (usingFallbackAudio && oscillatorRef.current) {
        // Stop fallback audio
        oscillatorRef.current.stop();
        console.log('Fallback audio stopped');
      } else if (audioRef.current) {
        // Stop the audio
        audioRef.current.pause();
      }
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

  // Text opacity based on phase timing - smoother transitions
  const getTextOpacity = () => {
    const progress = state.timeInPhase / phaseDurations[state.phase];
    // Smooth fade in at the beginning, no fade out to prevent unwanted text
    if (progress < 0.15) return progress / 0.15; // Fade in over first 15%
    return 1; // Stay fully visible throughout the phase
  };

  const scale = getOrbScale();
  const glowIntensity = getGlowIntensity();
  const textOpacity = getTextOpacity();

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at center, 
          rgba(75, 0, 130, 0.3) 0%, 
          rgba(25, 25, 112, 0.5) 30%, 
          rgba(72, 61, 139, 0.7) 60%, 
          rgba(25, 25, 112, 0.9) 100%
        ),
        linear-gradient(45deg,
          #191970 0%, #483d8b 25%, #6a5acd 50%, #4b0082 75%, #2f1b69 100%
        )
      `
    }}>
      {/* Subtle background particles/stars */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Audio control button */}
      <div style={{ position: 'absolute', top: '32px', right: '32px', zIndex: 10 }}>
        <button
          onClick={toggleAudio}
          disabled={!audioLoaded}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backdropFilter: 'blur(4px)',
            border: audioLoaded ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
            background: audioLoaded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
            cursor: audioLoaded ? 'pointer' : 'not-allowed',
            opacity: audioLoaded ? 1 : 0.5,
            transition: 'all 0.3s ease',
            boxShadow: isAudioEnabled && audioLoaded
              ? '0 0 20px rgba(147, 112, 219, 0.4)' 
              : '0 0 10px rgba(255, 255, 255, 0.1)'
          }}
        >
          {!audioLoaded ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.6)', animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          ) : isAudioEnabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="22" y1="9" x2="16" y2="15"></line>
              <line x1="16" y1="9" x2="22" y2="15"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Main breathing orb */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative',
            transform: `scale(${scale})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Main orb */}
          <div
            style={{
              width: '192px',
              height: '192px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(147,112,219,0.3) 100%)',
              backdropFilter: 'blur(4px)',
              boxShadow: `
                0 0 ${60 * glowIntensity}px rgba(147, 112, 219, ${0.6 * glowIntensity}),
                0 0 ${120 * glowIntensity}px rgba(147, 112, 219, ${0.4 * glowIntensity}),
                0 0 ${200 * glowIntensity}px rgba(147, 112, 219, ${0.2 * glowIntensity}),
                inset 0 0 ${40 * glowIntensity}px rgba(255, 255, 255, ${0.1 * glowIntensity})
              `
            }}
          />
          
          {/* Inner glow */}
          <div
            style={{
              position: 'absolute',
              inset: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(147,112,219,0.2) 100%)',
              opacity: glowIntensity * 0.8,
              transition: 'opacity 0.1s ease'
            }}
          />
          
          {/* Core light */}
          <div
            style={{
              position: 'absolute',
              inset: '33%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              opacity: glowIntensity,
              transform: `scale(${0.8 + (glowIntensity * 0.4)})`,
              transition: 'all 0.1s ease'
            }}
          />
        </div>
      </div>

      {/* Text overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        paddingTop: '320px'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          letterSpacing: '0.05em',
          fontSize: '18px',
          fontWeight: '300',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          opacity: textOpacity,
          transition: 'opacity 0.1s ease'
        }}>
          {getPhaseText()}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: '100px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          maxWidth: '90%',
          textAlign: 'center',
          zIndex: 20
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            lineHeight: '1.3',
            margin: 0,
            fontFamily: 'var(--font-family)',
            fontWeight: '400',
            background: 'rgba(255,0,0,0.1)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,0,0,0.3)'
          }}>
            ⚠️ {error} - Audio may not work properly
          </p>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div style={{ 
        position: 'absolute', 
        bottom: '8px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        maxWidth: '90%',
        textAlign: 'center'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '10px',
          lineHeight: '1.3',
          margin: 0,
          fontFamily: 'var(--font-family)',
          fontWeight: '300'
        }}>
          The tools, tips, and resources provided by Modak are for informational and educational purposes only. They are not intended to diagnose, treat, cure, or prevent any mental health condition.
          <br />
          These materials are not a substitute for professional medical advice, diagnosis, or treatment. If you or someone you know is experiencing emotional distress or a mental health emergency, please contact a licensed healthcare provider or call 988 for immediate support in the U.S.
        </p>
      </div>

      {/* Cycle indicator */}
      <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[...Array(totalCycles)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                background: i + 1 <= state.cycle ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Breathing method indicator */}
      <div style={{ position: 'absolute', top: '32px', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '300', margin: 0, letterSpacing: '0.05em' }}>
            4-6 Breathing Method
          </p>
          <p style={{ fontSize: '12px', opacity: 0.6, margin: '4px 0 0 0' }}>
            4s inhale • 6s exhale
          </p>
          {isAudioEnabled && audioLoaded && (
            <p style={{ fontSize: '11px', opacity: 0.5, margin: '4px 0 0 0' }}>
              🎵 Audio enabled {usingFallbackAudio && '(tone)'}
            </p>
          )}
          {!audioLoaded && (
            <p style={{ fontSize: '11px', opacity: 0.5, margin: '4px 0 0 0' }}>
              Audio loading... (breathing exercise works without audio)
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          50% { opacity: 0.3; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}