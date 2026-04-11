-- =============================================================================
-- Portfolio sample data — structured like manual registration
-- Source: scripts/seed-defaults.ts  |  Regenerate: npm run db:export-sql
--
-- BEFORE this file: run ALL migrations in supabase/migrations/ in order,
-- especially 20250411130000_portfolio_anon_access.sql (anon can read/write).
-- Without it, the app sees 0 rows even after a successful insert.
-- =============================================================================

-- Optional: ensure hero_roles exists on profile
alter table public.profile add column if not exists hero_roles jsonb default '[]'::jsonb;

-- Reset existing rows so this script can be re-run cleanly
-- (remove these deletes if you only want to append new rows)
delete from public.testimonials;
delete from public.skills;
delete from public.articles;
delete from public.projects;
delete from public.work_experience;
delete from public.profile where id = 1;


-- -----------------------------------------------------------------------------
-- PROFILE — site owner (id = 1, as in Admin → Profile)
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------
insert into public.profile (
  id, full_name, bio, email, location, years_of_experience, projects_completed, companies_worked, technologies_learned,
  title, hero_roles, profile_image_url, resume_url, social_links
) values (
  1,
  $v$Thong Xuan Anh Trinh$v$,
  $v$Passionate about building beautiful, performant web applications that solve real-world problems. With 6+ years of experience in full-stack development, I specialize in creating seamless digital experiences using cutting-edge technologies.$v$,
  $v$starlight196826@gmail.com$v$,
  $v$Ban Tang Village, Tien Phong Commune, Que Phong District, Nghe An Province, Vietnam$v$,
  6,
  45,
  4,
  30,
  $v$Full Stack Developer$v$,
  $v$["Full Stack Developer","Creative Technologist","Open Source Contributor"]$v$::jsonb,
  $v$https://picsum.photos/seed/portrait/400/400$v$,
  $v$/resume.pdf$v$,
  $v$[{"label":"GitHub","url":"https://github.com","icon":"Github"},{"label":"LinkedIn","url":"https://linkedin.com","icon":"Linkedin"},{"label":"Twitter","url":"https://twitter.com","icon":"Twitter"}]$v$::jsonb
);

-- -----------------------------------------------------------------------------
-- WORK EXPERIENCE — one row per job (as if added in Admin)
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------

-- Job id 1: TechCore Solutions — Senior Full Stack Developer
insert into public.work_experience (
  id, company, role, start_date, end_date, description, is_current, technologies
) values (
  $v$1$v$,
  $v$TechCore Solutions$v$,
  $v$Senior Full Stack Developer$v$,
  $v$Jan 2023$v$,
  null,
  $v$Leading a team of developers in building scalable SaaS products. Architected microservices infrastructure supporting 100K+ daily active users. Implemented CI/CD pipelines reducing deployment time by 60%.$v$,
  true,
  ARRAY[$v$TypeScript$v$, $v$React$v$, $v$Node.js$v$, $v$PostgreSQL$v$, $v$AWS$v$, $v$Docker$v$]
);

-- Job id 2: Digital Innovations Inc — Full Stack Developer
insert into public.work_experience (
  id, company, role, start_date, end_date, description, is_current, technologies
) values (
  $v$2$v$,
  $v$Digital Innovations Inc$v$,
  $v$Full Stack Developer$v$,
  $v$Jun 2021$v$,
  $v$Dec 2022$v$,
  $v$Developed and maintained 15+ web applications serving enterprise clients. Optimized database queries improving app performance by 45%. Mentored 3 junior developers on modern web development best practices.$v$,
  false,
  ARRAY[$v$React$v$, $v$Node.js$v$, $v$MongoDB$v$, $v$GraphQL$v$, $v$Redis$v$, $v$Kubernetes$v$]
);

-- Job id 3: Creative Studio Agency — Frontend Developer
insert into public.work_experience (
  id, company, role, start_date, end_date, description, is_current, technologies
) values (
  $v$3$v$,
  $v$Creative Studio Agency$v$,
  $v$Frontend Developer$v$,
  $v$Mar 2020$v$,
  $v$May 2021$v$,
  $v$Built responsive, accessible web interfaces for diverse clients. Implemented complex animations and interactive features using modern CSS and JavaScript. Maintained 98% uptime across all production sites.$v$,
  false,
  ARRAY[$v$React$v$, $v$Vue.js$v$, $v$Tailwind CSS$v$, $v$GSAP$v$, $v$Figma$v$]
);

