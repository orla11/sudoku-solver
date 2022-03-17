import { Component, Input, OnInit } from '@angular/core';
import { Section, Cell } from '../interfaces/grid';

@Component({
  selector: 'sudoku-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, Section {

  @Input() public section: Section = 
  {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    matrix: []
  };

  public get matrix(): Cell[][] {
    return this.section.matrix;
  }

  public get x() {
    return this.section.x;
  }

  public get y() {
    return this.section.y;
  }

  public get width(): number {
    return this.section.width;
  }
  
  public get height(): number {
    return this.section.height;
  }
  
  public get maxValue(): number {
    return this.width * this.height;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
