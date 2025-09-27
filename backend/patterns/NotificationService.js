class NotificationService {
  constructor() { this.subscribers = {}; }

  subscribe(event, handler) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(handler);
  }

  notify(event, payload) {
    (this.subscribers[event] || []).forEach(fn => {
      try { fn(payload); } catch (err) { console.error('Notifier handler error', err); }
    });
  }
}

module.exports = new NotificationService();
