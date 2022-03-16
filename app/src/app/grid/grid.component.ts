import { Component, Input, OnInit } from '@angular/core';
import { CellContent } from '../cell/cell.component';

export interface Size{
  width: number,
  height: number
}

export interface DefaultSize{
  [size: number] : Size
}

@Component({
  selector: 'sudoku-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

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

  private _size: Size = {
    width: 9,
    height: 9
  };
  private _sectionSize: Size = {
    width: 3,
    height: 3
  };

  private _matrix : CellContent[][] = [];
  private _sections : CellContent[][][][] = [];

  @Input() public size: number = 9;
  @Input() public sectionSize: string | undefined;

  public get cellMatrix(): CellContent[][] {
    return this._matrix;
  }

  public get cellSections(): CellContent[][][][] {
    return this._sections;
  }

  public get matrix(): number[][] {
    return this.numberMatrix();
  }

  public get maxValue(): number {
    return this._size.height;
  }

  constructor() { }

  ngOnInit(): void {
    let inputSize = { height: this.size, width: this.size };
    let inputSectionSize = this.convertSectionSize(this.size, this.sectionSize);

    this._size = this.validateInput(inputSize) ? inputSize : this._size;
    this._sectionSize = this.validateInput(inputSectionSize, this._size) ? inputSectionSize : this.defaultSectionSize[this._size.width];
    
    this._matrix = this.createMatrix(this._size);
    this._sections = this.createMatrix(
      {
        height: this._size.height / this._sectionSize.height, 
        width: this._size.width / this._sectionSize.width
      }, 
      (x,y) => {
        return this.createMatrix(
          this._sectionSize, 
          (_x, _y) => {
            return this._matrix[_x + x * this._sectionSize.width][_y + y * this._sectionSize.height]
          }
        )
      }
    )
  }

  private createMatrix(size: Size, map?: (x: number, y: number) => any) : any[][]{
    let _map = map ? map : (x: number, y: number) => {
      return {
        value: undefined,
        x: x,
        y: y
      };
    };

    return Array(size.height)
      .fill(undefined)
      .map((ignored, y) => Array(size.width)
        .fill(undefined)
        .map( (ignored, x) => _map(x, y))
      );
  }

  public print(){
    console.log(this.printMatrix(), this.matrix);
    this._sections.forEach( row => row.forEach( section => 
      console.log(this.printMatrix(section))
    ) );
  }

  private printMatrix(matrix?: CellContent[][]) :string {
    const _matrix = this.numberMatrix(matrix);
    return _matrix.map( row => row.join(' ')).join('\n');
  }

  private numberMatrix(matrix?: CellContent[][]): number[][]{
    const _matrix = matrix || this._matrix;
    return _matrix.map( row => row.map( elem => elem.value || 0) );
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

}
