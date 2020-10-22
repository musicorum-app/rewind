declare class Quaternion {
  constructor(w: number, x: number, y: number, z: number) {
  }

  conjugate(): Quaternion

  toMatrix4(): number[]
}

declare module 'quaternion' {
  export = Quaternion
}