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

  public size?: number;
  private history?: BoardHistory;
  private historyId?: number;

  constructor(private httpService: HttpService, private settingsService: SettingsService
    ,private logger: LoggerService) { }

  public updateSize(value: number){
    this.size = value;
    this.history = undefined;
    this.historyId = undefined;
  }

  public async solve(){
    let solution: Board = await this.findSolution();
    
    if (!solution || !this._grid) return;

    this.history = this.createHistory(solution.board, solution.board, this.historyId);
    this._grid.matrix = solution.board;
  }

  public async hint() {
    let solution: Board = await this.findSolution();

    if (!solution || !this._grid) return;

    const hint = this.findHint(this._grid.matrix, solution.board);
    this._grid.updateCell(hint);

    this.history = this.createHistory(this._grid.matrix, solution.board, this.historyId);
  }

  private async findSolution() : Promise<Board> {
    let solution: Board;
    if (!this.history || !this.history.solution || this.historyId === undefined){
      solution = await this.solveBoard();
    }
    else
      solution = { board: this.history.solution };
    
    return solution;
  }

  private async solveBoard(){
    this.logger.info(this._grid?.print());

    if (!this._grid || !this._grid.matrix) 
      return {
        board: []
      };

    const matrix = this._grid.matrix;
    return await lastValueFrom(this.httpService.solveGrid({board: matrix}));
  }

  private createHistory(board: number[][], solution: number[][], id?: number) : BoardHistory{
    const history: BoardHistory = {
      board: board,
      solution: solution
    }

    this.historyId = this.settingsService.saveHistory(history, id);

    return history;
  }

  private findHint(board: number[][], solution: number[][]) : Cell | undefined {
    const noSolutionCell : Cell[] = 
      ([] as Cell[]).concat(... 
        board.map((row,y) => row.map((value,x) => {return {x: x, y: y, value: value}}))
      )
      .filter(
        cell => !cell.value
      );

    if (noSolutionCell.length == 0)
      return;

    const random = Math.floor(Math.random() * noSolutionCell.length);
    const cellHint = noSolutionCell[random];

    return {
      x: cellHint.x,
      y: cellHint.y,
      value: solution[cellHint.y][cellHint.x]
    }
  }
}
