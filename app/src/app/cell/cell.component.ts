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
  @Input() maxValue: number = 6;

  constructor() { }

  ngOnInit(): void {
  }

  public onChange(event: Event) : number | undefined {
    const target = event.target as HTMLInputElement;

    if (!target.value)
      return undefined;
    else
      target.value = this.validValue(Number(target.value)) ? target.value : String(this.content.value);
    
    return Number(target.value);
  }

  private validValue(value: number){
    return value > 0 && value <= this.maxValue;
  }

}
