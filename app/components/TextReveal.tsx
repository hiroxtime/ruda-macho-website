'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  animation?: 'fadeUp' | 'blur' | 'scale' | 'character'
  stagger?: number
}

// Simple text reveal without premium plugins
export default function TextReveal({
  children,
  className = '',
  delay = 0,
  duration = 2,
  animation = 'character',
  stagger = 0.03,
}: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !textRef.current) return

    const ctx = gsap.context(() => {
      // Wrap each character in a span for individual animation
      const text = textRef.current!
      const chars = text.textContent!.split('')
      text.innerHTML = chars.map(char => 
        char === ' ' ? ' ' : `<span class="char inline-block">${char}</span>`
      ).join('')

      const targets = text.querySelectorAll('.char')

      switch (animation) {
        case 'fadeUp':
          gsap.fromTo(targets,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              delay,
              ease: 'power3.out',
            }
          )
          break

        case 'blur':
          gsap.fromTo(targets,
            { opacity: 0, filter: 'blur(12px)', scale: 0.8 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
              duration,
              stagger,
              delay,
              ease: 'power2.out',
            }
          )
          break

        case 'scale':
          gsap.fromTo(targets,
            { opacity: 0, scale: 0, rotation: -180 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration,
              stagger,
              delay,
              ease: 'elastic.out(1, 0.5)',
            }
          )
          break

        case 'character':
        default:
          gsap.fromTo(targets,
            { opacity: 0, y: 40, rotateX: -90 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration,
              stagger,
              delay,
              ease: 'back.out(1.7)',
            }
          )
          break
      }
    }, textRef)

    return () => ctx.revert()
  }, [children, delay, duration, animation, stagger])

  return (
    <div ref={textRef} className={`overflow-hidden ${className}`} style={{ perspective: '1000px' }}>
      {children}
    </div>
  )
}