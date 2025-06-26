import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event?: MouseEvent | TouchEvent) => void,
  otherDependenceRef?: RefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!event.target || !ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      if (otherDependenceRef && otherDependenceRef.some((r) => r.current?.contains(event.target as Node))) {
        return;
      }

      handler(event);
    };

    const handleWindowBlur = () => {
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    window.addEventListener('blur', handleWindowBlur);

    // Cleanup the event listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [ref, handler, otherDependenceRef]);
}