-- Job id 4: StartUp Ventures — Junior Web Developer
insert into public.work_experience (
  id, company, role, start_date, end_date, description, is_current, technologies
) values (
  $v$4$v$,
  $v$StartUp Ventures$v$,
  $v$Junior Web Developer$v$,
  $v$Jul 2018$v$,
  $v$Feb 2020$v$,
  $v$Developed full-stack features for early-stage fintech application. Implemented real-time notifications using WebSockets. Collaborated with product and design teams to deliver features on schedule.$v$,
  false,
  ARRAY[$v$JavaScript$v$, $v$Express.js$v$, $v$React$v$, $v$Firebase$v$, $v$WebSockets$v$]
);

-- -----------------------------------------------------------------------------
-- PROJECTS — one row per project
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------

-- Project id 1: TaskFlow Pro
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$1$v$,
  $v$TaskFlow Pro$v$,
  $v$A comprehensive project management tool enabling teams to collaborate seamlessly. Features include real-time task updates, team messaging, time tracking, and advanced reporting.$v$,
  $v$Advanced project management platform with real-time collaboration$v$,
  $v$Project Management$v$,
  $v$https://taskflowpro.dev$v$,
  $v$https://github.com/alexjohnson/taskflow-pro$v$,
  $v$https://picsum.photos/seed/project1/800/600$v$,
  true,
  ARRAY[$v$React$v$, $v$Node.js$v$, $v$MongoDB$v$, $v$WebSockets$v$, $v$TypeScript$v$]
);

-- Project id 2: DesignSystem UI
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$2$v$,
  $v$DesignSystem UI$v$,
  $v$An extensible design system and component library for building scalable web applications. Includes documentation, Storybook integration, and accessibility features out of the box.$v$,
  $v$Comprehensive component library with 200+ pre-built components$v$,
  $v$Design System$v$,
  $v$https://designsystem-ui.dev$v$,
  $v$https://github.com/alexjohnson/designsystem-ui$v$,
  $v$https://picsum.photos/seed/project2/800/600$v$,
  true,
  ARRAY[$v$React$v$, $v$TypeScript$v$, $v$Tailwind CSS$v$, $v$Storybook$v$]
);

-- Project id 3: EcoTracker
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$3$v$,
  $v$EcoTracker$v$,
  $v$An app that helps users track their environmental impact through daily activities. Features carbon footprint calculation, achievements, and community challenges.$v$,
  $v$Environmental impact tracking mobile and web application$v$,
  $v$Sustainability$v$,
  $v$https://ecotracker.app$v$,
  $v$https://github.com/alexjohnson/ecotracker$v$,
  $v$https://picsum.photos/seed/project3/800/600$v$,
  false,
  ARRAY[$v$React Native$v$, $v$Firebase$v$, $v$Google Maps API$v$]
);

-- Project id 4: DataViz Dashboard
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$4$v$,
  $v$DataViz Dashboard$v$,
  $v$A powerful analytics platform with customizable dashboards, real-time data streaming, and advanced visualization options. Supports multiple data sources and export capabilities.$v$,
  $v$Real-time analytics dashboard for enterprise data visualization$v$,
  $v$Analytics$v$,
  $v$https://dataviz-dashboard.dev$v$,
  $v$https://github.com/alexjohnson/dataviz-dashboard$v$,
  $v$https://picsum.photos/seed/project4/800/600$v$,
  false,
  ARRAY[$v$React$v$, $v$D3.js$v$, $v$Node.js$v$, $v$PostgreSQL$v$, $v$WebSocket$v$]
);

-- Project id 5: SecureAuth Platform
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$5$v$,
  $v$SecureAuth Platform$v$,
  $v$Enterprise-grade authentication platform with OAuth 2.0, OpenID Connect, multi-factor authentication, and comprehensive security features.$v$,
  $v$OAuth and security authentication system with 2FA support$v$,
  $v$Security$v$,
  $v$https://secureauth-platform.dev$v$,
  $v$https://github.com/alexjohnson/secureauth-platform$v$,
  $v$https://picsum.photos/seed/project5/800/600$v$,
  false,
  ARRAY[$v$Node.js$v$, $v$PostgreSQL$v$, $v$JWT$v$, $v$OAuth 2.0$v$]
);

