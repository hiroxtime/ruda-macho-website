'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Smooth cursor following with lerp
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
      })

      gsap.set(cursorDot, {
        x: mouseX,
        y: mouseY,
      })

      requestAnimationFrame(animate)
    }

    // Click effect
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Hover effect on interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [data-cursor], [data-magnetic]')) {
        setIsHovering(true)
        const text = target.dataset.cursor || ''
        setCursorText(text)

        // Magnetic effect for buttons
        if (target.dataset.magnetic !== undefined || target.tagName === 'BUTTON' || target.tagName === 'A') {
          const rect = target.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          const distX = mouseX - centerX
          const distY = mouseY - centerY

          gsap.to(target, {
            x: distX * 0.2,
            y: distY * 0.2,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, [data-cursor], [data-magnetic]')) {
        setIsHovering(false)
        setCursorText('')

        // Reset magnetic element
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)

    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [])

  // Hide cursor on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          width: isHovering ? '60px' : isClicking ? '20px' : '40px',
          height: isHovering ? '60px' : isClicking ? '20px' : '40px',
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 border-ruda-gold transition-all duration-300 ${
            isClicking ? 'bg-ruda-gold/30' : 'bg-transparent'
          } ${isHovering ? 'scale-110' : 'scale-100'}`}
        />
        {cursorText && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ruda-gold">
            {cursorText}
          </span>
        )}
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <div
          className={`w-2 h-2 rounded-full bg-ruda-gold transition-all duration-150 ${
            isClicking ? 'scale-150' : 'scale-100'
          }`}
        />
      </div>

      {/* Global styles for cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  )
}