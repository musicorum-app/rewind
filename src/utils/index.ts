export function convertRange(value: number, r1: number[], r2: number[]): number {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

export function addToMap(items: string[], map: Map<string, any>) {
  for (let i of items) map.set(i, null)
}
