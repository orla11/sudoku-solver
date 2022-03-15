import { Component, Input, OnInit } from '@angular/core';
import { CellContent } from '../cell/cell.component';

@Component({
  selector: 'sudoku-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  @Input() public matrix: CellContent[][] = [];

  public get maxValue(): number {
    return this.matrix.length > 0 ? 
      this.matrix.length * this.matrix[0].length
      : 0; 
  }

  constructor() { }

  ngOnInit(): void {
  }

}
