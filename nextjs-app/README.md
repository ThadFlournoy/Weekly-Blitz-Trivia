# 🏈 Weekly Blitz Trivia

A modern, full-stack NFL trivia web application featuring real-time authentication, dynamic game mechanics, and competitive leaderboards. Built to showcase modern web development practices and clean UI/UX design.

## ✨ Features

- **🎮 Interactive Trivia Game**
  - 20-second countdown timer per question
  - Difficulty-based scoring system (Easy: 2pts, Medium: 6pts, Hard: 15pts)
  - Smooth question transitions with Framer Motion
  - Real-time answer validation

- **👤 User Authentication**
  - Secure sign-up/login with Supabase Auth
  - Persistent sessions with cookie management
  - Protected routes and user-specific data

- **🏆 Competitive Leaderboards**
  - Weekly score tracking
  - Top 10 rankings per week
  - Automatic score updates (keeps highest score)
  - Profile integration with usernames

- **📱 Responsive Design**
  - Web-first approach
  - Blurred background effects
  - Loading screens and smooth transitions
  - Optimized for all screen sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React 19** - Latest React features

### Backend & Database
- **Supabase** - Authentication & PostgreSQL database
- **Row Level Security (RLS)** - Database-level authorization
- **PostgreSQL Functions** - Custom RPC for score updates

### Development Tools
- **Turbopack** - Fast bundler for development
- **ESLint** - Code quality and consistency
- **TypeScript Compiler** - Type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ThadFlournoy/Weekly-Blitz-Trivia.git
   cd Weekly-Blitz-Trivia/nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with background
│   │   ├── page.tsx             # Home page with modal
│   │   ├── about/               # About page
│   │   ├── auth/                # Authentication page
│   │   ├── game/                # Game logic & board
│   │   │   ├── page.tsx         # Week selection
│   │   │   └── GameBoard.tsx    # Main game component
│   │   ├── leaderboard/         # Leaderboard page
│   │   └── ui/
│   │       └── globals.css      # Global styles
│   └── utils/
│       └── supabase/            # Supabase client utilities
│           ├── client.ts        # Browser client
│           ├── server.ts        # Server client
│           └── middleware.ts    # Auth middleware
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Game Mechanics
- Questions are fetched from Supabase based on selected week
- 20-second timer with visual warnings (yellow at 10s, red at 5s)
- Difficulty badges displayed on each question
- Score calculation happens client-side and syncs to database on completion

### Authentication Flow
- Email/password authentication via Supabase
- User metadata stored with username
- Protected game features (score submission requires auth)
- Persistent sessions across page refreshes

### Leaderboard System
- Weekly-based competition
- Displays top 10 scores per week
- Automatic ranking with medal emojis (🥇🥈🥉)
- Shows player usernames from profiles table

## 📝 Available Scripts

```bash
npm run dev         # Start development server with Turbopack
npm run build       # Create production build
npm run start       # Start production server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run type-check  # Check TypeScript types
```

## 🚢 Deployment

This app is ready to deploy on:

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy!

### Other Platforms
Compatible with any platform supporting Next.js (Netlify, Railway, etc.)

**Don't forget to add your environment variables!**

## 🔐 Security

- Uses Supabase Row Level Security (RLS) for data protection
- Anon key is safe to expose (client-side)
- Service role key never used in client code
- User data protected by authentication policies

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to open an issue or contact me directly.

## 📧 Contact

**Thad Flournoy**
- LinkedIn: [linkedin.com/in/thadflournoy](https://www.linkedin.com/in/thadflournoy/)
- Email: thadflournoy7@gmail.com

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, TypeScript, and Supabase