# Responsive Design Testing Checklist

## Test Environments
- [ ] Chrome DevTools (emulator)
- [ ] Firefox DevTools (emulator)
- [ ] Real devices (iPhone, Android, iPad, Desktop)

## Breakpoints to Test
- [ ] 320px (Mobile: iPhone SE)
- [ ] 375px (Mobile: iPhone 12)
- [ ] 640px (Tablet: iPad Mini)
- [ ] 768px (Tablet: iPad)
- [ ] 1024px (Laptop: 13")
- [ ] 1280px (Desktop: 24")
- [ ] 1920px (Wide Desktop: 27"+)

## Components Testing

### Navbar
- [ ] Mobile (320px): Logo + hamburger visible, nav items hidden
- [ ] Mobile (375px): Same as 320px
- [ ] Tablet (640px): Logo + some nav items if space
- [ ] Desktop (1024px+): Logo + nav items + buttons all visible
- [ ] Hamburger animation smooth
- [ ] Menu closes on item click
- [ ] Menu closes on outside click (overlay)
- [ ] ARIA labels present: aria-label, aria-expanded

### HeroSection
- [ ] Mobile (320px): Title 28px, legible without overflow
- [ ] Mobile (640px): Title 32px, subtitle 20px
- [ ] Tablet (768px): Title 36px, subtitle 24px
- [ ] Desktop (1024px+): Title 48px, subtitle 36px
- [ ] Search box 100% width on mobile
- [ ] Search box max-w-xl on md+ screens
- [ ] No horizontal scroll
- [ ] Padding responsive (px-4 on mobile, px-8 on desktop)

### CTA Section
- [ ] Mobile (320px): Flex column, image hidden, text centered
- [ ] Mobile (640px): Still flex column, image hidden
- [ ] Tablet (768px): Still flex column
- [ ] Desktop (1024px+): Flex row, image visible on right
- [ ] Button height ≥ 44px (touch friendly)
- [ ] No horizontal scroll

### Footer
- [ ] Mobile (320px): 1 column, items stacked, centered text
- [ ] Mobile (640px): 2 columns
- [ ] Tablet (768px): 2 columns
- [ ] Desktop (1024px+): 4 columns
- [ ] Links are clickable/tappable (44px+ height with padding)
- [ ] Footer links have proper hover states
- [ ] Spacing responsive (gap-8 on mobile, gap-12 on lg+)

### Dashboard (if applicable)
- [ ] Mobile (320px): Sidebar hidden, hamburger visible in header
- [ ] Mobile (640px): Sidebar hidden, hamburger visible
- [ ] Tablet (768px): Sidebar drawer opens/closes smoothly
- [ ] Desktop (1024px+): Sidebar always visible, hamburger hidden
- [ ] Sidebar overlay only shows on mobile
- [ ] Click outside overlay closes sidebar
- [ ] Menu items close sidebar when clicked
- [ ] Z-index correct (overlay z-30, sidebar z-40, content z-0)

## Accessibility Checks
- [ ] All buttons/inputs have minimum 44px touch target
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] ARIA labels present on interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announces menu items properly

## Performance Checks
- [ ] No layout shift (CLS) when switching breakpoints
- [ ] Animations smooth (60fps) - no jank
- [ ] Images lazy-load (img tags have loading="lazy")
- [ ] CSS media queries don't cause unexpected reflows

## Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Sign-Off
- [ ] All checks passed
- [ ] Tested on real devices
- [ ] No regressions from original design
- [ ] Ready for production
