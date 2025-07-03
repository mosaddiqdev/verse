# Verse

A minimal poetry reading experience. One poem, one day, one moment of stillness.

## About

Verse is a Progressive Web App that presents a single poem each day, carefully selected from a curated collection of over 14,000 pieces. It's designed as a quiet rebellion against endless scrolling and information overload.

## Features

- **Daily Poetry**: One poem per day, never repeated
- **Offline Reading**: Works without internet connection
- **Progressive Web App**: Install on any device
- **Minimal Design**: Clean, distraction-free interface
- **Dark/Light Mode**: Automatic theme switching
- **Mobile Optimized**: Beautiful on all screen sizes

## Installation

### As a Web App
1. Visit the website
2. Click "Install app?" when prompted
3. Enjoy native app experience

### Local Development
```bash
# Clone the repository
git clone https://github.com/mosaddiqdev/verse.git

# Navigate to directory
cd verse

# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .
```

## Technology

- **Vanilla JavaScript** - No frameworks, pure web standards
- **CSS Custom Properties** - Modern styling approach
- **Service Workers** - Offline functionality
- **Web App Manifest** - PWA capabilities

## Data

Poetry collection sourced from [Michael Arman's Poems Dataset](https://www.kaggle.com/datasets/michaelarman/poemsdataset) on Kaggle, organized by mood and theme for daily selection.

## Philosophy

In a world that profits from our restlessness, Verse offers stillness. No infinite scroll, no notifications, no tracking. Just poetry, typography, and space to think.

## License

MIT License - see LICENSE file for details
