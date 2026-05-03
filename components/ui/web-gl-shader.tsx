"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, { value: unknown }> | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // CMYK color model: three wave lines rendered in Cyan, Magenta, Yellow
    // on a black (K=100%) background. Where channels overlap they mix as
    // subtractive inks would on screen: C+M=blue, C+Y=green, M+Y=red.
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float yOffset;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        // Chromatic-aberration displacement per CMYK ink channel
        float cx = p.x * (1.0 + d);   // Cyan channel x-shift
        float mx = p.x;                // Magenta channel (no shift)
        float yx = p.x * (1.0 - d);   // Yellow channel x-shift

        // Shift waves upward by yOffset (positive = up in WebGL y-space)
        float py = p.y - yOffset;

        // Intensity of each ink wave
        float c = 0.05 / abs(py + sin((cx + time) * xScale) * yScale);
        float m = 0.05 / abs(py + sin((mx + time) * xScale) * yScale);
        float y = 0.05 / abs(py + sin((yx + time) * xScale) * yScale);

        // CMYK primaries on black: Cyan=(0,1,1), Magenta=(1,0,1), Yellow=(1,1,0)
        vec3 color = vec3(0.0, 1.0, 1.0) * c
                   + vec3(1.0, 0.0, 1.0) * m
                   + vec3(1.0, 1.0, 0.0) * y;

        // Alpha follows wave intensity so dark areas are transparent → grid shows through
        float alpha = min(max(color.r, max(color.g, color.b)) * 2.0, 1.0);
        gl_FragColor = vec4(color, alpha);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x000000), 0)

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 0.65 },
        yScale: { value: 0.6 },
        distortion: { value: 0.05 },
        yOffset: { value: 0.3 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value = (refs.uniforms.time.value as number) + 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full block"
    />
  )
}
