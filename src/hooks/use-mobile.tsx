
import * as React from "react"

// Define breakpoints for different screen sizes
const MOBILE_BREAKPOINT = 640  // sm
const TABLET_BREAKPOINT = 768  // md
const DESKTOP_BREAKPOINT = 1024 // lg
const LARGE_DESKTOP_BREAKPOINT = 1280 // xl

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkMobile()
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'large-desktop'>('desktop')
  
  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setBreakpoint('mobile')
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint('tablet')
      } else if (width < LARGE_DESKTOP_BREAKPOINT) {
        setBreakpoint('desktop')
      } else {
        setBreakpoint('large-desktop')
      }
    }
    
    // Check on mount
    checkBreakpoint()
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkBreakpoint)
    
    // Clean up event listener
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])
  
  return breakpoint
}

export function useBreakpointValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  largeDesktop?: T;
  default: T;
}): T {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile' && values.mobile !== undefined) {
    return values.mobile;
  }
  if (breakpoint === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  if (breakpoint === 'desktop' && values.desktop !== undefined) {
    return values.desktop;
  }
  if (breakpoint === 'large-desktop' && values.largeDesktop !== undefined) {
    return values.largeDesktop;
  }
  
  return values.default;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);
  
  return matches;
}
