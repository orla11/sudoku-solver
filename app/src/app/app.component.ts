import { Component, ViewChild } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { lastValueFrom } from 'rxjs';
import { HttpService } from './services/http.service';
import { Board, BoardHistory, Cell } from './interfaces/grid';
import { LocalStorageService } from './services/local-storage.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  @ViewChild(GridComponent, { static: false }) private _grid?: GridComponent;
  private static readonly GROUP: string = 'history';

  public size?: number;
  public history?: BoardHistory;

  constructor(private httpService: HttpService, private localStorageService: LocalStorageService, private logger: LoggerService) { }

  public async solve(){
    this.logger.info(this._grid?.print(), this._grid?.matrix);

    if (!this._grid || !this._grid.matrix) return;

    const matrix = this._grid.matrix;
    const id = this.getHistoryId(matrix);

    const history = this.localStorageService.getStoredObj<BoardHistory>(id, AppComponent.GROUP);
    if (history){
      this.history = history;
      for(let [index, hint] of this.history.hints.entries()){
        if (index > history.step) break;
        this._grid.updateCell(hint);
      }
      return;
    }
    
    const board: Board = await lastValueFrom(this.httpService.solveGrid({board: matrix}));
    if (!board) return;

    this.history = this.createHistory(id, matrix, board.board);
    this._grid.matrix = board.board;
  }

  private getHistoryId(matrix: number[][]){
    const cells = matrix.map( row => row.map(value => String(value))).join('');
    return parseInt(cells).toString(16);
  }

  private createHistory(id: string, grid: number[][], solution: number[][]) : BoardHistory{
    const history: BoardHistory = {
      step: solution.length * solution[0].length, //TODO: calcolare dimensione senza start
      start: [],
      hints: [] //TODO: non aggiungere elementi in start
    };

    history.start = history.start.concat(
      ...grid
        .map( (row,y) => 
          row.map( (value,x) : Cell => {
            return {
              x: x,
              y: y,
              value: value
            };
          })
          .filter( cell => cell.value)
        )
    );

    const copy = JSON.parse(JSON.stringify(solution));
    let hint = this.extractHint(copy);
    while(hint){
      history.hints.push(hint);
      hint = this.extractHint(copy);
    }

    this.localStorageService.setStoredObjWithGroup(AppComponent.GROUP,id, history);

    return history;
  }

  //TODO: non aggiungere elementi presenti in start
  private extractHint(matrix: number[][]) : Cell | undefined {
    if (matrix.length == 0) return;

    const y = Math.floor(Math.random() * matrix.length);
    
    if (!matrix[y] || matrix[y].length == 0){
      matrix.splice(y,1);
      return;
    }

    const x = Math.floor(Math.random() * matrix[y].length);
    const value = matrix[y][x];
    matrix[y].splice(x,1);

    return {
      x: x,
      y: y,
      value: value
    };
  }
}
