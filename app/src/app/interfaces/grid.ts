export interface Size{
    width: number
    height: number
}

export interface DefaultSize{
    [size: number] : Size
}

export interface Coordinate{
    x: number
    y: number
}

export interface Grid extends Size{
    matrix: number[][]
    sections: Section[][]
}

export interface Section extends Size, Coordinate{
    matrix: Cell[][]
}

export interface Cell extends Coordinate {
    value?: number
    maxValue?: number
}