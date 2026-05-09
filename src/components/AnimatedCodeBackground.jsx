import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

const AnimatedCodeBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const codeSnippets = [
      'const app = () => {}',
      'function render() {}',
      'import React from "react"',
      'export default App',
      'npm install vettcode',
      'git commit -m "feat"',
      'async function fetch()',
      'return <Component />',
      'useState()',
      'useEffect(() => {})',
      'const [state, setState]',
      'map((item) => {})',
      'filter(x => x > 0)',
      'reduce((a, b) => a + b)',
      'Promise.all([])',
      'await api.get()',
      'try { } catch (e) {}',
      'if (condition) {}',
      'for (let i = 0; i < n; i++)',
      'while (true) {}',
      'class Component {}',
      'interface Props {}',
      'type State = {}',
      'enum Status {}',
      '{ key: value }',
      '[...array]',
      '${template}',
      '() => expression',
      'new Promise()',
      'setTimeout(() => {})',
      'const data = await',
      'export { module }',
      'import { useState }',
      'onClick={() => {}}',
      'style={{ color }}',
      'props.children',
      'return null',
      'throw new Error()',
    ]

    const colors = [
      '#667eea',
      '#764ba2',
      '#4facfe',
      '#00f2fe',
      '#43e97b',
      '#38f9d7',
      '#f093fb',
      '#f5576c',
    ]

    class CodeLine {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -20
        this.speed = 0.3 + Math.random() * 1.2
        this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        this.opacity = 0.08 + Math.random() * 0.15
        this.fontSize = 11 + Math.random() * 3
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.rotation = (Math.random() - 0.5) * 0.1
      }

      update() {
        this.y += this.speed
        if (this.y > canvas.height + 50) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.font = `${this.fontSize}px 'Fira Code', 'Courier New', monospace`
        ctx.fillStyle = this.color
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        
        ctx.fillText(this.text, 0, 0)
        ctx.restore()
      }
    }

    // Create more lines for denser effect
    const lines = Array.from({ length: 40 }, () => new CodeLine())

    // Add floating particles
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = 1 + Math.random() * 2
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = 0.1 + Math.random() * 0.3
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.shadowBlur = 5
        ctx.shadowColor = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const particles = Array.from({ length: 50 }, () => new Particle())

    const animate = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(10, 14, 39, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw code lines
      lines.forEach(line => {
        line.update()
        line.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  )
}

export default AnimatedCodeBackground
