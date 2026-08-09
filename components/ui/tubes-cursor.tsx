'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Custom-built tube-trail cursor effect — deliberately NOT the
// threejs-components/tubes1 CDN module originally referenced: that's a paid
// "Premium" Framer Marketplace component, and its free CDN/demo build is
// licensed CC BY-NC-SA (non-commercial only), which a commercial site like
// this one can't legally use. This reimplements the same visual idea — a
// few glowing tube trails chasing the cursor, colored to our own palette —
// directly on the `three` package already installed here (MIT-licensed),
// original code throughout.

const TUBE_COLORS = ['#7B8CDE', '#5B4B9E', '#D46FC8']
const LIGHT_COLORS = ['#7B8CDE', '#D46FC8', '#C7488F', '#5B4B9E']
const TRAIL_LENGTH = 26
const TUBE_RADIUS = 0.045

type TubeState = {
  points: THREE.Vector3[]
  mesh: THREE.Mesh
  lag: number
}

// Owns the whole three.js scene/renderer/render-loop for one canvas.
// `dispose()` tears everything down (geometries, materials, renderer, RAF,
// listeners) so nothing lingers on the GPU once the section scrolls out of
// view — this is re-created from scratch each time the section re-enters.
class TubesScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
  private tubes: TubeState[] = []
  private pointerNdc = new THREE.Vector2(0, 0)
  private raf: number | null = null
  private disposed = false
  private canvas: HTMLCanvasElement
  private resizeObserver: ResizeObserver

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.position.z = 6

    LIGHT_COLORS.forEach((color, i) => {
      const light = new THREE.PointLight(color, 6, 14)
      const angle = (i / LIGHT_COLORS.length) * Math.PI * 2
      light.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 2.5)
      this.scene.add(light)
    })
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    TUBE_COLORS.forEach((color, i) => {
      const points = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3())
      const curve = new THREE.CatmullRomCurve3(points)
      const geometry = new THREE.TubeGeometry(curve, 24, TUBE_RADIUS, 8, false)
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.7,
        roughness: 0.35,
        metalness: 0.2,
        transparent: true,
        opacity: 0.92,
      })
      const mesh = new THREE.Mesh(geometry, material)
      this.scene.add(mesh)
      // Each successive tube eases toward the pointer more slowly (higher
      // lag), so the three trails visibly fan out behind the cursor instead
      // of overlapping.
      this.tubes.push({ points, mesh, lag: 0.14 + i * 0.07 })
    })

    this.resize()
    this.resizeObserver = new ResizeObserver(this.resize)
    this.resizeObserver.observe(canvas)
    // Listening on the canvas itself doesn't work — it's pointer-events:none
    // (required, so it never blocks clicks/scroll), which means it can never
    // become an event target either. window always receives pointermove
    // regardless of what's on top; canvas-relative coords are still derived
    // from the canvas's own getBoundingClientRect() below.
    window.addEventListener('pointermove', this.onPointerMove)
    this.animate()
  }

  private resize = () => {
    const { clientWidth, clientHeight } = this.canvas
    if (!clientWidth || !clientHeight) return
    this.renderer.setSize(clientWidth, clientHeight, false)
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
  }

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect()
    this.pointerNdc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    )
  }

  private animate = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.animate)

    // Project the pointer's NDC position onto the z=0 plane in world space.
    const ndc = new THREE.Vector3(this.pointerNdc.x, this.pointerNdc.y, 0.5).unproject(this.camera)
    const dir = ndc.sub(this.camera.position).normalize()
    const dist = -this.camera.position.z / dir.z
    const worldPos = this.camera.position.clone().add(dir.multiplyScalar(dist))

    // Shift each tube's point history toward the pointer — the new head is
    // an eased step from the OLD head toward the pointer (not the pointer
    // itself), which is what gives the trail its trailing lag/smoothing.
    this.tubes.forEach(tube => {
      const newest = tube.points[0].clone().lerp(worldPos, tube.lag)
      tube.points.unshift(newest)
      tube.points.pop()

      const curve = new THREE.CatmullRomCurve3(tube.points)
      const geometry = new THREE.TubeGeometry(curve, 24, TUBE_RADIUS, 8, false)
      tube.mesh.geometry.dispose()
      tube.mesh.geometry = geometry
    })

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    if (this.raf != null) cancelAnimationFrame(this.raf)
    this.resizeObserver.disconnect()
    window.removeEventListener('pointermove', this.onPointerMove)
    this.tubes.forEach(t => {
      t.mesh.geometry.dispose()
      ;(t.mesh.material as THREE.Material).dispose()
    })
    this.renderer.dispose()
  }
}

export default function TubesCursor({ active, className }: { active: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<TubesScene | null>(null)
  const reduceMotion = !!useHydratedReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // prefers-reduced-motion, or a device with no fine hover pointer (touch)
    // — skip the effect entirely rather than ever initializing three.js.
    if (reduceMotion) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    if (active && !appRef.current && canvasRef.current) {
      // Same init-delay guard as the reference component this was adapted
      // from: gives the canvas one paint to settle into its final layout
      // size (it's sized by the parent section, not fixed) before three.js
      // reads clientWidth/clientHeight for the initial renderer size.
      const timer = window.setTimeout(() => {
        if (canvasRef.current && !appRef.current) {
          // Same WebGL-can-fail-outright guard as CubesScene.tsx — this
          // sits in the Footer, so an uncaught throw here used to crash
          // every page on the site, not just the homepage.
          try {
            appRef.current = new TubesScene(canvasRef.current)
          } catch (err) {
            console.warn('[TubesCursor] WebGL unavailable, skipping cursor effect:', err)
          }
        }
      }, 100)
      return () => window.clearTimeout(timer)
    }

    if (!active && appRef.current) {
      appRef.current.dispose()
      appRef.current = null
    }
  }, [active, reduceMotion])

  // Unmount safety net, independent of the active-flag effect above.
  useEffect(() => {
    return () => {
      appRef.current?.dispose()
      appRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      data-tubes-cursor=""
      className={className ?? 'absolute inset-0 w-full h-full pointer-events-none'}
      aria-hidden="true"
    />
  )
}