-- Project id 6: E-Commerce Hub
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$6$v$,
  $v$E-Commerce Hub$v$,
  $v$Complete e-commerce solution with product catalog, shopping cart, payment processing via Stripe, inventory management, and order tracking.$v$,
  $v$Full-featured e-commerce platform with payment integration$v$,
  $v$E-Commerce$v$,
  $v$https://ecommerce-hub.dev$v$,
  $v$https://github.com/alexjohnson/ecommerce-hub$v$,
  $v$https://picsum.photos/seed/project6/800/600$v$,
  false,
  ARRAY[$v$Next.js$v$, $v$Stripe API$v$, $v$PostgreSQL$v$, $v$Tailwind CSS$v$]
);

-- Project id 7: AI Content Generator
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$7$v$,
  $v$AI Content Generator$v$,
  $v$Leverages OpenAI API to generate high-quality content. Features include templates, batch processing, and quality scoring to help creators save time.$v$,
  $v$AI-powered content creation tool using GPT and custom models$v$,
  $v$AI & ML$v$,
  $v$https://ai-content-generator.dev$v$,
  $v$https://github.com/alexjohnson/ai-content-generator$v$,
  $v$https://picsum.photos/seed/project7/800/600$v$,
  false,
  ARRAY[$v$Next.js$v$, $v$OpenAI API$v$, $v$React Query$v$, $v$PostgreSQL$v$]
);

-- Project id 8: Video Conference Suite
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$8$v$,
  $v$Video Conference Suite$v$,
  $v$Real-time video communication platform built on WebRTC. Features include group calls, screen sharing, recording, and persistent chat history.$v$,
  $v$WebRTC-based video conferencing with screen sharing and chat$v$,
  $v$Communication$v$,
  $v$https://videoconf-suite.dev$v$,
  $v$https://github.com/alexjohnson/videoconf-suite$v$,
  $v$https://picsum.photos/seed/project8/800/600$v$,
  false,
  ARRAY[$v$React$v$, $v$WebRTC$v$, $v$Node.js$v$, $v$Socket.io$v$, $v$Redis$v$]
);

-- Project id 9: Learning Management System
insert into public.projects (
  id, title, description, excerpt, category, live_url, github_url, image_url, featured, tags
) values (
  $v$9$v$,
  $v$Learning Management System$v$,
  $v$Educational platform for creating and taking online courses. Includes multimedia support, progress tracking, quizzes, and certificate generation.$v$,
  $v$Complete LMS platform with courses, quizzes, and certificates$v$,
  $v$Education$v$,
  $v$https://learning-management-system.dev$v$,
  $v$https://github.com/alexjohnson/lms-platform$v$,
  $v$https://picsum.photos/seed/project9/800/600$v$,
  false,
  ARRAY[$v$React$v$, $v$Node.js$v$, $v$MongoDB$v$, $v$AWS S3$v$, $v$ffmpeg$v$]
);

-- -----------------------------------------------------------------------------
-- SKILLS — one row per skill
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------

-- Skill: React (Frontend)
insert into public.skills (id, name, category, proficiency) values (
  $v$1$v$, $v$React$v$, $v$Frontend$v$, 96
);

-- Skill: TypeScript (Frontend)
insert into public.skills (id, name, category, proficiency) values (
  $v$2$v$, $v$TypeScript$v$, $v$Frontend$v$, 94
);

-- Skill: Next.js (Frontend)
insert into public.skills (id, name, category, proficiency) values (
  $v$3$v$, $v$Next.js$v$, $v$Frontend$v$, 92
);

-- Skill: Tailwind CSS (Frontend)
insert into public.skills (id, name, category, proficiency) values (
  $v$4$v$, $v$Tailwind CSS$v$, $v$Frontend$v$, 95
);

-- Skill: Vue.js (Frontend)
insert into public.skills (id, name, category, proficiency) values (
  $v$5$v$, $v$Vue.js$v$, $v$Frontend$v$, 85
);

-- Skill: Node.js (Backend)
insert into public.skills (id, name, category, proficiency) values (
  $v$6$v$, $v$Node.js$v$, $v$Backend$v$, 93
);

-- Skill: PostgreSQL (Backend)
insert into public.skills (id, name, category, proficiency) values (
  $v$7$v$, $v$PostgreSQL$v$, $v$Backend$v$, 88
);

-- Skill: MongoDB (Backend)
insert into public.skills (id, name, category, proficiency) values (
  $v$8$v$, $v$MongoDB$v$, $v$Backend$v$, 86
);

-- Skill: GraphQL (Backend)
insert into public.skills (id, name, category, proficiency) values (
  $v$9$v$, $v$GraphQL$v$, $v$Backend$v$, 85
);

