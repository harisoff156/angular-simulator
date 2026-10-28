export class Collection<T> {
  private items: T[];

  constructor(source: T[]) {
    this.items = [...source];
  }

  getAll(): T[] {
    return [...this.items];
  }

  get(index: number): T | undefined {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      return undefined;
    }

    return this.items[index];
  }

  clear(): void {
    this.items = [];
  }

  remove(index: number): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  replace(index: number, item: T): boolean {
    if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
      return false;
    }

    this.items[index] = item;
    return true;
  }
}
