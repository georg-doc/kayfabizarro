declare module 'cdt2d' {
  export default function cdt2d(points: [number, number][], edges?: [number, number][], opts?: { delaunay?: boolean; interior?: boolean; exterior?: boolean; infinity?: boolean }): [number, number, number][];
}
