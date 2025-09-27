class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    Logger.instance = this;
  }
  info(msg) { console.log('[INFO]', msg); }
  error(msg) { console.error('[ERROR]', msg); }
}

module.exports = new Logger();
