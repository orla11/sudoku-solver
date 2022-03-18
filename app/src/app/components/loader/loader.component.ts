import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { LoaderController, LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy, OnChanges {

  public controller: LoaderController;

  @Input() level: string | string[] | undefined;
  @Input() size: number = 50;
  @Input() color: string = '#7289DA';
  @Input() background: string = 'rgba(0, 0, 0, 0.5)';
  @Input('show') showing: boolean = false;

  constructor(private loadingService: LoadingService) {
    this.controller = this.loadingService.registerController(this.level);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.controller.forceShow = changes['showing']?.currentValue as boolean;
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.loadingService.unregisterController(this.controller, this.level);
  }

}
