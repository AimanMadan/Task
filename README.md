# Challenge  

A modern web application that provides personalized bodybuilding advice and protein factory simulation, built with Next.js, Supabase.



### Features
- **Authentication System**
  - Secure Google OAuth integration
  - Protected routes for authenticated users
  - Persistent sessions with Supabase

- **Bodybuilding Advice**
  - AI-powered workout and nutrition advice
  - Markdown-formatted responses
  - Example questions for easy interaction


- **Protein Factory Simulator**
  - Interactive protein production simulation
  - Real-time data visualization


### Tech Stack
- **Frontend**
  - Next.js 15 with App Router
  - React 
  - Tailwind CSS for styling
  - Shadcn UI components
  - React Markdown for content rendering

- **Backend**
  - Supabase for authentication and database
  - Next.js API routes
  - OpenAI integration for advice generation

- **Deployment**
  - Vercel for hosting
  - Environment variable management
  - Production-ready configuration

##  What I Learned

### Technical Learnings
1. **Modern Authentication**
   - Implementing OAuth with Supabase
   - Managing protected routes


2. **Next.js App Router**
   - Server and client components
   - Route handlers

3. **UI/UX Development**
   - Dark mode implementation


### Best Practices
- Environment variable management
- Type safety with TypeScript
- Code organization and modularity
- Error handling and user feedback
- Performance optimization

##  What I'd Improve

### Technical Improvements
1. **Features**
   - Add user profiles and progress tracking
   - Implement workout logging

2. **User Experience**
   - Add more interactive visualizations
   - Improve accessibility




##  Getting Started

1. Clone the repository
```bash
git clone https://github.com/AimanMadan/Task.git
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_OPENAI_API_KEY="api"
```

4. Run the development server
```bash
pnpm dev
```
