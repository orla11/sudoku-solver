import { Component, Input, OnInit } from '@angular/core';
import { Cell } from '../interfaces/grid';

@Component({
  selector: 'sudoku-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, Cell {

  @Input() public cell: Cell = { x: 0, y: 0 };
  @Input() public maxValue?: number;

  public get x(): number{
    return this.cell.x; 
  }

  public get y(): number{
    return this.cell.y;
  }

  public get value(): number | undefined{
    return this.cell.value; 
  }

  constructor() { }

  ngOnInit(): void {
  }

  public onChange(event: Event) : number | undefined {
    const target = event.target as HTMLInputElement;
    
    if (target.value)
      target.value = this.validValue(Number(target.value)) ? target.value : String(this.cell.value);
    
    return ![undefined,null,''].includes(target.value) ? Number(target.value) : undefined;
  }

  private validValue(value: number){
    return value > 0 && (!this.maxValue || value <= this.maxValue);
  }

}
