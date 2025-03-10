import { useEffect, RefObject } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  handler: ShortcutHandler;
}

// Detect platform for showing appropriate tooltip text
export const isMac = typeof navigator !== 'undefined' ? /Mac|iPod|iPhone|iPad/.test(navigator.platform) : false;

export function getShortcutDisplay(shortcut: Pick<KeyboardShortcut, 'key' | 'ctrlKey' | 'metaKey'>): string {
  const modifierKey = isMac ? '⌘' : 'Ctrl';
  const needsModifier = shortcut.ctrlKey || shortcut.metaKey;
  
  // Special case for the period key - show it as ">"
  const displayKey = shortcut.key === '.' ? '>' : shortcut.key;
  
  if (!needsModifier) return displayKey;
  return `${modifierKey} + ${displayKey}`;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  targetRef?: RefObject<HTMLElement>
) {
  useEffect(() => {
    const handleKeyDown = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      for (const shortcut of shortcuts) {
        const keyMatch = keyEvent.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? keyEvent.ctrlKey : true;
        const metaMatch = shortcut.metaKey ? keyEvent.metaKey : true;
        
        if (keyMatch && ctrlMatch && metaMatch) {
          shortcut.handler(keyEvent);
          keyEvent.preventDefault();
          break;
        }
      }
    };

    // If a target ref is provided, attach event to that element
    // Otherwise attach to the document
    const target = targetRef?.current || document;
    target.addEventListener('keydown', handleKeyDown);
    
    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, targetRef]);
}