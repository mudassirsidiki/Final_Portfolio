'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  modelUrl: string;
};

export default function SplineModel({ modelUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };

    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);

    if (!isMobileDevice && containerRef.current) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
      document.head.appendChild(script);

      script.onload = () => {
        if (containerRef.current) {
          const splineViewer = document.createElement('spline-viewer');
          splineViewer.setAttribute('url', modelUrl); // ✅ Now dynamic
          splineViewer.style.width = '100%';
          splineViewer.style.height = '100%';
          containerRef.current.appendChild(splineViewer);
        }
      };
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      const scriptElement = document.head.querySelector(
        'script[src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"]'
      );
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      window.removeEventListener('resize', checkDeviceSize);
    };
  }, [isMobileDevice, modelUrl]); // ✅ Added modelUrl to deps

  if (isMobileDevice) {
    return null;
  }

  return <div ref={containerRef} className="w-full h-full" />;
}
