import type {
  Profile,
  WorkExperience,
  Skill,
  Project,
  Testimonial,
  BlogPost,
} from '../src/data/portfolioData';

const profile: Profile = {
  name: 'Thong Xuan Anh Trinh',
  title: 'Full Stack Developer',
  heroRoles: [
    'Full Stack Developer',
    'Creative Technologist',
    'Open Source Contributor',
  ],
  bio: 'Passionate about building beautiful, performant web applications that solve real-world problems. With 6+ years of experience in full-stack development, I specialize in creating seamless digital experiences using cutting-edge technologies.',
  location: 'Ban Tang Village, Tien Phong Commune, Que Phong District, Nghe An Province, Vietnam',
  email: 'starlight196826@gmail.com',
  yearsOfExperience: 6,
  projectsCompleted: 45,
  companiesWorked: 4,
  technologiesLearned: 30,
  resumeUrl: '/resume.pdf',
  profileImage: 'https://picsum.photos/seed/portrait/400/400',
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
    { label: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' },
  ],
};

const workExperiences: WorkExperience[] = [
  {
    id: '1',
    company: 'TechCore Solutions',
    role: 'Senior Full Stack Developer',
    startDate: 'Jan 2023',
    endDate: null,
    current: true,
    description: 'Leading a team of developers in building scalable SaaS products. Architected microservices infrastructure supporting 100K+ daily active users. Implemented CI/CD pipelines reducing deployment time by 60%.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    id: '2',
    company: 'Digital Innovations Inc',
    role: 'Full Stack Developer',
    startDate: 'Jun 2021',
    endDate: 'Dec 2022',
    description: 'Developed and maintained 15+ web applications serving enterprise clients. Optimized database queries improving app performance by 45%. Mentored 3 junior developers on modern web development best practices.',
    technologies: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Redis', 'Kubernetes'],
  },
  {
    id: '3',
    company: 'Creative Studio Agency',
    role: 'Frontend Developer',
    startDate: 'Mar 2020',
    endDate: 'May 2021',
    description: 'Built responsive, accessible web interfaces for diverse clients. Implemented complex animations and interactive features using modern CSS and JavaScript. Maintained 98% uptime across all production sites.',
    technologies: ['React', 'Vue.js', 'Tailwind CSS', 'GSAP', 'Figma'],
  },
  {
    id: '4',
    company: 'StartUp Ventures',
    role: 'Junior Web Developer',
    startDate: 'Jul 2018',
    endDate: 'Feb 2020',
    description: 'Developed full-stack features for early-stage fintech application. Implemented real-time notifications using WebSockets. Collaborated with product and design teams to deliver features on schedule.',
    technologies: ['JavaScript', 'Express.js', 'React', 'Firebase', 'WebSockets'],
  },
];

const skills: Skill[] = [
  // Frontend
  { id: '1', name: 'React', category: 'Frontend', proficiency: 96 },
  { id: '2', name: 'TypeScript', category: 'Frontend', proficiency: 94 },
  { id: '3', name: 'Next.js', category: 'Frontend', proficiency: 92 },
  { id: '4', name: 'Tailwind CSS', category: 'Frontend', proficiency: 95 },
  { id: '5', name: 'Vue.js', category: 'Frontend', proficiency: 85 },
  // Backend
  { id: '6', name: 'Node.js', category: 'Backend', proficiency: 93 },
  { id: '7', name: 'PostgreSQL', category: 'Backend', proficiency: 88 },
  { id: '8', name: 'MongoDB', category: 'Backend', proficiency: 86 },
  { id: '9', name: 'GraphQL', category: 'Backend', proficiency: 85 },
  { id: '10', name: 'Express.js', category: 'Backend', proficiency: 90 },
  // Tools & DevOps
  { id: '11', name: 'Git', category: 'Tools', proficiency: 95 },
  { id: '12', name: 'Docker', category: 'Tools', proficiency: 82 },
  { id: '13', name: 'AWS', category: 'Tools', proficiency: 80 },
  { id: '14', name: 'CI/CD', category: 'Tools', proficiency: 85 },
  { id: '15', name: 'Figma', category: 'Tools', proficiency: 78 },
];

