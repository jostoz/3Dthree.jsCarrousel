# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 14 application showcasing a 3D interactive gallery using Three.js. The core architecture consists of:

### Main Gallery Component (`app/page.tsx`)
- **3D Scene Setup**: Creates a circular arrangement of image planes using Three.js with OrbitControls
- **Dual Layer System**: 
  - Foreground: Interactive gallery planes arranged in a circle (radius: 10 units)
  - Background: Floating particle system for visual depth
- **Scroll-Based Navigation**: Gallery rotation is controlled by scroll position, with automatic index tracking
- **Click Interaction**: Raycasting detects plane clicks to open detailed modal views
- **Mouse Parallax**: Background particles respond to mouse movement for enhanced interactivity

### Key Technical Details
- **Gallery Data Structure**: Static array of research items with image URLs, titles, descriptions, and content
- **3D Positioning**: Planes positioned using trigonometric calculations `(Math.cos/sin(angle) * radius)`
- **Texture Loading**: Asynchronous texture loading with Three.js TextureLoader
- **Event Management**: Comprehensive cleanup of event listeners (resize, scroll, mousemove, click, keydown)
- **State Management**: React hooks for current index tracking and modal state

### UI Framework
- **Styling**: Tailwind CSS with custom configuration supporting shadcn/ui components
- **Typography**: Inter font via next/font optimization
- **Icons**: Lucide React for UI icons
- **Animations**: Framer Motion for modal transitions

### Dependencies
- **Core**: Next.js 14 with React 18
- **3D Graphics**: Three.js with OrbitControls and CSS2DRenderer
- **Animation**: Framer Motion, GSAP
- **UI**: Tailwind CSS, shadcn/ui components (Radix UI, class-variance-authority)
- **Utilities**: clsx, tailwind-merge for className management

## File Structure Notes
- Single-page application with gallery as the main page component
- Utility functions in `lib/utils.ts` for className merging
- Global styles and layout defined in `app/` directory following Next.js 14 app router structure