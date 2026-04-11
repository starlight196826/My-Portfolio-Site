# 🚀 Quick Start Guide

Your Next.js portfolio is ready! Here's what to do next:

## ✅ What's Already Done

- ✅ Complete Next.js 14 app with App Router
- ✅ All 11 portfolio sections built and styled
- ✅ Blog system with SSG and markdown support
- ✅ Contact form with validation
- ✅ Dark mode with persistence
- ✅ Fully responsive design
- ✅ TypeScript strict mode
- ✅ Production-ready code

## 🎯 Next Steps (5 Minutes)

### 1. Customize Your Profile

Open `src/data/portfolioData.ts` and update:

```typescript
const profile: Profile = {
  name: "YOUR NAME",                    // Line 90
  title: "YOUR TITLE",                  // Line 91
  bio: "YOUR BIO",                      // Line 92
  location: "YOUR LOCATION",            // Line 93
  email: "your-email@example.com",      // Line 94
  // ... update the rest
};
```

### 2. Update Your Work Experience

Replace the 4 work experiences in the file (lines 113-180):

```typescript
const workExperiences: WorkExperience[] = [
  {
    id: '1',
    company: "Your Company",
    role: "Your Role",
    startDate: "Jan 2023",
    endDate: null,
    current: true,
    description: "Your description...",
    technologies: ["Tech1", "Tech2", "Tech3"],
  },
  // ... add more
];
```

### 3. Update Your Projects

Edit the `projects` array (lines 183-252):

```typescript
const projects: Project[] = [
  {
    id: '1',
    title: "Your Project",
    excerpt: "Short description",
    description: "Full description",
    category: "Your Category",
    tags: ["React", "TypeScript"],
    liveUrl: "https://yourproject.com",
    githubUrl: "https://github.com/yourrepo",
    image: "https://picsum.photos/seed/project1/800/600",
    featured: true,
  },
  // ... add more
];
```

### 4. Add Your Skills

Update the `skills` array (lines 175-190):

### 5. Add Testimonials

Update the `testimonials` array with real testimonials from colleagues

### 6. View Changes

Save the file and refresh **http://localhost:3000** in your browser!

---

## 🔧 Common Customizations

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    600: "#YOUR_COLOR", // Change primary blue
  },
}
```

### Add New Blog Post

Add to `blogPosts` array in `portfolioData.ts`:

```typescript
{
  id: '9',
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Summary...',
  category: 'React',
  tags: ['react', 'tutorial'],
  publishedAt: '2024-04-20',
  readTime: 8,
  coverImage: 'https://picsum.photos/seed/blog9/800/600',
  content: `# My Post\n\nMarkdown content here...`,
}
```

Visit: `http://localhost:3000/blog/my-new-post`

### Setup Email (Contact Form)

1. Sign up for [Resend.dev](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=your_key_here
   CONTACT_EMAIL=your-email@example.com
   ```
4. Uncomment the Resend code in `src/app/api/contact/route.ts`

---

## 📱 Testing Checklist

- [ ] Dark mode toggle works (top right)
- [ ] Navigation scrolls to sections
- [ ] Mobile menu opens on small screens
- [ ] Projects filter buttons work
- [ ] Blog search filters results
- [ ] Click a blog post to view full article
- [ ] Contact form validates (try submitting empty)
- [ ] Testimonial carousel auto-plays
- [ ] Images load from picsum.photos
- [ ] All links work (GitHub, LinkedIn, etc.)

---

## 🚀 Build & Deploy

### Test Production Build

```bash
npm run build
# Check for any TypeScript errors
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

---

## 📝 Important Files

- **`src/data/portfolioData.ts`** - All your content lives here
- **`src/app/page.tsx`** - Main homepage
- **`src/app/layout.tsx`** - Root layout (dark mode setup)
- **`tailwind.config.ts`** - Theme colors and animations
- **`src/app/globals.css`** - Global styles
- **`src/components/portfolio/*.tsx`** - All section components

---

## 💡 Pro Tips

1. **Use relative URLs for images**: Place images in `public/` folder and reference as `/images/my-image.jpg`
2. **Add localStorage dark mode**: Already implemented! Just works.
3. **SEO ready**: All meta tags are auto-generated
4. **Blog SSG**: All blog posts are pre-rendered at build time
5. **Type-safe**: Everything is TypeScript - you'll catch errors early

---

## ❓ Help

- Check `PORTFOLIO_GUIDE.md` for detailed documentation
- Review component code in `src/components/portfolio/`
- Look at example data in `src/data/portfolioData.ts`
- Check Next.js docs: https://nextjs.org/docs

---

**Your portfolio is live and ready! Happy customizing!** 🎉
