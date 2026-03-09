import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroGL() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = mount.clientWidth, H = mount.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 5);

    /* ── Central 3D Object: Wireframe Icosahedron ── */
    const geoIco  = new THREE.IcosahedronGeometry(1.4, 1);
    const matIco  = new THREE.MeshBasicMaterial({
      color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.18,
    });
    const ico = new THREE.Mesh(geoIco, matIco);
    scene.add(ico);

    /* ── Inner solid sphere ── */
    const geoSphere = new THREE.SphereGeometry(0.9, 32, 32);
    const matSphere = new THREE.MeshBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.04,
    });
    const sphere = new THREE.Mesh(geoSphere, matSphere);
    scene.add(sphere);

    /* ── Outer ring ── */
    const geoRing = new THREE.TorusGeometry(2.1, 0.008, 12, 80);
    const matRing = new THREE.MeshBasicMaterial({
      color: 0xffab40, transparent: true, opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(geoRing, matRing);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.005, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2 })
    );
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    /* ── Floating particles ── */
    const N = 800;
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = Math.random() < 0.6;
      pPos[i*3]   = (Math.random() - 0.5) * 14;
      pPos[i*3+1] = (Math.random() - 0.5) * 10;
      pPos[i*3+2] = (Math.random() - 0.5) * 8;
      if (r) { pCol[i*3]=0; pCol[i*3+1]=0.83; pCol[i*3+2]=1; }
      else    { pCol[i*3]=1; pCol[i*3+1]=0.67; pCol[i*3+2]=0.25; }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(pGeo,
      new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.7 })
    );
    scene.add(particles);

    /* ── Orbiting dots ── */
    const orbitGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00d4ff : 0xffab40 })
      );
      const angle = (i / 5) * Math.PI * 2;
      dot.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 0.6, Math.sin(angle) * 0.9);
      orbitGroup.add(dot);
    }
    scene.add(orbitGroup);

    /* ── Mouse parallax ── */
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* ── Animation loop ── */
    let frame;
    const tick = (t) => {
      frame = requestAnimationFrame(tick);
      const s = t * 0.001;

      ico.rotation.y  = s * 0.18;
      ico.rotation.x  = s * 0.09;
      ring1.rotation.z = s * 0.12;
      ring2.rotation.y = s * 0.08;
      orbitGroup.rotation.y = s * 0.6;
      particles.rotation.y  = s * 0.03;

      // mouse parallax
      camera.position.x += (mx * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
