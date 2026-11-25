const PREFIX = "iam95:";

export function save(name: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(value));
  } catch {
    // storage can be blocked or full: ignore it, the app still works
  }
}

export function load(name: string): unknown {
  try {
    const text = localStorage.getItem(PREFIX + name);
    if (text === null) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}