export default function events() {
  const listeners = {}

  return {
    on(event, func) {
      if (!listeners[event]) {
        listeners[event] = []
      }

      listeners[event].push(func)
    },
    emit(event, ...data) {
      if (listeners[event]) {
        listeners[event].forEach(func => func(...data))
      }
    }
  }
}