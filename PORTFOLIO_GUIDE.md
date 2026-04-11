# Next.js Developer Portfolio - Complete Setup Guide

Your stunning, fully-functional developer portfolio website is now live at **http://localhost:3000**! 🎉

## 🚀 What's Been Built

A production-ready, feature-rich portfolio featuring:

### ✨ Features Implemented

1. **Navbar** - Sticky navigation with active section tracking, dark mode toggle, and mobile hamburger menu
2. **Hero Section** - Animated headline with typewriter effect, stat badges, and smooth scroll CTAs
3. **About Section** - Professional bio, contact info, stat cards, and resume download
4. **Experience Section** - Timeline layout with company roles, dates, descriptions, and tech tags
5. **Skills Section** - Three categories with animated progress bars for proficiency levels
6. **Projects Section** - Filterable project grid with category buttons, live demo & GitHub links
7. **Blog Section** - Search functionality, category filtering, featured post layout
8. **Blog Post Pages** - Full SSG implementation with `generateStaticParams` & `generateMetadata`
9. **Testimonials Section** - Auto-playing carousel with prev/next controls
10. **Contact Section** - Form validation with react-hook-form, API integration
11. **Footer** - Multi-column layout with links, social icons, and back-to-top button

### 🛠️ Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Full type safety, strict mode enabled
- **Tailwind CSS v3** - Utility-first styling with dark mode (class strategy)
- **Framer Motion** - Smooth scroll animations and transitions
- **React Hook Form** - Form validation and state management
- **Lucide React** - Beautiful SVG icons
- **@tailwindcss/typography** - Markdown content styling
- **next-themes** - Dark mode persistence with localStorage

### 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with dark mode setup
│   ├── page.tsx                   # Home page (all sections)
│   ├── globals.css                # Global Tailwind styles
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx           # Individual blog post (SSG)
│   └── api/
│       └── contact/
│           └── route.ts           # Contact form API endpoint
├── components/
│   └── portfolio/
│       ├── Navbar.tsx             # Navigation component
│       ├── HeroSection.tsx        # Hero with typewriter
│       ├── AboutSection.tsx       # About & stats
│       ├── ExperienceSection.tsx  # Timeline layout
│       ├── SkillsSection.tsx      # Progress bars
│       ├── ProjectsSection.tsx    # Filterable grid
│       ├── BlogSection.tsx        # Search & filtering
│       ├── TestimonialsSection.tsx # Auto-playing carousel
│       ├── ContactSection.tsx     # Form with validation
│       └── Footer.tsx             # Multi-column footer
├── data/
│   └── portfolioData.ts           # All static content (1000+ lines)
└── utils/
    └── markdownParser.tsx         # Custom markdown-to-JSX renderer
```

### 📊 Data Layer (`src/data/portfolioData.ts`)

Comprehensive static content:

- **Profile**: Name, title, bio, location, email, social links, 6+ years experience
- **Work Experiences**: 4 detailed roles with descriptions and tech stacks
- **Skills**: 15 skills across 3 categories (Frontend, Backend, Tools) with proficiency levels
- **Projects**: 9 featured projects with descriptions, categories, and live/GitHub links
- **Testimonials**: 4 authentic testimonials from colleagues
- **Blog Posts**: 8 full markdown articles with code blocks, tables, and lists

### 🎨 Design Highlights

- **Responsive Design**: Mobile-first approach, tested on all breakpoints
- **Dark Mode**: Persisted theme toggle with system preference detection
- **Smooth Animations**: Entrance animations respect `prefers-reduced-motion`
- **Accessibility**: Semantic HTML, ARIA labels, proper heading hierarchy
- **Performance**: Image optimization with next/image, lazy loading for offscreen content
- **SEO**: Metadata generation, Open Graph tags, blog post structured data

## 🚀 Getting Started

### View the Live Portfolio

The dev server is running on **http://localhost:3000**

```bash
# The dev server is already running!
# Open http://localhost:3000 in your browser
```

### Stop and Restart the Server

```bash
# Press Ctrl+C in the terminal to stop
# Then restart with:
npm run dev
```

### Build for Production

```bash
npm run build
# Output: dist/ folder ready to deploy
```

## 📝 Customization Guide

### 1. Update Your Portfolio Content

Edit `src/data/portfolioData.ts`:

```typescript
const profile: Profile = {
  name: "Your Name",                          // Change your name
  title: "Your Title",                         // Your professional title
  bio: "Your bio...",                          // Your bio
  location: "Your Location",                   // Your location
  email: "your-email@example.com",             // Your email
  yearsOfExperience: 6,                        // Years of experience
  projectsCompleted: 45,                       // Number of projects
  companiesWorked: 4,                          // Companies worked at
  technologiesLearned: 30,                     // Technologies count
  socialLinks: [
    { label: "GitHub", url: "your-github-url", icon: "Github" },
    { label: "LinkedIn", url: "your-linkedin-url", icon: "Linkedin" },
    { label: "Twitter", url: "your-twitter-url", icon: "Twitter" },
  ],
};

