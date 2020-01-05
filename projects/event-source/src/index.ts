export type EventSourceListener<Args extends any[] = []> = (...args: Args) => void;

export class EventSource<Args extends any[] = []> {
    private listeners = new Set<EventSourceListener<Args>>();

    public addListener(listener: EventSourceListener<Args>) {
        this.listeners.add(listener);
        return this.removeListener.bind(this, listener);
    }

    public removeListener(listener: EventSourceListener<Args>) {
        this.listeners.delete(listener);
    }

    public hasListener(listener: EventSourceListener<Args>) {
        return this.listeners.has(listener);
    }

    public dispatch(...args: Args) {
        this.listeners.forEach((listener) => listener(...args));
    }
}
