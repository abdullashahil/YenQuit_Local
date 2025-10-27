# 🚭 YenQuit: Tobacco Cessation & Motivation App

> **Built with Next.js 16** | Migrated from React + Vite | Production Ready

## Project Overview

Yenquit is a scientifically-backed digital health platform designed to assist users in quitting tobacco use. Utilizing the clinically validated **5 A's (Ask, Advise, Assess, Assist, Arrange)** and **5 R's (Relevance, Risks, Rewards, Roadblocks, Repetition)** counseling models, the application provides personalized guidance, assessment, motivational tools, and structured planning resources.

This application is divided into a public-facing component, a robust user dashboard, and a private admin panel for system management and content configuration.

---

## 🚀 Key Features and Scientific Modules

The core of the Yenquit app is its two distinct, scientifically-guided pathways, ensuring personalized intervention regardless of the user's readiness level.

### 1. Initial Assessment & Branching

The user's first interaction post-login determines their path:

- **Initial Data Collection:** Gathers essential demographic data and current tobacco use status.  
- **Readiness Check:** A key question determines if the user is ready to quit now (redirect to 5 A's) or needs motivation (redirect to 5 R's).

### 2. The 5 A's Pathway (Ready to Quit)

Designed for users motivated to quit immediately, focusing on planning and support:

- **ASK:** Incorporates detailed questionnaires, including the *Fagerström Test for Nicotine Dependence*, to assess dependency.  
- **ADVISE:** Provides personalized health risks and motivational messages (e.g., doctor videos, AI-generated health impact data).  
- **ASSESS:** Gauges readiness using a horizontal scale (1-10) and sets the stage for a quit date.  
- **ASSIST:** Tools for setting a Quit Date, identifying triggers, selecting coping strategies, and accessing counseling.  
- **ARRANGE:** Scheduling push notifications for motivation, progress check-ins, and linking to community support.

### 3. The 5 R's Pathway (Reluctant/Motivational)

Designed for users who are not yet ready, focusing on building motivation:

- **RELEVANCE:** Identifies personal quitting goals (family, money, health, etc.) and shows projected savings.  
- **RISKS:** Displays personalized risk feedback and visual aids (carousel of images) to emphasize negative consequences.  
- **REWARDS:** Highlights short-and long-term benefits with a timeline animation and gamified Reward Badges. Includes the *Self-Efficacy Questionnaire.*  
- **ROADBLOCKS:** Identifies common barriers and provides specific coping tips for each (e.g., stress, peer pressure).  
- **REPETITION:** Ensures continuous exposure to motivational content and sets automated follow-up reminders.

### 4. Admin Panel & Configuration

A secure dashboard for application oversight and management:

- **Role Management:** Manage user access with Admin and Co-Admin roles.  
- **System Configuration:** Tools to update global content (Site Banner, Landing Page text) and manage API keys (AI services, Analytics).  
- **Security Logs:** Track user activities, login attempts, and key admin actions.

---

## Technical Stack

YenQuit is built as a modern Next.js application with server-side rendering capabilities.

| **Category** | **Technology** | **Purpose** |
|---------------|----------------|--------------|
| Framework | **Next.js 16** | React framework with file-based routing, SSR, and optimization |
| Frontend UI | **React 19** | Component-based, responsive interface |
| Language | **TypeScript** | Type-safe development |
| Styling | **Tailwind CSS v3** | Utility-first styling for rapid, responsive design |
| UI Components | **shadcn/ui + Radix UI** | Accessible, customizable component library |
| State Management | **React Context** | Global state with session persistence |
| Data Storage | Google Firestore (planned) | Real-time, scalable NoSQL database |
| Authentication | Firebase Auth (planned) | Secure user management |
| Deployment | Vercel / Netlify | Optimized Next.js hosting |

---

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd YenQuit
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Copy the example environment file and add your configuration:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and API keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other variables
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

### Standard Next.js Structure (Feature-Based Organization)

