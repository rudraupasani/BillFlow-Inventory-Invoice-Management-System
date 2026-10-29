# BillFlow - Modern Design & Animation Guide

## Design Philosophy

The UI follows a **premium SaaS aesthetic** with:
- Glassmorphism effects for depth
- Smooth animations for delightful interactions
- Dark theme for reduced eye strain
- Gradient accents for visual hierarchy
- Consistent micro-interactions
- Professional accessibility standards

---

## Color Palette

### Primary Colors
```css
--primary: oklch(0.6 0.22 265)  /* Modern Blue */
--accent: oklch(0.6 0.22 265)   /* Vibrant Cyan */
```

### Dark Theme
```css
--background: oklch(0.08 0 0)       /* Deep Black */
--card: oklch(0.12 0 0)             /* Dark Gray */
--border: oklch(0.2 0 0)            /* Subtle Gray */
--muted-foreground: oklch(0.6 0 0)  /* Light Gray */
--foreground: oklch(0.95 0 0)       /* Almost White */
```

### Accent Colors
```css
--destructive: oklch(0.5 0.2 30)    /* Red */
--chart-1: oklch(0.6 0.22 265)      /* Primary Blue */
--chart-2: oklch(0.7 0.2 180)       /* Cyan */
--chart-3: oklch(0.75 0.15 100)     /* Green */
--chart-4: oklch(0.65 0.2 30)       /* Orange */
--chart-5: oklch(0.7 0.18 340)      /* Pink */
```

---

## Animation Library

### Page Transitions
```css
/* Slide up on entry */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide in from left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide in from right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtle pulse */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Duration & Timing
- **Fast**: 200ms (button interactions, hovers)
- **Medium**: 300ms (page transitions)
- **Slow**: 500ms (staggered animations)
- **Continuous**: Infinite (spinners, pulses)

---

## Component Styling

### Buttons
```css
/* Hover effects */
.hover-lift: scale(1.05) + shadow-lg
.hover-glow: shadow-[0_0_20px_rgba(99,102,241,0.3)]

/* Gradient buttons */
.gradient-btn: background gradient-to-r from-primary to-accent

