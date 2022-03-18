import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DefaultSize, Grid, Size, Section, Cell, Coordinate } from '../../interfaces/grid';

@Component({
  selector: 'sudoku-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges, Grid {

  private defaultSectionSize: DefaultSize = {
    6: {
      width: 3,
      height: 2
    },
    9: {
      width: 3,
      height: 3
    },
    16: {
      width: 4,
      height: 4
    }
  }

  private _sectionSize: Size = {
    width: 3,
    height: 3
  };

  private _width: number = 9;
  private _height: number = 9;
  private _matrix : Cell[][] = [];
  private _sections : Section[][] = [];

  @Input() public size: number = 9;
  @Input() public sectionSize: string | undefined;

  public get width(): number{
    return this._width;
  }

  public get height(): number{
    return this._height;
  }
  
  public get matrix(): number[][] {
    return this.numberMatrix();
  }

  public set matrix(matrix: number[][]) {
    this.updateMatrix(matrix);
  }

  public get sections(): Section[][] {
    return this._sections;
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const change = ['size','sectionSize'].some( key => 
        changes[key] 
        && !changes[key].firstChange 
        && changes[key].previousValue != changes[key].currentValue
      );
    
    if(change)
      this.ngOnInit();
  }

  ngOnInit(): void {
    let inputSize = { height: this.size, width: this.size };
    let inputSectionSize = this.convertSectionSize(this.size, this.sectionSize);

    if(this.validateInput(inputSize)) {
      this._width = inputSize.width;
      this._height = inputSize.height;
    }
    this._sectionSize = this.validateInput(inputSectionSize, this) ? inputSectionSize : this.defaultSectionSize[this.width];
    
    this._matrix = this.createMatrix(this);
    this._sections = this.createMatrix(
      {
        height: this.height / this._sectionSize.height, 
        width: this.width / this._sectionSize.width
      }, 
      (x,y) : Section => {
        const offsetX = x * this._sectionSize.width;
        const offsetY = y * this._sectionSize.height;
        return {
          x: x,
          y: y,
          width: this._sectionSize.width,
          height: this._sectionSize.height,
          matrix: this.createMatrix<Cell>(
            this._sectionSize, 
            (_x, _y) => {
              const indexX = _x + offsetX;
              const indexY = _y + offsetY;
              return this._matrix[indexY][indexX];
            }
          )
        }
      }
    )
  }

  public print() : string {
    return this.printMatrix();
  }

  public printMatrix(matrix?: Cell[][]) :string {
    const _matrix = this.numberMatrix(matrix);
    return _matrix.map( row => row.join(' ')).join('\n');
  }

  public numberMatrix(matrix?: Cell[][]): number[][]{
    const _matrix = matrix || this._matrix;
    return _matrix.map( row => row.map( elem => elem.value || 0) );
  }

  public updateCell(input: Cell){
    const found = ([] as Cell[]).concat(... this._matrix)
      .find( cell => cell.x === input.x && cell.y === input.y);
    
    if (found)
      found.value = input.value;
  }

  private createMatrix<T extends Coordinate>(size: Size, map?: (x: number, y: number) => T) : T[][]{
    let _map = map ? map : (x: number, y: number) : T => {
      return {
        x: x,
        y: y
      } as unknown as T;
    };

    return Array(size.height)
      .fill(undefined)
      .map((ignored, y) => Array(size.width)
        .fill(undefined)
        .map( (ignored, x) => _map(x, y))
      );
  }

  private validateInput(value: Size, container?: Size) : boolean {
    let result = false;
    // Se passo un container verifico che sia contenuto nel container
    if (container) {
      result = container.height % value.height  === 0 
      && 
      container.width % value.width === 0;
    }
    // se non passo il container allora é la validazione del container stesso
    // che deve essere un quadrato di dimensioni 6,9,16
    else{
      result = value.height === value.width 
      && 
      [6,9,16].includes(value.height);
    }

    if (!result)
      console.error(`Input validation error: size=${JSON.stringify(value)}, container=${JSON.stringify(container)}`, value, container);
    
    return result;
  }

  private convertSectionSize(gridSize: number, value?: string) : Size{
    if (value && new RegExp('^\s*[0-9]{1,2}\s*x\s*[0-9]{1,2}\s*$').test(value)){
      let split = value
        .replace(new RegExp('\s'), '')
        .split(new RegExp('[x,X]'));
      
      return {
        width: Number(split[1]),
        height: Number(split[0])
      }
    }

    return this.defaultSectionSize[gridSize] || this._sectionSize;
  }

  private updateMatrix(matrix: number[][]) {
    if (!this._matrix) return;
    
    const height = matrix ? matrix.length : 0;
    const width = matrix && matrix.length > 0 && matrix[0] ? matrix[0].length : 0;

    if (this.height != height || this.width != width) return;

    if (this._matrix
      .every(row => 
        row
          .filter(cell => cell.value)
          .every(cell => cell.value === matrix[cell.y][cell.x])
        )
      )
      this._matrix.forEach( row => row.forEach( cell => cell.value = matrix[cell.y][cell.x] ))
  }
}
