# Adding Custom Audio to Your Breathing Exercise

This guide explains how to add your own calming 10-second audio file to synchronize with the breathing exercise.

## Required Audio File

Create a `public/audio/` directory in your project and add this single audio file:

```
public/
└── audio/
    └── breathing.mp4    (10 seconds) - Complete breathing cycle audio
```

## Audio File Specifications

### Breathing Audio (`breathing.mp4`)
- **Duration**: Exactly 10 seconds
- **Structure**: 4 seconds for inhale phase + 6 seconds for exhale phase
- **Format**: MP4 (widely supported, good compression)
- **Style**: Seamlessly looping, calming breathing audio
- **Examples**: 
  - Rising then falling meditation tones
  - Ocean waves with breathing rhythm
  - Gentle ambient pad that swells and releases
  - Nature sounds that ebb and flow
- **Volume**: Should be calming and not overpower the visual experience

## Audio Design Guidelines

### Structure Your 10-Second Audio:
```
Seconds 0-4:  Inhale phase - gentle rise, building energy
Seconds 4-10: Exhale phase - gentle fall, releasing energy
```

### Key Requirements:
- **Seamless Loop**: End should transition smoothly back to the beginning
- **No Sudden Changes**: Avoid jarring transitions or loud peaks
- **Consistent Volume**: Keep levels balanced throughout
- **Natural Rhythm**: Should feel like natural breathing

## Recommended Audio Sources

### Free Resources:
- **Freesound.org** - High-quality free sound effects and ambient recordings
- **Zapsplat** - Professional sound library (free with registration)
- **YouTube Audio Library** - Free music and sound effects
- **BBC Sound Effects** - Free atmospheric recordings

### Royalty-Free Music:
- **Epidemic Sound**
- **AudioJungle**
- **Pond5**
- **Artlist**

## Creating Your Own Audio

### Tools for Audio Creation:
- **Free**: Audacity, GarageBand (Mac), Reaper (60-day trial)
- **Professional**: Adobe Audition, Logic Pro (Mac), Ableton Live

### Step-by-Step Creation:

1. **Plan the Structure**
   ```
   0-4s: Inhale (rising tone/energy)
   4-10s: Exhale (falling tone/release)
   ```

2. **Choose Your Base Sound**
   - Sine wave oscillator for pure tones
   - Ambient pads for atmospheric sounds
   - Nature recordings (ocean, wind, rain)
   - Recorded breathing sounds

3. **Create the Inhale Phase (0-4s)**
   - Start soft and gentle
   - Gradually increase volume or frequency
   - Peak around 4-second mark
   - Think: expansion, gathering energy

4. **Create the Exhale Phase (4-10s)**
   - Start from the peak
   - Gradually decrease volume or frequency
   - End softly to loop seamlessly
   - Think: release, letting go

5. **Ensure Seamless Looping**
   - The end (10s) should match the beginning (0s)
   - No clicks, pops, or sudden changes
   - Test the loop multiple times

## File Format Guidelines

- **Format**: MP4 (best compatibility and compression)
- **Alternative**: MP3 (also widely supported)
- **Bitrate**: 128-192 kbps (good quality, reasonable file size)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo preferred, mono acceptable

## Example Audio Ideas

### 1. **Meditation Tone**
- Rising sine wave (220Hz → 330Hz) over 4 seconds
- Falling sine wave (330Hz → 220Hz) over 6 seconds
- Add gentle reverb for spaciousness

### 2. **Ocean Waves**
- Wave building and crashing over 4 seconds
- Wave receding over 6 seconds
- Layer with subtle ambient pad

### 3. **Nature Ambience**
- Wind building through trees (4s)
- Wind settling and calming (6s)
- Add distant bird calls for depth

### 4. **Ambient Pad**
- Soft synthesizer pad swelling (4s)
- Gentle release and fade (6s)
- Use warm, calming tones

## Testing Your Audio

1. Add your `breathing.mp4` file to `public/audio/`
2. Start your development server
3. Click the audio button in the app
4. Verify the loop is seamless (no gaps or clicks)
5. Check that the rhythm matches the visual breathing
6. Adjust volume if needed (currently set to 50%)

## Volume Control

The audio volume is set to 50% by default:

```javascript
audioRef.current.volume = 0.5; // Adjust between 0.0 and 1.0
```

You can modify this in the component if needed, or adjust the volume of your source audio file.

## Troubleshooting

### Audio Won't Play
- Check file path: `/audio/breathing.mp4`
- Ensure file is in `public/audio/` directory
- Verify MP4 format is supported
- Check browser console for errors

### Audio Doesn't Loop Smoothly
- Remove any silence at beginning/end of file
- Ensure audio levels match at start and end points
- Check for audio compression artifacts

### Audio Too Loud/Quiet
- Adjust volume in your audio editing software
- Or modify the volume setting in the component code

## Example Directory Structure

```
your-project/
├── public/
│   └── audio/
│       └── breathing.mp4    # 10-second looping breathing audio
├── components/
│   └── BreathingExercise.tsx
└── App.tsx
```

## Pro Tips

- **Test on Different Devices**: Audio may sound different on phones vs computers
- **Consider Headphones**: Design for both speakers and headphones
- **Keep It Subtle**: The visual orb is the main focus, audio should enhance
- **Multiple Versions**: Create a few options and test which feels most calming

Ready to create the perfect breathing soundtrack! 🎵✨