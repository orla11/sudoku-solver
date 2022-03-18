import { Component, Input, OnInit } from '@angular/core';
import { BoardHistory } from 'src/app/interfaces/settings';

@Component({
  selector: 'board-history',
  templateUrl: './board-history.component.html',
  styleUrls: ['./board-history.component.scss']
})
export class BoardHistoryComponent implements OnInit {

  @Input() public boardHistory: BoardHistory | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
