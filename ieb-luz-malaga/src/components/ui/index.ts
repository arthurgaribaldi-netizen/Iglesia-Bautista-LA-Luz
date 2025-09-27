// Optimized barrel exports to reduce bundle size
// Only export what's actually used

// Core UI Components
export { Button } from './button';
export type { ButtonProps } from './button';

export { Input } from './input';
export type { InputProps } from './input';

// Card Components
export { 
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent 
} from './card';

// Loading Components
export { Skeleton } from './skeleton';

// Newsletter Components - lazy loaded
export { NewsletterSignup } from './newsletter-signup';
export { NewsletterSignupCompact } from './newsletter-signup';

// Conditional exports for heavy components
export const HeavyComponents = {
  // These will be imported only when needed
  get NewsletterSignup() {
    return import('./newsletter-signup').then(mod => mod.NewsletterSignup);
  },
  get NewsletterSignupCompact() {
    return import('./newsletter-signup').then(mod => mod.NewsletterSignupCompact);
  }
};
