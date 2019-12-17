const storage = window.localStorage;

export function getObject<T>(key: string): T | undefined {
    const data = storage.getItem(key);
    if (!data) {
        return undefined;
    }
    return JSON.parse(data) as T;
}
export function setObject<T>(key: string, value: T): void {
    const obj = JSON.stringify(value);
    storage.setItem(key, obj);
}

export function remove(key: string): void {
    storage.removeItem(key);
}
