import { Component, ViewChild } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { lastValueFrom } from 'rxjs';
import { HttpService } from './services/http.service';
import { Board } from './interfaces/grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  @ViewChild(GridComponent, { static: false }) private _grid?: GridComponent;

  public size?: number;

  constructor(public httpService: HttpService) { }

  public async solve(){
    console.log(this._grid?.print(), this._grid?.matrix);

    if (!this._grid || !this._grid.matrix) return;

    const matrix = this._grid.matrix;
    lastValueFrom(this.httpService.solveGrid({board: matrix}))
      .then((board : Board) => {
        if (this._grid && board)
          this._grid.matrix = board.board;
      });
  }

}