/* Transition */
transition-all duration-300 ease-in-out
```

### Cards
```css
/* Glassmorphism */
.glass: {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hover effects */
hover:border-primary/50
hover:shadow-lg
group-hover:from-primary/30
transition-all duration-300
```

### Inputs
```css
/* Focus states */
focus:border-primary
focus:ring-primary/20

/* Transitions */
transition-all duration-300
hover:border-primary/30
```

### Loading Spinners
```css
/* Smooth rotation */
border-2 border-primary border-t-transparent
animate-spin
```

---

## Layout Patterns

### Sidebar Navigation
```css
/* Active state */
bg-gradient-to-r from-primary to-accent
text-white
shadow-lg

/* Hover state */
hover:bg-sidebar-accent/50
hover:translate-x-1  /* Subtle translation */
transition-all duration-300
```

### Stat Cards
```css
/* Base */
border-border/50

/* Hover */
hover:border-primary/50
hover:shadow-lg
hover:scale-105

/* Icon background */
bg-gradient-to-br from-primary/20 to-accent/20
group-hover:from-primary/30 group-hover:to-accent/30
```

### Header
```css
/* Glassmorphism */
bg-gradient-to-r from-background to-background via-primary/5
backdrop-blur-md

/* Search focus */
group-focus-within:text-primary
transition-colors
```

---

## Animation Timing

### Staggered Animations
```css
.animate-fadeIn { animation-delay: 0s; }
.animate-fadeIn[style*="0.1s"] { animation-delay: 0.1s; }
.animate-fadeIn[style*="0.2s"] { animation-delay: 0.2s; }
.animate-fadeIn[style*="0.3s"] { animation-delay: 0.3s; }
```

### Page Load
```
1. Header: slideInUp (0ms)
2. Content: slideInUp (100ms)
3. Cards: slideInUp (200ms)
4. Footer: slideInUp (300ms)
```

---

## Responsive Breakpoints

```css
/* Mobile First */
.grid-cols-1             /* Default: 1 column */

/* Tablet */
@media (md:) {
  .grid-cols-2           /* 2 columns */
  .hidden md:block        /* Show on tablet+ */
}

/* Desktop */
@media (lg:) {
  .grid-cols-3           /* 3 columns */
  .hidden lg:flex         /* Show on desktop+ */
}
```

---

## Accessibility Features

### Focus States
```css
focus:outline-ring/50
focus:ring-primary/20
```

### Color Contrast
- Text on background: 7:1 ratio (AAA)
- Button text: High contrast
- Icons: Properly colored

### Keyboard Navigation
- Tab order: Logical flow
- Focus visible: Always visible
- Skip links: Present

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

---

## Performance Optimizations

### CSS Animations
- GPU acceleration via `transform` and `opacity`
- No layout thrashing
- Efficient repaints

### Smooth Scrolling
```css
html {
  scroll-behavior: smooth;
}
```

### Hardware Acceleration
```css
will-change: transform;
transform: translateZ(0);
```

---

## File Examples

### Login Page Animation
```tsx
<div className="animate-slideInUp">
  <h1 className="animate-slideInUp" style={{ animationDelay: '0.1s' }} />
  <Card className="animate-slideInUp hover-glow" style={{ animationDelay: '0.2s' }} />
</div>
```

### Dashboard Metrics
```tsx
<div className="grid gap-4 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
  {statCards.map((card) => (
    <StatCard key={card.title} {...card} />
  ))}
</div>
```

### Sidebar Navigation
```tsx
<Link href={item.href}>
  <div className={cn(
    'flex items-center gap-3 px-4 py-2.5 rounded-lg',
    'transition-all duration-300',
    isActive ? 'bg-gradient-to-r from-primary to-accent' : 'hover:translate-x-1'
  )}>
```

---

## Design System Standards

### Typography
- **Headlines**: Bold, 24-48px
- **Body**: Regular, 14-16px
- **Labels**: Medium, 12-14px
- **Monospace**: Code/SKU values

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Border Radius
- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **full**: 9999px

### Shadows
- **sm**: 0 1px 2px rgba(0,0,0,0.05)
- **md**: 0 4px 6px rgba(0,0,0,0.1)
- **lg**: 0 10px 15px rgba(0,0,0,0.1)
- **xl**: 0 20px 25px rgba(0,0,0,0.1)

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Feature Support
- ✅ CSS Animations
- ✅ CSS Transitions
- ✅ Backdrop Filter
- ✅ Gradient Text (clip-text)
- ✅ Transform 3D

---

## Testing Animation Smoothness

### Performance
```bash
# Check for 60fps animations
Chrome DevTools > Performance > Record
```

### Visual Testing
1. Login page loads smoothly
2. Dashboard metrics animate on entry
3. Hover effects trigger immediately
4. Sidebar navigation responds instantly
5. Cards have glow effect on hover
6. Buttons scale and lift on click

---

## Best Practices

1. **Use transform** over position for animations
2. **Use opacity** for visibility changes
3. **Limit animations** to essential interactions
4. **Respect prefers-reduced-motion**
5. **Keep transitions under 500ms**
6. **Use ease-in-out** for natural motion
7. **Layer shadows** for depth perception
8. **Test on mobile** for performance

---

## Customization

### Change Primary Color
Edit `app/globals.css`:
```css
--primary: oklch(0.6 0.22 265);  /* Change hue (265) */
```

### Adjust Animation Speed
```css
transition-all duration-200  /* Faster */
transition-all duration-500  /* Slower */
```

### Modify Gradient
```css
bg-gradient-to-r from-primary to-accent
/* Change to: from-accent to-primary */
```

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
**Status**: Production Ready
