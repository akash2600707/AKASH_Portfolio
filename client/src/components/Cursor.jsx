import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  let rx = 0, ry = 0, mx = 0, my = 0;

  useEffect(() => {
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dotRef.current.style.left = mx + 'px';
      dotRef.current.style.top  = my + 'px';
    };
    window.addEventListener('mousemove', onMove);

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top  = ry + 'px';
      }
      requestAnimationFrame(animRing);
    };
    animRing();

    const grow = () => {
      ringRef.current.style.width  = '44px';
      ringRef.current.style.height = '44px';
    };
    const shrink = () => {
      ringRef.current.style.width  = '26px';
      ringRef.current.style.height = '26px';
    };
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const dotStyle = {
    position: 'fixed', width: 7, height: 7, borderRadius: '50%',
    background: 'var(--cyan)', pointerEvents: 'none', zIndex: 9999,
    transform: 'translate(-50%,-50%)', mixBlendMode: 'screen',
    transition: 'transform .1s',
  };
  const ringStyle = {
    position: 'fixed', width: 26, height: 26, borderRadius: '50%',
    border: '1px solid rgba(0,212,255,.4)', pointerEvents: 'none', zIndex: 9998,
    transform: 'translate(-50%,-50%)', transition: 'width .3s, height .3s',
  };
  return (
    <>
      <div ref={dotRef}  style={dotStyle}  />
      <div ref={ringRef} style={ringStyle} />
    </>
  );
}
