import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '@/components/ui/Navbar'
import HeroSection from '@/components/ui/HeroSection'
import CtaSection from '@/components/ui/CtaSection'
import Footer from '@/components/ui/Footer'

describe('Responsive Design Tests', () => {
  describe('Navbar Responsive', () => {
    test('should render hamburger on mobile viewport', () => {
      // Mock viewport size as mobile (320px)
      global.innerWidth = 320
      const { container } = render(<Navbar />)
      const hamburger = container.querySelector('button[aria-label="Toggle menu"]')
      expect(hamburger).toBeInTheDocument()
    })

    test('hamburger should toggle menu open/closed', () => {
      render(<Navbar />)
      const hamburger = screen.getByRole('button', { name: /toggle menu/i })
      
      // Initially closed
      expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      
      // Click to open
      fireEvent.click(hamburger)
      expect(hamburger).toHaveAttribute('aria-expanded', 'true')
    })

    test('should have proper ARIA labels for accessibility', () => {
      render(<Navbar />)
      const hamburger = screen.getByRole('button', { name: /toggle menu/i })
      expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu')
    })
  })

  describe('HeroSection Responsive', () => {
    test('should have responsive heading classes', () => {
      const { container } = render(<HeroSection />)
      const heading = container.querySelector('h1')
      expect(heading?.className).toMatch(/text-2xl/)
      expect(heading?.className).toMatch(/sm:text-3xl/)
      expect(heading?.className).toMatch(/lg:text-5xl/)
    })

    test('search input should be full width on mobile', () => {
      const { container } = render(<HeroSection />)
      const input = container.querySelector('input')
      expect(input?.className).toMatch(/w-full/)
    })
  })

  describe('CTA Section Responsive', () => {
    test('should stack vertically on mobile', () => {
      const { container } = render(<CtaSection />)
      const flexContainer = container.querySelector('div')
      expect(flexContainer?.className).toMatch(/flex-col/)
      expect(flexContainer?.className).toMatch(/lg:flex-row/)
    })

    test('image should be hidden on mobile', () => {
      const { container } = render(<CtaSection />)
      const image = container.querySelector('img')
      expect(image?.className).toMatch(/hidden/)
      expect(image?.className).toMatch(/lg:block/)
    })
  })

  describe('Footer Responsive', () => {
    test('should have responsive grid columns', () => {
      const { container } = render(<Footer />)
      const grid = container.querySelector('[class*="grid"]')
      expect(grid?.className).toMatch(/grid-cols-1/)
      expect(grid?.className).toMatch(/sm:grid-cols-2/)
      expect(grid?.className).toMatch(/lg:grid-cols-4/)
    })
  })
})
