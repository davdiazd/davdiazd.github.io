# 4-6 Breathing Exercise App

A beautiful, interactive breathing exercise application designed to reduce anxiety and activate the parasympathetic nervous system using the scientifically-backed 4-6 breathing method.

![Breathing Exercise Demo](https://via.placeholder.com/800x400/191970/FFFFFF?text=Calming+Breathing+Exercise)

## ✨ Features

- **4-6 Breathing Pattern**: 4-second inhale, 6-second exhale for optimal relaxation
- **Seamless Animation**: Smoothly animated orb that expands and contracts with your breath
- **Calming Visuals**: Deep blue/violet gradient background with subtle particle effects
- **30-Second Sessions**: Complete 3 breathing cycles (30 seconds total) with seamless looping
- **Visual Guidance**: Gentle text overlays guide you through each phase
- **Progress Tracking**: Visual cycle indicators show your progress
- **Optional Audio**: Support for custom 10-second looping audio files
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Accessible**: Includes proper ARIA labels and keyboard support

## 🧘‍♀️ The Science

The 4-6 breathing method is specifically designed to:
- **Activate the parasympathetic nervous system** (rest and digest response)
- **Reduce anxiety and stress** through controlled breathing
- **Lower heart rate and blood pressure**
- **Improve focus and mindfulness**

The longer exhale (6 seconds vs 4 seconds inhale) is key to triggering the body's relaxation response.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Motion** (formerly Framer Motion) for smooth animations
- **Tailwind CSS v4** for styling
- **Vite** for fast development and building
- **Custom CSS gradients** for calming visual effects
- **Modern React Hooks** for state management

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/breathing-exercise-app.git
cd breathing-exercise-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Add your custom audio file:
```bash
# Create audio directory
mkdir public/audio
# Add your 10-second breathing.mp4 file
cp your-breathing-audio.mp4 public/audio/breathing.mp4
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

1. **Start the app** - The breathing exercise begins automatically
2. **Follow the orb** - Watch as it expands during inhale (4s) and contracts during exhale (6s)
3. **Read the prompts** - Gentle text overlays guide you: "Inhale" and "Now exhale slowly..."
4. **Complete cycles** - Each session includes 3 complete breathing cycles (30 seconds)
5. **Seamless loop** - The exercise repeats automatically for continuous practice
6. **Optional audio** - Click the audio button to enable/disable synchronized breathing sounds

### Tips for Best Results
- Find a comfortable, quiet space
- Focus on matching your breathing to the orb's movement
- Allow your shoulders to relax during exhales
- Practice regularly for maximum benefit
- Use headphones for the best audio experience (if using custom audio)

## 🎵 Custom Audio Setup

The app supports custom 10-second audio files that loop with the breathing pattern. See `AUDIO_SETUP.md` for detailed instructions on:
- Creating or finding suitable audio files
- File format specifications (MP4 recommended)
- Audio design guidelines for optimal relaxation
- Troubleshooting audio issues

The app works perfectly without audio - the visual breathing guide is the primary experience.

## ⚙️ Customization

The app is highly customizable. You can modify:

### Timing
```typescript
// In components/BreathingExercise.tsx
const phaseDurations = {
  'inhale': 4000,  // Change inhale duration (milliseconds)
  'exhale': 6000   // Change exhale duration (milliseconds)
};

const totalCycles = 3; // Adjust number of cycles
```

### Visual Style
```typescript
// Modify colors in the gradient background
background: `
  radial-gradient(ellipse at center, 
    rgba(75, 0, 130, 0.3) 0%,     // Deep purple
    rgba(25, 25, 112, 0.5) 30%,   // Midnight blue
    // ... customize colors
  )
`
```

### Animation Easing
```typescript
// Adjust orb expansion/contraction curves
const easeInProgress = 1 - Math.pow(1 - progress, 2); // Inhale easing
const blendedProgress = (linearProgress * 0.7) + (gentleEaseProgress * 0.3); // Exhale easing
```

## 📱 Mobile Support

The app is fully responsive and includes:
- Touch-friendly interface
- Optimized animations for mobile performance
- Full-screen experience on mobile devices
- Proper viewport handling
- Audio support on mobile browsers

## 🎨 Design System

Built with a cohesive design system featuring:
- **Typography**: Clean, readable fonts with proper hierarchy
- **Colors**: Calming blue/violet palette designed for relaxation
- **Spacing**: Consistent spacing using Tailwind's system
- **Animations**: Smooth, natural movements that enhance the breathing rhythm

## 🔧 Development

### Project Structure
```
├── App.tsx                          # Main application component
├── main.tsx                         # Application entry point
├── index.html                       # HTML template
├── vite.config.ts                   # Vite configuration
├── package.json                     # Dependencies and scripts
├── components/
│   └── BreathingExercise.tsx       # Core breathing exercise logic
├── styles/
│   └── globals.css                 # Global styles and design tokens
├── public/
│   └── audio/                      # Optional audio files
│       └── breathing.mp4           # 10-second breathing audio
├── AUDIO_SETUP.md                  # Audio setup guide
└── README.md                       # This file
```

### Key Components
- **BreathingExercise**: Main component handling timing, animations, and visual states
- **Motion animations**: Smooth scaling and opacity transitions
- **Responsive layout**: Flexbox-based design that works on all screen sizes
- **Audio system**: Optional synchronized audio playback

### Build Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚦 Breathing Patterns

Currently supports:
- **4-6 Method** (default): 4s inhale, 6s exhale

### Potential Extensions
- 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s)
- Box breathing (4-4-4-4 pattern)
- Triangle breathing (4-4-4 pattern)

## 🧪 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Audio support may vary by browser and requires user interaction to start.

## 📦 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Add different breathing patterns
- Implement session tracking and statistics
- Create themes for different times of day
- Add haptic feedback for mobile devices
- Improve accessibility features
- Add user preferences and settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by evidence-based breathing techniques for anxiety reduction
- Design influenced by meditation and mindfulness app UX patterns
- Built with modern React and animation best practices

## 🔗 Links

- [Live Demo](https://your-breathing-app.vercel.app)
- [Report Bug](https://github.com/yourusername/breathing-exercise-app/issues)
- [Request Feature](https://github.com/yourusername/breathing-exercise-app/issues)

---

**Made with ❤️ for better mental health and wellbeing**