"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- ported verbatim from
   the source artifact; Three.js internals (renderer/geometry/userData) are
   typed loosely on purpose so this stays a 1:1 port, not a rewrite. */
import { useEffect, useRef } from "react";

// Cinematic film-grain texture — fractalNoise SVG filter, data-URI'd so it
// needs no separate asset request. Painted via the grain overlay below,
// jittered by the `grain` steps() keyframe (app/globals.css).
const GRAIN_BG = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;

export default function CubesScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0, renderer: any, onResize: any, onPointer: any;
    let disposed = false;
    (async () => {
      const THREE = await import("three");
      const { RoundedBoxGeometry } = await import(
        "three/examples/jsm/geometries/RoundedBoxGeometry.js"
      );
      const app = mountRef.current;
      if (!app || disposed) return;
      const getW = () => app.clientWidth || 1;
      const getH = () => app.clientHeight || 1;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(getW(), getH());
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      app.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = null; // transparent — hero shows behind

      const camera = new THREE.PerspectiveCamera(30, getW() / getH(), 0.1, 100);
      camera.position.set(0, 0, 11);

      // ---- environment texture (per-direction chrome colour) ----
      function makeEnv() {
        const W = 1024, H = 512;
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const g = c.getContext("2d")!;
        g.fillStyle = "#050507"; g.fillRect(0, 0, W, H);
        function panel(hot:string,c1:string,c2:string,cx:number,cy:number,r:number){
          const rg = g.createRadialGradient(cx,cy,0,cx,cy,r);
          rg.addColorStop(0,hot); rg.addColorStop(0.45,c1);
          rg.addColorStop(0.82,c2); rg.addColorStop(1,"rgba(0,0,0,0)");
          g.globalCompositeOperation="source-over"; g.fillStyle=rg;
          g.fillRect(cx-r,cy-r,r*2,r*2);
        }
        panel("#3a3a3e","#222226","#141416",40,150,250);
        panel("#42424648","#26262a","#141416",150,140,260);
        panel("#3c3c40","#202024","#131315",300,140,260);
        panel("#5a464e","#3a2a30","#161214",450,140,260);
        panel("#3a3a3e","#212125","#131315",600,140,260);
        panel("#40404450","#242428","#141416",760,140,270);
        panel("#3a3a3e","#202024","#131315",920,150,250);
        g.globalCompositeOperation="lighter";
        g.fillStyle="rgba(255,255,255,0.32)"; g.fillRect(0,20,W,4);
        g.globalCompositeOperation="source-over";
        const floor=g.createLinearGradient(0,H*0.6,0,H);
        floor.addColorStop(0,"rgba(0,0,0,0)"); floor.addColorStop(1,"rgba(0,0,0,1)");
        g.fillStyle=floor; g.fillRect(0,0,W,H);
        const tex=new THREE.CanvasTexture(c);
        tex.mapping=THREE.EquirectangularReflectionMapping;
        tex.colorSpace=THREE.SRGBColorSpace; return tex;
      }
      scene.environment = makeEnv();

      // ---- perforated dot map ----
      function makeDots(){
        const c=document.createElement("canvas"); c.width=256; c.height=256;
        const g=c.getContext("2d")!; g.fillStyle="#ffffff"; g.fillRect(0,0,256,256);
        const n=16,s=256/n;
        for(let x=0;x<n;x++)for(let y=0;y<n;y++){g.beginPath();
          g.arc(x*s+s/2,y*s+s/2,s*0.26,0,Math.PI*2);g.fillStyle="#b4b4b8";g.fill();}
        const tex=new THREE.CanvasTexture(c);
        tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(2,2);
        tex.colorSpace=THREE.SRGBColorSpace; return tex;
      }
      const dots=makeDots();

      // ---- roughness/bump surface ----
      function makeSurface(){
        const S=256;const c=document.createElement("canvas");c.width=S;c.height=S;
        const g=c.getContext("2d")!; g.fillStyle="#8f8f8f"; g.fillRect(0,0,S,S);
        for(let i=0;i<40;i++){const x=Math.random()*S,y=Math.random()*S,r=30+Math.random()*80;
          const v=90+(Math.random()*90|0);
          const rad=g.createRadialGradient(x,y,0,x,y,r);
          rad.addColorStop(0,`rgba(${v},${v},${v},0.5)`); rad.addColorStop(1,"rgba(143,143,143,0)");
          g.fillStyle=rad; g.fillRect(0,0,S,S);}
        const img=g.getImageData(0,0,S,S),d=img.data;
        for(let i=0;i<d.length;i+=4){const n=(Math.random()-0.5)*34;d[i]+=n;d[i+1]+=n;d[i+2]+=n;}
        g.putImageData(img,0,0);
        const t=new THREE.CanvasTexture(c);
        t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,3);
        t.colorSpace=THREE.SRGBColorSpace; return t;
      }
      const surface=makeSurface();

      scene.add(new THREE.AmbientLight(0x2a2a2e,0.4));
      const rimA=new THREE.DirectionalLight(0x6a5158,0.7); rimA.position.set(-6,-3,4); scene.add(rimA);
      const rimB=new THREE.DirectionalLight(0xbdbdc2,0.6); rimB.position.set(6,-4,3); scene.add(rimB);
      const front=new THREE.DirectionalLight(0xcfcfd4,0.6); front.position.set(-2,3,8); scene.add(front);

      const cluster=new THREE.Group(); scene.add(cluster);
      const size=1.15, D=1.25;
      const geo=new RoundedBoxGeometry(size,size,size,8,0.09);
      const positions=[[D,0,0],[-D,0,0],[0,D,0],[0,-D,0],[0,0,D],[0,0,-D]];
      const axes=[[1,0.4,0.3],[0.3,1,-0.4],[-0.4,0.3,1],[1,-0.5,0.4],[-0.3,1,0.5],[0.5,0.3,-1]];
      const cubes:any[]=[];
      positions.forEach((p,k)=>{
        const mat=new THREE.MeshStandardMaterial({color:0xffffff,map:dots,
          roughnessMap:surface,bumpMap:surface,bumpScale:0.012,
          metalness:1.0,roughness:0.32,envMapIntensity:1.3});
        const cube=new THREE.Mesh(geo,mat);
        cube.position.set(p[0],p[1],p[2]);
        (cube.userData as any).home=cube.position.clone();
        (cube.userData as any).axis=new THREE.Vector3(...axes[k]).normalize();
        cluster.add(cube); cubes.push(cube);
      });

      // Canvas now spans the full hero (not just a right-half box), so
      // without this the cluster would re-center to the middle of the
      // frame. Shifts it back to the on-screen position it always had —
      // its old right-half container's own center sat at 75% across the
      // full page — recomputed on resize since the frustum width at the
      // cluster's depth scales with aspect.
      const keepClusterRight=()=>{
        const halfW=camera.position.z*Math.tan((camera.fov*Math.PI/180)/2)*camera.aspect;
        cluster.position.x=halfW*0.5; // (0.75-0.5)*2
      };
      keepClusterRight();

      const pointer={x:0,y:0,tx:0,ty:0};
      onPointer=(e:PointerEvent)=>{
        pointer.tx=(e.clientX/window.innerWidth)*2-1;
        pointer.ty=(e.clientY/window.innerHeight)*2-1;
      };
      window.addEventListener("pointermove",onPointer);

      const clock=new THREE.Clock();
      function animate(){
        const t=clock.getElapsedTime();
        pointer.x+=(pointer.tx-pointer.x)*0.06;
        pointer.y+=(pointer.ty-pointer.y)*0.06;
        cluster.rotation.y=0.5+pointer.x*0.35;
        cluster.rotation.x=-0.5+pointer.y*0.25;
        cluster.rotation.z=t*0.5607;
        const raw=Math.sin(t*1.2335)*0.5+0.5;
        const pp=raw*raw*(3-2*raw);
        const sc=1.0+pp*0.55;
        for(const c of cubes){
          c.position.copy((c.userData as any).home).multiplyScalar(sc);
          c.quaternion.setFromAxisAngle((c.userData as any).axis,pp*(Math.PI/2));
        }
        renderer.render(scene,camera);
        raf=requestAnimationFrame(animate);
      }
      animate();

      onResize=()=>{camera.aspect=getW()/getH();camera.updateProjectionMatrix();
        renderer.setSize(getW(),getH());keepClusterRight();};
      window.addEventListener("resize",onResize);
      const ro=new ResizeObserver(onResize); ro.observe(app);
      (renderer as any).__ro=ro;
    })();

    return ()=>{
      disposed=true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",onResize);
      window.removeEventListener("pointermove",onPointer);
      if(renderer){ (renderer as any).__ro?.disconnect?.();
        renderer.dispose?.(); renderer.domElement?.remove?.(); }
    };
  }, []);
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {/* Vignette — scoped to this container only, darkens the cluster's
          edges toward black without touching the rest of the hero. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.9) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Film grain — oversized (-50% inset) so the steps() jitter never
          exposes a hard edge at the container bounds. */}
      <div
        aria-hidden="true"
        className="absolute inset-[-50%] pointer-events-none motion-safe:animate-[grain_0.6s_steps(3)_infinite]"
        style={{ opacity: 0.06, mixBlendMode: 'overlay', backgroundImage: GRAIN_BG }}
      />
    </div>
  );
}
