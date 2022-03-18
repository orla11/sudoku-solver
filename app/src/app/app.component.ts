import { Component, ViewChild } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { lastValueFrom } from 'rxjs';
import { HttpService } from './services/http.service';
import { Board, Cell } from './interfaces/grid';
import { BoardHistory } from './interfaces/settings';
import { LoggerService } from './services/logger.service';
import { SettingsService } from './services/settings.service';

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

  constructor(private httpService: HttpService, private settingsService: SettingsService
    , private logger: LoggerService) { }

  public async solve(){
    this.logger.info(this._grid?.print(), this._grid?.matrix);

    if (!this._grid || !this._grid.matrix) return;

    const matrix = this._grid.matrix;
    const board: Board = await lastValueFrom(this.httpService.solveGrid({board: matrix}));
    if (!board) return;

    this.history = this.createHistory(board.board, board.board);
    this._grid.matrix = board.board;
  }

  private createHistory(board: number[][], solution: number[][]) : BoardHistory{
    const history: BoardHistory = {
      board: board,
      solution: solution
    }

    this.settingsService.saveHistory(history);

    return history;
  }

  private extractHint(input: Cell[][]) : Cell | undefined {
    const matrix : Cell[][] = JSON.parse(JSON.stringify(
      input.filter( row => row.filter( cell => cell.value ).length > 0 )
    ));

    if (matrix.length == 0)
      return;

    const y = Math.floor(Math.random() * matrix.length);

    if (!matrix[y] || matrix[y].length == 0)
      return;

    const x = Math.floor(Math.random() * matrix[y].length);

    if (matrix[y][x] && matrix[y][x].value)
      return matrix[y][x];
    else
      return;
  }
}
