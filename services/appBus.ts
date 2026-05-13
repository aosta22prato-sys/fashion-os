/**
 * Global Event Bus for Fashion OS
 * Enables cross-module communication and high-privilege actions.
 */

type AppEvent = 
  | { type: 'PUSH_TO_GALLERY'; data: any }
  | { type: 'PUSH_TO_SYNTHESIS'; data: any }
  | { type: 'PUSH_TO_LABORATORY'; data: any }
  | { type: 'SHOW_HUB'; data: any }
  | { type: 'UPDATE_QUEUE'; data: { id: string, progress: number, status: string } };

class AppBus {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  emit(event: AppEvent) {
    const listeners = this.listeners[event.type] || [];
    listeners.forEach(fn => fn(event.data));
    
    // Also emit as native window event for legacy/non-react parts
    window.dispatchEvent(new CustomEvent(`fos:${event.type}`, { detail: event.data }));
  }

  on(type: AppEvent['type'], callback: (data: any) => void) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(callback);
    return () => {
      this.listeners[type] = this.listeners[type].filter(fn => fn !== callback);
    };
  }
}

export const appBus = new AppBus();
