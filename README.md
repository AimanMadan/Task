# Challenge  

A modern web application that provides personalized bodybuilding advice and protein factory simulation, built with Next.js, Supabase.


##  What I Learned

### Learnings

   - Implementing OAuth with Supabase: adding google auth and setting up google cloude, handling middleware and rerouting.
   - Managing protected routes using supabase: adding keys in supabase, adding callback URL in supabase and google cloud auth
   - Versel deployment: I have learned how easy it is to use Versel for deployment and it's safe deployment updates when doing pull requests in Github.
   - Route handlers: middleware routing 
   - Dark mode implementation.
   - Using chat history context to generate better responses.
   - how to apply thinking and show real time updates for my thinking layer.




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
