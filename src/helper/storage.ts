class Storage {
  static set(name: string, data: any): void {
    localStorage.setItem(name, JSON.stringify(data));
  }
  static get(name: string): any {
    const data: any = localStorage.getItem(name);

    return JSON.parse(data);
  }
  static clear(): void {
    localStorage.clear();
  }
}

export default Storage;