-- Skill: Express.js (Backend)
insert into public.skills (id, name, category, proficiency) values (
  $v$10$v$, $v$Express.js$v$, $v$Backend$v$, 90
);

-- Skill: Git (Tools)
insert into public.skills (id, name, category, proficiency) values (
  $v$11$v$, $v$Git$v$, $v$Tools$v$, 95
);

-- Skill: Docker (Tools)
insert into public.skills (id, name, category, proficiency) values (
  $v$12$v$, $v$Docker$v$, $v$Tools$v$, 82
);

-- Skill: AWS (Tools)
insert into public.skills (id, name, category, proficiency) values (
  $v$13$v$, $v$AWS$v$, $v$Tools$v$, 80
);

-- Skill: CI/CD (Tools)
insert into public.skills (id, name, category, proficiency) values (
  $v$14$v$, $v$CI/CD$v$, $v$Tools$v$, 85
);

-- Skill: Figma (Tools)
insert into public.skills (id, name, category, proficiency) values (
  $v$15$v$, $v$Figma$v$, $v$Tools$v$, 78
);

-- -----------------------------------------------------------------------------
-- TESTIMONIALS — one row per quote
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------

-- Testimonial from Sarah Mitchell (Tech Innovations Co)
insert into public.testimonials (
  id, name, role, company, quote, avatar
) values (
  $v$1$v$,
  $v$Sarah Mitchell$v$,
  $v$Product Manager$v$,
  $v$Tech Innovations Co$v$,
  $v$Alex is an exceptional developer who consistently delivers high-quality code. His ability to translate complex requirements into elegant solutions is remarkable. A true asset to any team.$v$,
  $v$https://picsum.photos/seed/avatar1/200/200$v$
);

-- Testimonial from Michael Chen (Digital Ventures Inc)
insert into public.testimonials (
  id, name, role, company, quote, avatar
) values (
  $v$2$v$,
  $v$Michael Chen$v$,
  $v$CTO$v$,
  $v$Digital Ventures Inc$v$,
  $v$Working with Alex has been transformative for our engineering team. His expertise in full-stack development and mentorship skills have elevated our entire organization. Highly recommended!$v$,
  $v$https://picsum.photos/seed/avatar2/200/200$v$
);

-- Testimonial from Emma Rodriguez (Creative Studios)
insert into public.testimonials (
  id, name, role, company, quote, avatar
) values (
  $v$3$v$,
  $v$Emma Rodriguez$v$,
  $v$Lead Designer$v$,
  $v$Creative Studios$v$,
  $v$Alex brings together technical excellence and creative thinking. His implementation of complex animations and interactive features has impressed our clients repeatedly. Great to collaborate with!$v$,
  $v$https://picsum.photos/seed/avatar3/200/200$v$
);

-- Testimonial from David Kumar (Founders Lab)
insert into public.testimonials (
  id, name, role, company, quote, avatar
) values (
  $v$4$v$,
  $v$David Kumar$v$,
  $v$Startup Founder$v$,
  $v$Founders Lab$v$,
  $v$Alex built our MVP from scratch and it exceeded all expectations. His attention to detail, communication, and problem-solving skills make him invaluable. I would definitely hire again!$v$,
  $v$https://picsum.photos/seed/avatar4/200/200$v$
);

-- -----------------------------------------------------------------------------
-- ARTICLES / BLOG — one row per post (content in dollar-quotes)
-- (same values as if entered one-by-one in the SQL Editor / Admin)
-- -----------------------------------------------------------------------------

-- Article: “Mastering React Hooks: From useState to useContext”  slug: mastering-react-hooks
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$1$v$,
  $v$mastering-react-hooks$v$,
  $v$Mastering React Hooks: From useState to useContext$v$,
  $v$Deep dive into React Hooks and how to use them effectively in modern applications. Learn best practices and common pitfalls to avoid.$v$,
  $v$React$v$,
  $c$# Mastering React Hooks: From useState to useContext

React Hooks have revolutionized the way we write React components. Instead of using class components with complex lifecycle methods, we can now use functional components with hooks. This article explores the most important hooks and how to use them effectively.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the standard way of writing React components.

### useState Hook

The `useState` hook is the most basic hook. It allows you to add state to functional components:

```jsx
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
```

The `useState` hook returns an array with two elements:
1. The current state value
2. A function to update that value

### useEffect Hook

`useEffect` allows you to perform side effects in functional components:

```jsx
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
```

The dependency array controls when the effect runs:
- Empty array: runs once on mount
- Omitted: runs after every render
- With values: runs when values change

## Rules of Hooks

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from functional components or other hooks

