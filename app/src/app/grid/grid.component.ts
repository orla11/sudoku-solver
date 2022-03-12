import { Component, Input, OnInit } from '@angular/core';
import { CellContent } from '../cell/cell.component';

export interface Size{
  height: number,
  width: number
}

@Component({
  selector: 'sudoku-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() size: number = 9;
  @Input() sectionSize: string = "3x3";

  private _size: Size = {
    height: 9,
    width: 9
  };
  private _sectionSize: Size = {
    height: 3,
    width: 3
  }

  private _matrix : CellContent[][] = [];

  public get matrix(): CellContent[][] {
    return this._matrix;
  }

  constructor() { }

  ngOnInit(): void {
    let inputSize = { height: this.size, width: this.size };
    let inputSectionSize = this.convertSectionSize(this.sectionSize);

    this._size = this.validateInput(inputSize) ? inputSize : this._size;
    this._sectionSize = this.validateInput(inputSectionSize, this._size) ? inputSectionSize : this._sectionSize;
    
    this._matrix = Array(this._size.height)
      .fill(undefined)
      .map((row, x) => Array(this._size.width)
        .fill(undefined)
        .map( (value, y) => {
          return {
            value: value,
            x: x,
            y: y
          } 
        })
      );
  }

  public print(){
    console.log(this._matrix)
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

  private convertSectionSize(value?: string) : Size{
    if (value && new RegExp('^\s*[0-9]{1,2}\s*x\s*[0-9]{1,2}\s*$').test(value)){
      let split = value
        .replace(new RegExp('\s'), '')
        .split(new RegExp('[x,X]'));
      
      return {
        height: Number(split[0]),
        width: Number(split[1])
      }
    }

    return this._sectionSize;
  }

}
