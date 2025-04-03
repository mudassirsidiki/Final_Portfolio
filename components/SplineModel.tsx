'use client';

import { useEffect, useRef } from 'react';

export default function SplineModel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    
    // Add the script to the document head
    document.head.appendChild(script);

    // Wait for the script to load before creating the viewer
    script.onload = () => {
      // Create the spline-viewer element
      if (containerRef.current) {
        const splineViewer = document.createElement('spline-viewer');
        // Updated with your new Spline model URL
        splineViewer.setAttribute('url', 'https://prod.spline.design/YSJs-eVUVnXfq4i2/scene.splinecode');
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        containerRef.current.appendChild(splineViewer);
      }
    };

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      // Remove the script if it exists
      const scriptElement = document.head.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"]');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}