## useContext Hook

`useContext` allows you to subscribe to context without wrapping your component in a consumer:

```jsx
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
```

## Custom Hooks

One of the most powerful aspects of hooks is the ability to create custom hooks:

```jsx
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
```

## Best Practices

| Practice | Benefit |
|----------|---------|
| Keep hooks simple | Easier to test and maintain |
| Use ESLint plugin | Catches common hook mistakes |
| Memoize callbacks | Prevents unnecessary re-renders |
| Separate concerns | Use multiple hooks for different logic |

## Conclusion

React Hooks provide a more intuitive and powerful way to write React components. By mastering these core hooks, you'll write cleaner, more maintainable code.$c$,
  $v$2024-01-15$v$,
  12,
  $v$https://picsum.photos/seed/blog1/800/600$v$,
  ARRAY[$v$React$v$, $v$Hooks$v$, $v$Tutorial$v$]
);

-- Article: “TypeScript Advanced Types: Generics and Utility Types”  slug: typescript-advanced-types
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$2$v$,
  $v$typescript-advanced-types$v$,
  $v$TypeScript Advanced Types: Generics and Utility Types$v$,
  $v$Explore advanced TypeScript features like generics, mapped types, and conditional types for writing type-safe applications.$v$,
  $v$TypeScript$v$,
  $c$# TypeScript Advanced Types: Generics and Utility Types

TypeScript's type system is one of its most powerful features. This article explores advanced type features that will help you write more robust and reusable code.

## Generics

Generics allow you to write code that can work with any type, while still maintaining type safety:

```typescript
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
```

## Keyof Operator

The `keyof` operator extracts the keys of a type:

```typescript
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
```

## Mapped Types

Mapped types allow you to create new types by transforming existing ones:

```typescript
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
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// Result: { getName: () => string; getAge: () => number }
```

## Conditional Types

Conditional types allow you to select a type based on a condition:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false

// More practical example
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
```

## Utility Types

TypeScript provides built-in utility types:

```typescript
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
```

## Conclusion

These advanced type features make TypeScript incredibly powerful for large applications. They help catch errors at compile time and provide excellent developer experience through IDE support.$c$,
  $v$2024-01-22$v$,
  14,
  $v$https://picsum.photos/seed/blog2/800/600$v$,
  ARRAY[$v$TypeScript$v$, $v$Generics$v$, $v$Advanced$v$]
);

-- Article: “Web Performance Optimization: Techniques and Best Practices”  slug: web-performance-optimization
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$3$v$,
  $v$web-performance-optimization$v$,
  $v$Web Performance Optimization: Techniques and Best Practices$v$,
  $v$Learn essential techniques to optimize web application performance including bundling, caching, and lazy loading.$v$,
  $v$Performance$v$,
  $c$# Web Performance Optimization: Techniques and Best Practices

Performance is crucial for user experience. This guide covers essential techniques for optimizing web applications.

## Measuring Performance

Use these tools to measure performance:

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

## Code Splitting

Reduce initial bundle size with code splitting:

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Image Optimization

Images often represent the largest part of page size:

```jsx
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
```

## Caching Strategies

| Strategy | Use Case |
|----------|----------|
| Browser Cache | Static assets, long-lived content |
| CDN Cache | Global content distribution |
| Server Cache | API responses, database queries |
| HTTP Caching | Cache control headers |

## Conclusion

Performance optimization is an ongoing process. Monitor your metrics and continuously improve.$c$,
  $v$2024-02-01$v$,
  16,
  $v$https://picsum.photos/seed/blog3/800/600$v$,
  ARRAY[$v$Performance$v$, $v$Optimization$v$, $v$Best Practices$v$]
);

-- Article: “Modern CSS Techniques: Grid, Flexbox, and Custom Properties”  slug: modern-css-techniques
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$4$v$,
  $v$modern-css-techniques$v$,
  $v$Modern CSS Techniques: Grid, Flexbox, and Custom Properties$v$,
  $v$Master modern CSS features for building responsive and maintainable layouts without frameworks.$v$,
  $v$CSS$v$,
  $c$# Modern CSS Techniques: Grid, Flexbox, and Custom Properties

Modern CSS provides powerful tools for creating responsive layouts.

## CSS Grid

CSS Grid is perfect for complex layouts:

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.grid-item:nth-child(1) {
  grid-column: span 2;
}
```

## CSS Custom Properties

Use CSS variables for maintainable styling:

```css
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
```

## Conclusion

