import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
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

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, otherDependenceRef]);
}
