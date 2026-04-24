'use client';

import { useSyncExternalStore } from 'react';

const useHash = () =>
  useSyncExternalStore(
    (callback) => {
      const notify = () => callback();

      window.addEventListener('hashchange', notify);
      window.addEventListener('popstate', notify);

      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        originalPushState.apply(this, args);
        notify();
      };

      window.history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        notify();
      };

      return () => {
        window.removeEventListener('hashchange', notify);
        window.removeEventListener('popstate', notify);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    },
    () =>
      typeof window !== 'undefined'
        ? window.location.hash.replace(/^#/, '')
        : '',
    () => '',
  );

export default useHash;