// Update workExperiences, skills, projects, testimonials, blogPosts arrays
```

### 2. Update Images

Replace placeholder images with your own:

```typescript
// In portfolioData.ts, update image URLs
profileImage: "https://your-domain.com/your-photo.jpg"
// Or use local images:
profileImage: "/images/portrait.jpg"  // Place in public/images/
```

For local images, ensure they're in the `public/` folder and import them:

```typescript
import profileImg from "@/public/images/portrait.jpg";
// Then use: profileImage: profileImg.src
```

### 3. Customize Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    50: "#f0f9ff",
    600: "#0284c7",
    // ... update to your brand colors
  },
}
```

### 4. Update Dark Mode Strategy

Edit `src/app/layout.tsx`:

```typescript
<ThemeProvider 
  attribute="class"           // Options: "class", "media", "data-[data-theme]"
  defaultTheme="system"       // Options: "light", "dark", "system"
  enableSystem={true}
>
```

### 5. Add Blog Posts

Edit `src/data/portfolioData.ts` and add to `blogPosts` array:

```typescript
{
  id: '9',
  slug: 'your-post-slug',
  title: 'Your Post Title',
  excerpt: 'Short description...',
  category: 'React',
  tags: ['tag1', 'tag2'],
  publishedAt: '2024-04-15',
  readTime: 10,
  coverImage: 'https://picsum.photos/seed/blog9/800/600',
  content: `# Your Post Title\n\nYour markdown content here...`,
}
```

### 6. Setup Contact Form Email

The contact form API is at `src/app/api/contact/route.ts`.

**Option A: Using Resend (Recommended)**

```bash
npm install resend
```

Update `src/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: process.env.CONTACT_EMAIL,
  replyTo: email,
  subject: `Portfolio Contact: ${subject}`,
  html: `<p>From: ${name}</p><p>${message}</p>`,
});
```

Add to `.env.local`:

```
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your-email@example.com
```

**Option B: Using SendGrid**

```bash
npm install @sendgrid/mail
```

**Option C: Using Mailgun**

```bash
npm install mailgun.js form-data
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your GitHub repo and deploy.

### Deploy to Netlify

```bash
npm run build
# Deploy the .next folder or use:
netlify deploy --prod
```

### Deploy to GitHub Pages

For static export, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

Then:

```bash
npm run build
# Deploy contents of 'out' folder to GitHub Pages
```

## 📱 Mobile Responsiveness

All sections are fully responsive:

- **Mobile (< 640px)**: Single column, touch-optimized buttons, collapsible navbar
- **Tablet (640px - 1024px)**: Two-column layouts where appropriate
- **Desktop (> 1024px)**: Full three-column grids, hover effects

## ♿ Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast meets WCAG AA standards
- ✅ Respects `prefers-reduced-motion` media query
- ✅ Proper heading hierarchy
- ✅ Form labels and error messages
- ✅ Image alt text

## 🔍 SEO Optimization

- ✅ Dynamic meta tags for all pages
- ✅ Open Graph and Twitter card metadata
- ✅ Structured data markup
- ✅ Sitemap support (can be added)
- ✅ RSS feed support (can be added)
- ✅ Canonical URLs

## 🐛 Troubleshooting

### Dev server won't start

```bash
# Clear Next.js cache
rm -r .next
npm run dev
```

### Port 3000 is in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Images not loading

- Ensure `picsum.photos` is in `next.config.ts` remotePatterns
- For local images, place files in `public/` folder
- Check image paths and alt text

### Styles not applying

```bash
# Rebuild Tailwind
npm run dev

# Or clear Tailwind cache
rm -rf .next
npm run dev
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This portfolio template is free to use and modify for your personal portfolio.

## ✉️ Support

For issues or questions:

1. Check this README and the code comments
2. Verify your changes in `portfolioData.ts`
3. Test in `http://localhost:3000`
4. Check browser console for errors

---

**Happy building! Your portfolio is ready to showcase your amazing work.** 🚀
