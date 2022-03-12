import { Component, Input, OnInit } from '@angular/core';

export interface CellContent{
  x: number,
  y: number,
  value?: number
}

@Component({
  selector: 'sudoku-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() content: CellContent = { x: 0, y: 0 };

  constructor() { }

  ngOnInit(): void {
  }

}
