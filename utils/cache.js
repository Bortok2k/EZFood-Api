class SimpleCache {
    constructor() {
        this.store = new Map();
    }

    get(key, maxAgeMs) {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() - entry.time > maxAgeMs) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    set(key, value) {
        this.store.set(key, { value, time: Date.now() });
    }

    invalidate(key) {
        this.store.delete(key);
    }

    invalidatePrefix(prefix) {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }
}

module.exports = new SimpleCache();