These modern CSS features help build better applications.$c$,
  $v$2024-02-10$v$,
  13,
  $v$https://picsum.photos/seed/blog4/800/600$v$,
  ARRAY[$v$CSS$v$, $v$Flexbox$v$, $v$Grid$v$, $v$Responsive$v$]
);

-- Article: “Building Robust APIs with Node.js and Express”  slug: node-express-best-practices
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$5$v$,
  $v$node-express-best-practices$v$,
  $v$Building Robust APIs with Node.js and Express$v$,
  $v$Essential patterns and practices for building production-ready APIs with proper error handling and authentication.$v$,
  $v$Backend$v$,
  $c$# Building Robust APIs with Node.js and Express

Building scalable APIs requires careful architecture and best practices.

## Error Handling

Implement centralized error handling:

```javascript
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
```

## Authentication

Secure your API with JWT:

```javascript
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
```

## Conclusion

These practices help build secure and maintainable APIs.$c$,
  $v$2024-02-18$v$,
  15,
  $v$https://picsum.photos/seed/blog5/800/600$v$,
  ARRAY[$v$Node.js$v$, $v$Express$v$, $v$API$v$, $v$Backend$v$]
);

-- Article: “Career Transition to Tech: A Practical Guide”  slug: career-transition-to-tech
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$6$v$,
  $v$career-transition-to-tech$v$,
  $v$Career Transition to Tech: A Practical Guide$v$,
  $v$Real strategies for transitioning into tech from non-technical backgrounds. Learn what employers really look for.$v$,
  $v$Career$v$,
  $c$# Career Transition to Tech: A Practical Guide

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

Career transition is possible with persistence and dedication.$c$,
  $v$2024-02-25$v$,
  11,
  $v$https://picsum.photos/seed/blog6/800/600$v$,
  ARRAY[$v$Career$v$, $v$Learning$v$, $v$Advice$v$]
);

-- Article: “AI and Machine Learning for Web Developers”  slug: ai-ml-for-web-developers
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$7$v$,
  $v$ai-ml-for-web-developers$v$,
  $v$AI and Machine Learning for Web Developers$v$,
  $v$Introduction to integrating AI capabilities into web applications using APIs and frameworks.$v$,
  $v$AI$v$,
  $c$# AI and Machine Learning for Web Developers

Integrating AI into web applications is more accessible than ever.

## OpenAI API

Using ChatGPT in your application:

```javascript
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
```

## Machine Learning in Browser

Use TensorFlow.js for in-browser ML:

```javascript
import * as tf from '@tensorflow/tfjs';

// Load a pre-trained model
const model = await tf.loadLayersModel(
  'https://tfhub.dev/...'
);

// Make predictions
const input = tf.tensor2d([[1, 2, 3]]);
const prediction = model.predict(input);
```

## Conclusion

AI opens new possibilities for web applications.$c$,
  $v$2024-03-05$v$,
  14,
  $v$https://picsum.photos/seed/blog7/800/600$v$,
  ARRAY[$v$AI$v$, $v$Machine Learning$v$, $v$Web Development$v$]
);

-- Article: “State Management: Redux vs Zustand vs Context API”  slug: state-management-redux-zustand
insert into public.articles (
  id, slug, title, excerpt, category, content, published_at, read_time, cover_image_url, tags
) values (
  $v$8$v$,
  $v$state-management-redux-zustand$v$,
  $v$State Management: Redux vs Zustand vs Context API$v$,
  $v$Compare different state management solutions and choose the right one for your project.$v$,
  $v$React$v$,
  $c$# State Management: Redux vs Zustand vs Context API

Choosing the right state management solution affects your application's architecture.

## Context API

Simplest built-in solution:

```jsx
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
```

## Zustand

Lightweight and simple:

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set(state => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  }))
}));
```

## Redux

Enterprise-grade solution:

```javascript
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
```

## Comparison

| Feature | Context API | Zustand | Redux |
|---------|------------|---------|-------|
| Bundle Size | Small | Very Small | Medium |
| Learning Curve | Easy | Easy | Steep |
| Scalability | Limited | Good | Excellent |
| DevTools | No | Yes | Yes |

## Conclusion

Choose based on your project complexity and team experience.$c$,
  $v$2024-03-15$v$,
  13,
  $v$https://picsum.photos/seed/blog8/800/600$v$,
  ARRAY[$v$React$v$, $v$State Management$v$, $v$Redux$v$, $v$Zustand$v$]
);

-- =============================================================================
-- End of sample data
-- =============================================================================
