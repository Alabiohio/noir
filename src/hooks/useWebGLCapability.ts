import { useEffect, useState } from 'react';

export interface WebGLCapability {
  supported: boolean;
  isSoftwareGl: boolean;
  isMobile: boolean;
  maxDpr: number;
}

export function detectWebGLCapability(): WebGLCapability {
  if (typeof window === 'undefined') {
    return { supported: true, isSoftwareGl: false, isMobile: false, maxDpr: 1.5 };
  }

  const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      return { supported: false, isSoftwareGl: false, isMobile, maxDpr: 1 };
    }

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    const maxDpr = isSoftwareGl ? 1 : isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);

    return {
      supported: true,
      isSoftwareGl,
      isMobile,
      maxDpr,
    };
  } catch {
    return { supported: false, isSoftwareGl: false, isMobile, maxDpr: 1 };
  }
}

export function useWebGLCapability(): WebGLCapability {
  const [capability, setCapability] = useState<WebGLCapability>(() => detectWebGLCapability());

  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      setCapability((prev) => {
        if (prev.isMobile === isMobile) return prev;
        const maxDpr = prev.isSoftwareGl
          ? 1
          : isMobile
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : Math.min(window.devicePixelRatio || 1, 2);
        return { ...prev, isMobile, maxDpr };
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return capability;
}
