declare function requireAll<T>(dir: string, filter: (fileName: string) => Record<string, unknown>): T[];
export default requireAll;
