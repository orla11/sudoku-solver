import { Injectable } from '@angular/core';

export class LoaderController {
  private _count: number = 0;
  public get count(): number {
    return this._count;
  }
  public forceShow: boolean = false;
  public get showing(): boolean {
    return this._count != 0 || this.forceShow;
  }

  constructor() {}

  public inc(){
    this._count++;
  }

  public dec(){
    this._count = this._count == 0 ? 0 : this._count - 1;
  }

  public reset(){
    this._count = 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private DEFAULT_LVL: string = 'base';
  private levelMap: Map<string, LoaderController[]> = new Map();

  constructor() { }

  public registerController(level?: string | string[]) :LoaderController{
    let controller = new LoaderController();

    level = level || this.DEFAULT_LVL;
    if (typeof level == 'string')
      this._registerController(level, controller);
    else
      level.forEach(lvl => this._registerController(lvl, controller));

    return controller;
  }

  private _registerController(level: string, controller: LoaderController){
    if (!this.levelMap.has(level))
      this.levelMap.set(level,[]);
    
    const controllers = this.levelMap.get(level);
    if (controllers && controllers.indexOf(controller) == -1)
      controllers.push(controller);
  }

  public unregisterController(controller: LoaderController, level?: string | string[]){
    level = level || this.DEFAULT_LVL;
    if (typeof level == 'string')
      this._unregisterController(level, controller);
    else
      level.forEach(lvl => this._unregisterController(lvl, controller));
  }

  private _unregisterController(level: string, controller: LoaderController){
    if (!this.levelMap.has(level)) return;

    const controllers = this.levelMap.get(level);
    const pos = controllers ? controllers.indexOf(controller) : -1;
    if (controllers && pos != -1)
      controllers.splice(pos,1);
    if (controllers && controllers.length == 0)
      this.levelMap.delete(level);
  }

  public inc(level?:string){
    level = level || this.DEFAULT_LVL;
    if (!this.levelMap.has(level)) return;
    this.levelMap.get(level)?.forEach( controller => controller.inc());
  }

  public dec(level?:string){
    level = level || this.DEFAULT_LVL;
    if (!this.levelMap.has(level)) return;
    this.levelMap.get(level)?.forEach( controller => controller.dec());
  }
}
