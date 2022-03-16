import { Component, Input, OnInit } from '@angular/core';
import { Cell } from '../cell/cell.component';
import { Size } from '../grid/grid.component';

export interface Section extends Size{
  matrix: Cell[][]
}

@Component({
  selector: 'sudoku-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, Section {

  @Input() public matrix: Cell[][] = [];

  public get width(): number{
    return this.matrix.length;
  }
  
  public get height(): number{
    return this.matrix.length > 0 && this.matrix[0] ? this.matrix[0].length : 0;
  }

  public get maxValue(): number {
    return this.matrix.length > 0 && this.matrix[0] ? 
      this.matrix.length * this.matrix[0].length
      : 0;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
