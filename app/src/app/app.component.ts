import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  @ViewChild(GridComponent, { static: false }) private _grid?: GridComponent;

  public size?: number;

  ngOnInit(): void {
    console.log(this._grid);
  }

  public solve(){
    console.log(this._grid?.print());
    console.log(this._grid?.matrix);
  }

}
