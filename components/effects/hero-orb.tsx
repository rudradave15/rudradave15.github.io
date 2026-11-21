"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function HeroOrb() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (prefersReducedMotion()) return;

    let raf = 0;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (!mountRef.current) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 5.2;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();

      const geo = new THREE.IcosahedronGeometry(1.7, 1);
      const wire = new THREE.WireframeGeometry(geo);
      const line = new THREE.LineSegments(
        wire,
        new THREE.LineBasicMaterial({ color: 0xf5f5f0, transparent: true, opacity: 0.45 })
      );
      group.add(line);

      const innerGeo = new THREE.IcosahedronGeometry(1.68, 1);
      const points = new THREE.Points(
        innerGeo,
        new THREE.PointsMaterial({ color: 0x8a8a82, size: 0.03, transparent: true, opacity: 0.8 })
      );
      group.add(points);

      const coreGeo = new THREE.IcosahedronGeometry(0.35, 0);
      const core = new THREE.Mesh(
        coreGeo,
        new THREE.MeshBasicMaterial({ color: 0xd7ff3d, wireframe: true, transparent: true, opacity: 0.95 })
      );
      group.add(core);

      scene.add(group);

      let mouseX = 0;
      let mouseY = 0;
      function onMove(e: MouseEvent) {
        const rect = mount!.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }
      window.addEventListener("mousemove", onMove);

      let t = 0;
      function animate() {
        t += 0.004;
        group.rotation.y += 0.0022;
        group.rotation.x = Math.sin(t) * 0.15 + mouseY * 0.25;
        group.rotation.y += mouseX * 0.0015;
        core.rotation.y -= 0.01;
        core.rotation.x += 0.006;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      }
      animate();

      function onResize() {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMove);
        renderer.dispose();
        geo.dispose();
        wire.dispose();
        innerGeo.dispose();
        coreGeo.dispose();
        mount?.removeChild(renderer.domElement);
      };
    });

    return () => cleanup();
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="hidden h-[340px] w-[340px] shrink-0 md:block lg:h-[420px] lg:w-[420px]"
    />
  );
}
