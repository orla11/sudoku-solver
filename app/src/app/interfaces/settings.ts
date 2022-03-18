export interface BoardHistory{
    board: number[][]
    solution: number[][]
}

export interface Settings {
    historyIndex?: number
    overwriteHistory?: boolean
    history?: BoardHistory[]
}