const projects: Project[] = [
  {
    id: '1',
    title: 'TaskFlow Pro',
    excerpt: 'Advanced project management platform with real-time collaboration',
    description: 'A comprehensive project management tool enabling teams to collaborate seamlessly. Features include real-time task updates, team messaging, time tracking, and advanced reporting.',
    category: 'Project Management',
    tags: ['React', 'Node.js', 'MongoDB', 'WebSockets', 'TypeScript'],
    liveUrl: 'https://taskflowpro.dev',
    githubUrl: 'https://github.com/alexjohnson/taskflow-pro',
    image: 'https://picsum.photos/seed/project1/800/600',
    featured: true,
  },
  {
    id: '2',
    title: 'DesignSystem UI',
    excerpt: 'Comprehensive component library with 200+ pre-built components',
    description: 'An extensible design system and component library for building scalable web applications. Includes documentation, Storybook integration, and accessibility features out of the box.',
    category: 'Design System',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    liveUrl: 'https://designsystem-ui.dev',
    githubUrl: 'https://github.com/alexjohnson/designsystem-ui',
    image: 'https://picsum.photos/seed/project2/800/600',
    featured: true,
  },
  {
    id: '3',
    title: 'EcoTracker',
    excerpt: 'Environmental impact tracking mobile and web application',
    description: 'An app that helps users track their environmental impact through daily activities. Features carbon footprint calculation, achievements, and community challenges.',
    category: 'Sustainability',
    tags: ['React Native', 'Firebase', 'Google Maps API'],
    liveUrl: 'https://ecotracker.app',
    githubUrl: 'https://github.com/alexjohnson/ecotracker',
    image: 'https://picsum.photos/seed/project3/800/600',
  },
  {
    id: '4',
    title: 'DataViz Dashboard',
    excerpt: 'Real-time analytics dashboard for enterprise data visualization',
    description: 'A powerful analytics platform with customizable dashboards, real-time data streaming, and advanced visualization options. Supports multiple data sources and export capabilities.',
    category: 'Analytics',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket'],
    liveUrl: 'https://dataviz-dashboard.dev',
    githubUrl: 'https://github.com/alexjohnson/dataviz-dashboard',
    image: 'https://picsum.photos/seed/project4/800/600',
  },
  {
    id: '5',
    title: 'SecureAuth Platform',
    excerpt: 'OAuth and security authentication system with 2FA support',
    description: 'Enterprise-grade authentication platform with OAuth 2.0, OpenID Connect, multi-factor authentication, and comprehensive security features.',
    category: 'Security',
    tags: ['Node.js', 'PostgreSQL', 'JWT', 'OAuth 2.0'],
    liveUrl: 'https://secureauth-platform.dev',
    githubUrl: 'https://github.com/alexjohnson/secureauth-platform',
    image: 'https://picsum.photos/seed/project5/800/600',
  },
  {
    id: '6',
    title: 'E-Commerce Hub',
    excerpt: 'Full-featured e-commerce platform with payment integration',
    description: 'Complete e-commerce solution with product catalog, shopping cart, payment processing via Stripe, inventory management, and order tracking.',
    category: 'E-Commerce',
    tags: ['Next.js', 'Stripe API', 'PostgreSQL', 'Tailwind CSS'],
    liveUrl: 'https://ecommerce-hub.dev',
    githubUrl: 'https://github.com/alexjohnson/ecommerce-hub',
    image: 'https://picsum.photos/seed/project6/800/600',
  },
  {
    id: '7',
    title: 'AI Content Generator',
    excerpt: 'AI-powered content creation tool using GPT and custom models',
    description: 'Leverages OpenAI API to generate high-quality content. Features include templates, batch processing, and quality scoring to help creators save time.',
    category: 'AI & ML',
    tags: ['Next.js', 'OpenAI API', 'React Query', 'PostgreSQL'],
    liveUrl: 'https://ai-content-generator.dev',
    githubUrl: 'https://github.com/alexjohnson/ai-content-generator',
    image: 'https://picsum.photos/seed/project7/800/600',
  },
  {
    id: '8',
    title: 'Video Conference Suite',
    excerpt: 'WebRTC-based video conferencing with screen sharing and chat',
    description: 'Real-time video communication platform built on WebRTC. Features include group calls, screen sharing, recording, and persistent chat history.',
    category: 'Communication',
    tags: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Redis'],
    liveUrl: 'https://videoconf-suite.dev',
    githubUrl: 'https://github.com/alexjohnson/videoconf-suite',
    image: 'https://picsum.photos/seed/project8/800/600',
  },
  {
    id: '9',
    title: 'Learning Management System',
    excerpt: 'Complete LMS platform with courses, quizzes, and certificates',
    description: 'Educational platform for creating and taking online courses. Includes multimedia support, progress tracking, quizzes, and certificate generation.',
    category: 'Education',
    tags: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'ffmpeg'],
    liveUrl: 'https://learning-management-system.dev',
    githubUrl: 'https://github.com/alexjohnson/lms-platform',
    image: 'https://picsum.photos/seed/project9/800/600',
  },
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Product Manager',
    company: 'Tech Innovations Co',
    quote: 'Alex is an exceptional developer who consistently delivers high-quality code. His ability to translate complex requirements into elegant solutions is remarkable. A true asset to any team.',
    avatar: 'https://picsum.photos/seed/avatar1/200/200',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CTO',
    company: 'Digital Ventures Inc',
    quote: 'Working with Alex has been transformative for our engineering team. His expertise in full-stack development and mentorship skills have elevated our entire organization. Highly recommended!',
    avatar: 'https://picsum.photos/seed/avatar2/200/200',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Lead Designer',
    company: 'Creative Studios',
    quote: 'Alex brings together technical excellence and creative thinking. His implementation of complex animations and interactive features has impressed our clients repeatedly. Great to collaborate with!',
    avatar: 'https://picsum.photos/seed/avatar3/200/200',
  },
  {
    id: '4',
    name: 'David Kumar',
    role: 'Startup Founder',
    company: 'Founders Lab',
    quote: 'Alex built our MVP from scratch and it exceeded all expectations. His attention to detail, communication, and problem-solving skills make him invaluable. I would definitely hire again!',
    avatar: 'https://picsum.photos/seed/avatar4/200/200',
  },
];

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'mastering-react-hooks',
    title: 'Mastering React Hooks: From useState to useContext',
    excerpt: 'Deep dive into React Hooks and how to use them effectively in modern applications. Learn best practices and common pitfalls to avoid.',
    category: 'React',
    tags: ['React', 'Hooks', 'Tutorial'],
    publishedAt: '2024-01-15',
    readTime: 12,
    coverImage: 'https://picsum.photos/seed/blog1/800/600',
    content: `# Mastering React Hooks: From useState to useContext

React Hooks have revolutionized the way we write React components. Instead of using class components with complex lifecycle methods, we can now use functional components with hooks. This article explores the most important hooks and how to use them effectively.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the standard way of writing React components.

### useState Hook

The \`useState\` hook is the most basic hook. It allows you to add state to functional components:

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

The \`useState\` hook returns an array with two elements:
1. The current state value
2. A function to update that value

### useEffect Hook

\`useEffect\` allows you to perform side effects in functional components:

\`\`\`jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
  
  return <div>{data && JSON.stringify(data)}</div>;
}
\`\`\`

The dependency array controls when the effect runs:
- Empty array: runs once on mount
- Omitted: runs after every render
- With values: runs when values change

## Rules of Hooks

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from functional components or other hooks

## useContext Hook

\`useContext\` allows you to subscribe to context without wrapping your component in a consumer:

\`\`\`jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

function Button() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
\`\`\`

## Custom Hooks

One of the most powerful aspects of hooks is the ability to create custom hooks:

\`\`\`jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

// Usage
function ResponsiveComponent() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
\`\`\`

## Best Practices

| Practice | Benefit |
|----------|---------|
| Keep hooks simple | Easier to test and maintain |
| Use ESLint plugin | Catches common hook mistakes |
| Memoize callbacks | Prevents unnecessary re-renders |
| Separate concerns | Use multiple hooks for different logic |

## Conclusion

React Hooks provide a more intuitive and powerful way to write React components. By mastering these core hooks, you'll write cleaner, more maintainable code.`,
  },
  {
    id: '2',
    slug: 'typescript-advanced-types',
    title: 'TypeScript Advanced Types: Generics and Utility Types',
    excerpt: 'Explore advanced TypeScript features like generics, mapped types, and conditional types for writing type-safe applications.',
    category: 'TypeScript',
    tags: ['TypeScript', 'Generics', 'Advanced'],
    publishedAt: '2024-01-22',
    readTime: 14,
    coverImage: 'https://picsum.photos/seed/blog2/800/600',
    content: `# TypeScript Advanced Types: Generics and Utility Types

TypeScript's type system is one of its most powerful features. This article explores advanced type features that will help you write more robust and reusable code.

## Generics

Generics allow you to write code that can work with any type, while still maintaining type safety:

\`\`\`typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");

// Generic interface
interface Repository<T> {
  getAll(): T[];
  getById(id: string): T | null;
  create(item: T): void;
  update(id: string, item: T): void;
  delete(id: string): void;
}

// Generic class
class UserRepository implements Repository<User> {
  getAll(): User[] {
    // implementation
    return [];
  }
  
  getById(id: string): User | null {
    // implementation
    return null;
  }
  
  create(item: User): void {
    // implementation
  }
  
  update(id: string, item: User): void {
    // implementation
  }
  
  delete(id: string): void {
    // implementation
  }
}
\`\`\`

## Keyof Operator

The \`keyof\` operator extracts the keys of a type:

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age: number;
}

type UserKeys = keyof User; // "name" | "email" | "age"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  name: "John",
  email: "john@example.com",
  age: 30
};

const name = getProperty(user, "name"); // Type: string
// getProperty(user, "invalid"); // Error!
\`\`\`

## Mapped Types

Mapped types allow you to create new types by transforming existing ones:

\`\`\`typescript
// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Extract only getter properties
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// Result: { getName: () => string; getAge: () => number }
\`\`\`

## Conditional Types

Conditional types allow you to select a type based on a condition:

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false

// More practical example
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
\`\`\`

## Utility Types

TypeScript provides built-in utility types:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">; // { id: number; name: string }

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, "email">; // { id: number; name: string; createdAt: Date }

// Record - create object type with specific keys
type Colors = "red" | "green" | "blue";
type ColorHex = Record<Colors, string>; // { red: string; green: string; blue: string }

// Partial - make all properties optional
type PartialUser = Partial<User>;

// Required - make all properties required
type RequiredUser = Required<User>;

// Readonly - make all properties readonly
type ReadonlyUser = Readonly<User>;

// Extract and Exclude
type StringOrNumber = string | number | boolean;
type OnlyString = Extract<StringOrNumber, string>; // string
type NoString = Exclude<StringOrNumber, string>; // number | boolean
\`\`\`

## Conclusion

These advanced type features make TypeScript incredibly powerful for large applications. They help catch errors at compile time and provide excellent developer experience through IDE support.`,
  },
  {
    id: '3',
    slug: 'web-performance-optimization',
    title: 'Web Performance Optimization: Techniques and Best Practices',
    excerpt: 'Learn essential techniques to optimize web application performance including bundling, caching, and lazy loading.',
    category: 'Performance',
    tags: ['Performance', 'Optimization', 'Best Practices'],
    publishedAt: '2024-02-01',
    readTime: 16,
    coverImage: 'https://picsum.photos/seed/blog3/800/600',
    content: `# Web Performance Optimization: Techniques and Best Practices

Performance is crucial for user experience. This guide covers essential techniques for optimizing web applications.

## Measuring Performance

Use these tools to measure performance:

\`\`\`javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
\`\`\`

## Code Splitting

Reduce initial bundle size with code splitting:

\`\`\`jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

## Image Optimization

Images often represent the largest part of page size:

\`\`\`jsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      priority
      quality={80}
    />
  );
}
\`\`\`

## Caching Strategies

| Strategy | Use Case |
|----------|----------|
| Browser Cache | Static assets, long-lived content |
| CDN Cache | Global content distribution |
| Server Cache | API responses, database queries |
| HTTP Caching | Cache control headers |

## Conclusion

Performance optimization is an ongoing process. Monitor your metrics and continuously improve.`,
  },
  {
    id: '4',
    slug: 'modern-css-techniques',
    title: 'Modern CSS Techniques: Grid, Flexbox, and Custom Properties',
    excerpt: 'Master modern CSS features for building responsive and maintainable layouts without frameworks.',
    category: 'CSS',
    tags: ['CSS', 'Flexbox', 'Grid', 'Responsive'],
    publishedAt: '2024-02-10',
    readTime: 13,
    coverImage: 'https://picsum.photos/seed/blog4/800/600',
    content: `# Modern CSS Techniques: Grid, Flexbox, and Custom Properties

Modern CSS provides powerful tools for creating responsive layouts.

## CSS Grid

CSS Grid is perfect for complex layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.grid-item:nth-child(1) {
  grid-column: span 2;
}
\`\`\`

## CSS Custom Properties

Use CSS variables for maintainable styling:

\`\`\`css
:root {
  --primary: #3b82f6;
  --secondary: #ef4444;
  --spacing-unit: 8px;
}

.button {
  background-color: var(--primary);
  padding: calc(var(--spacing-unit) * 2);
}

.button:hover {
  background-color: var(--secondary);
}
\`\`\`

## Conclusion

These modern CSS features help build better applications.`,
  },
  {
    id: '5',
    slug: 'node-express-best-practices',
    title: 'Building Robust APIs with Node.js and Express',
    excerpt: 'Essential patterns and practices for building production-ready APIs with proper error handling and authentication.',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    publishedAt: '2024-02-18',
    readTime: 15,
    coverImage: 'https://picsum.photos/seed/blog5/800/600',
    content: `# Building Robust APIs with Node.js and Express

Building scalable APIs requires careful architecture and best practices.

## Error Handling

Implement centralized error handling:

\`\`\`javascript
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    }
  });
});

// Custom error class
class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
\`\`\`

## Authentication

Secure your API with JWT:

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
}

// Verify middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Conclusion

These practices help build secure and maintainable APIs.`,
  },
  {
    id: '6',
    slug: 'career-transition-to-tech',
    title: 'Career Transition to Tech: A Practical Guide',
    excerpt: 'Real strategies for transitioning into tech from non-technical backgrounds. Learn what employers really look for.',
    category: 'Career',
    tags: ['Career', 'Learning', 'Advice'],
    publishedAt: '2024-02-25',
    readTime: 11,
    coverImage: 'https://picsum.photos/seed/blog6/800/600',
    content: `# Career Transition to Tech: A Practical Guide

Transitioning to tech is achievable with the right approach and mindset.

## Learning Path

1. Start with fundamentals
2. Build projects
3. Contribute to open source
4. Network with others
5. Apply for jobs

## Building Your Portfolio

Your portfolio is crucial:

- Build 3-5 solid projects
- Write about your learning
- Show your problem-solving process
- Deploy projects online
- Keep code clean and documented

## Networking

- Attend meetups
- Join communities
- Contribute to open source
- Build relationships
- Attend conferences

## Conclusion

Career transition is possible with persistence and dedication.`,
  },
  {
    id: '7',
    slug: 'ai-ml-for-web-developers',
    title: 'AI and Machine Learning for Web Developers',
    excerpt: 'Introduction to integrating AI capabilities into web applications using APIs and frameworks.',
    category: 'AI',
    tags: ['AI', 'Machine Learning', 'Web Development'],
    publishedAt: '2024-03-05',
    readTime: 14,
    coverImage: 'https://picsum.photos/seed/blog7/800/600',
    content: `# AI and Machine Learning for Web Developers

Integrating AI into web applications is more accessible than ever.

## OpenAI API

Using ChatGPT in your application:

\`\`\`javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateContent(prompt) {
  const message = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: prompt }
    ]
  });
  
  return message.choices[0].message.content;
}
\`\`\`

## Machine Learning in Browser

Use TensorFlow.js for in-browser ML:

\`\`\`javascript
import * as tf from '@tensorflow/tfjs';

// Load a pre-trained model
const model = await tf.loadLayersModel(
  'https://tfhub.dev/...'
);

// Make predictions
const input = tf.tensor2d([[1, 2, 3]]);
const prediction = model.predict(input);
\`\`\`

## Conclusion

AI opens new possibilities for web applications.`,
  },
  {
    id: '8',
    slug: 'state-management-redux-zustand',
    title: 'State Management: Redux vs Zustand vs Context API',
    excerpt: 'Compare different state management solutions and choose the right one for your project.',
    category: 'React',
    tags: ['React', 'State Management', 'Redux', 'Zustand'],
    publishedAt: '2024-03-15',
    readTime: 13,
    coverImage: 'https://picsum.photos/seed/blog8/800/600',
    content: `# State Management: Redux vs Zustand vs Context API

Choosing the right state management solution affects your application's architecture.

## Context API

Simplest built-in solution:

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
\`\`\`

## Zustand

Lightweight and simple:

\`\`\`javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set(state => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  }))
}));
\`\`\`

## Redux

Enterprise-grade solution:

\`\`\`javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  }
});

const store = configureStore({
  reducer: { theme: themeSlice.reducer }
});
\`\`\`

## Comparison

| Feature | Context API | Zustand | Redux |
|---------|------------|---------|-------|
| Bundle Size | Small | Very Small | Medium |
| Learning Curve | Easy | Easy | Steep |
| Scalability | Limited | Good | Excellent |
| DevTools | No | Yes | Yes |

## Conclusion

Choose based on your project complexity and team experience.`,
  },
];

export const seedPortfolioData = {
  profile,
  workExperiences,
  skills,
  projects,
  testimonials,
  blogPosts,
};
