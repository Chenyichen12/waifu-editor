interface rect {
    width: number
    height: number
    top: number
    left: number
}

interface Assert{
    r: rect
    pixMap: Uint8ClampedArray
}

const ProjectAsserts = new Array<Assert>();
export default ProjectAsserts
export type {Assert,rect}