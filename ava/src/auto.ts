// TODO
export type AutoOptions = Record<string, any>;

// TODO
export function Auto(options: AutoOptions) {
  return { type: "interval", ...options };
}
