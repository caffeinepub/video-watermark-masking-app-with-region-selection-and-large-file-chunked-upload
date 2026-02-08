import { useState, useEffect } from 'react';

const ACCESS_SECRET_KEY = 'watermark_eraser_access_secret';
const EXPECTED_SECRET = 'watermark-access-2026';

export function useUnlistedAccess() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check sessionStorage first
    const storedSecret = sessionStorage.getItem(ACCESS_SECRET_KEY);
    
    if (storedSecret === EXPECTED_SECRET) {
      setIsUnlocked(true);
      setIsChecking(false);
      return;
    }

    // Check URL hash for secret
    const hash = window.location.hash;
    if (hash) {
      // Remove the # and parse
      const hashValue = hash.substring(1);
      
      if (hashValue === EXPECTED_SECRET) {
        // Store in session
        sessionStorage.setItem(ACCESS_SECRET_KEY, hashValue);
        setIsUnlocked(true);
        
        // Clear hash from URL without reload
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    
    setIsChecking(false);
  }, []);

  const getAccessSecret = (): string | null => {
    return sessionStorage.getItem(ACCESS_SECRET_KEY);
  };

  const clearAccess = () => {
    sessionStorage.removeItem(ACCESS_SECRET_KEY);
    setIsUnlocked(false);
  };

  return {
    isUnlocked,
    isChecking,
    getAccessSecret,
    clearAccess,
    lockedReason: isUnlocked ? null : 'This app is private. Please use a valid access link.',
  };
}