```
YenQuit/
├── pages/                          # Next.js Pages Router (routes)
│   ├── _app.tsx                   # App wrapper with providers
│   ├── _document.tsx              # HTML document structure
│   ├── index.tsx                  # Landing page (/)
│   ├── login.tsx                  # Login/Signup (/login)
│   ├── onboarding.tsx             # Onboarding (/onboarding)
│   │
│   ├── app/                       # User dashboard routes
│   │   ├── index.tsx              # Dashboard (/app)
│   │   ├── learning.tsx           # Learning Hub (/app/learning)
│   │   ├── community.tsx          # Community (/app/community)
│   │   └── profile.tsx            # Profile (/app/profile)
│   │
│   ├── admin/                     # Admin panel routes
│   │   ├── index.tsx              # Admin Dashboard (/admin)
│   │   ├── users.tsx              # User Management (/admin/users)
│   │   ├── content.tsx            # Content Management (/admin/content)
│   │   └── settings.tsx           # System Settings (/admin/settings)
│   │
│   ├── 5a/                        # 5A's flow routes
│   │   ├── ask.tsx                # Ask step (/5a/ask)
│   │   ├── advise.tsx             # Advise step (/5a/advise)
│   │   ├── assess.tsx             # Assess step (/5a/assess)
│   │   ├── assist.tsx             # Assist step (/5a/assist)
│   │   └── arrange.tsx            # Arrange step (/5a/arrange)
│   │
│   └── 5r/                        # 5R's flow routes
│       ├── relevance.tsx          # Relevance step (/5r/relevance)
│       ├── risks.tsx              # Risks step (/5r/risks)
│       ├── rewards.tsx            # Rewards step (/5r/rewards)
│       ├── roadblocks.tsx         # Roadblocks step (/5r/roadblocks)
│       └── repetition.tsx         # Repetition step (/5r/repetition)
│
├── src/
│   ├── components/
│   │   ├── features/              # Feature-based components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── landing/           # Landing page components
│   │   │   ├── onboarding/        # Onboarding components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   ├── learning/          # Learning hub components
│   │   │   ├── community/         # Community components
│   │   │   ├── profile/           # Profile components
│   │   │   ├── flow-5a/           # 5A's flow components
│   │   │   ├── flow-5r/           # 5R's flow components
│   │   │   └── flow-shared/       # Shared flow components
│   │   │
│   │   ├── layouts/               # Layout components
│   │   │   ├── AppLayout.tsx      # User dashboard layout
│   │   │   ├── AdminLayout.tsx    # Admin panel layout
│   │   │   └── Sidebar.tsx        # Sidebar component
│   │   │
│   │   ├── admin/                 # Admin-specific components
│   │   ├── ui/                    # shadcn/ui components
│   │   └── images/                # Image components
│   │
│   ├── context/                   # React Context providers
│   │   └── AppContext.tsx         # Global app state
│   │
│   ├── lib/                       # Third-party configs
│   │   └── README.md              # Firebase, API clients, etc.
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── README.md              # useAuth, useLocalStorage, etc.
│   │
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # Global type definitions
│   │
│   ├── utils/                     # Utility functions
│   │   ├── cn.ts                  # Tailwind class merger
│   │   └── README.md              # Helper functions
│   │
│   └── styles/                    # Global styles
│       └── globals.css            # Tailwind + custom styles
│
├── public/                        # Static assets
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Dependencies and scripts
```

### Key Structure Features

**✅ Feature-Based Organization**
- Components grouped by feature in `src/components/features/`
- Better scalability and maintainability
- Easy to locate related code

**✅ Standard Directories**
- `src/lib/` - Third-party library configurations
- `src/hooks/` - Custom React hooks
- `src/types/` - Centralized TypeScript type definitions
- `src/utils/` - Helper functions and utilities

**✅ Centralized Layouts**
- All layout components in `src/components/layouts/`
- Reusable across different page types

**✅ Type Safety**
- Global types in `src/types/index.ts`
- Consistent type definitions across the app

---

## 🎉 Next.js Migration

This project was successfully migrated from **React + Vite + React Router** to **Next.js 16**.

### What Changed

#### ✅ Routing
- **Before**: React Router with `<BrowserRouter>` and `<Routes>`
- **After**: Next.js file-based routing in `pages/` directory
- **Navigation**: Use `useRouter()` from `next/router` instead of `useNavigate()`

#### ✅ State Management
- Created `AppContext` for global state
- Session persistence with `sessionStorage`
- Type-safe state management with TypeScript

#### ✅ Layouts
- `AppLayout` for user dashboard pages
- `AdminLayout` for admin panel pages
- Shared navigation and authentication logic

#### ✅ All Routes Migrated (23 pages)
- Landing, Login, Onboarding
- 4 App pages (Dashboard, Learning, Community, Profile)
- 4 Admin pages (Users, Content, Settings)
- 5 A's flow (5 pages)
- 5 R's flow (5 pages)

### Removed Files
- `index.html` - Vite entry point
- `vite.config.ts` - Vite configuration
- `src/main.tsx` - React entry point
- `src/App.tsx` - React Router setup
- React Router dependencies

---

## 🔑 Key Features

### Next.js Benefits
- **File-based Routing**: Automatic routing based on file structure
- **Server-Side Rendering**: Better SEO and initial load performance
- **Code Splitting**: Automatic optimization per page
- **Fast Refresh**: Instant feedback during development
- **Production Ready**: Optimized builds out of the box

### Application Features
- **Session-based Authentication**: Simple auth with role-based access
- **Protected Routes**: Authentication checks on all protected pages
- **Persistent State**: User data persists across page refreshes
- **Responsive Design**: Mobile-first, works on all devices
- **Accessible UI**: Built with Radix UI primitives

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Linting
npm run lint         # Run Next.js ESLint
```

---

## 🎯 Next Steps

1. **Firebase Integration**: Set up Firebase for authentication and database
2. **Image Optimization**: Replace `<img>` tags with Next.js `<Image>` component
3. **API Routes**: Add Next.js API routes for backend functionality
4. **Testing**: Implement unit and integration tests
5. **Deployment**: Deploy to Vercel or Netlify
6. **Analytics**: Add tracking and monitoring
7. **SEO**: Implement meta tags and Open Graph

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)

---

## 🤝 Contributing

When contributing to this project:
1. Use TypeScript for type safety
2. Follow the existing file structure
3. Use `useAppContext()` hook for global state
4. Implement proper error handling
5. Test on both development and production builds
6. Follow Next.js best practices

---

## 📄 License

This project is part of the YenQuit tobacco cessation initiative.

---

**Built with ❤️ using Next.js | Migration completed successfully! 🎉**
