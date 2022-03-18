import { Injectable } from '@angular/core';
import { BoardHistory, Settings } from '../interfaces/settings';
import { LocalStorageService } from './local-storage.service';
import { SnackService } from './snack.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly SETTINGS_KEY = 'settings';
  private readonly MAX_HISTORY_LENGTH = 3;
  private settings: Settings;

  constructor(private localStorageService: LocalStorageService, private snackbarService: SnackService) {
    this.settings = this.localStorageService.getStoredObj<Settings>(this.SETTINGS_KEY) 
      || {
        overwriteHistory: false
      };
  }

  public get saveEnabled() :boolean{
    return  this.settings.overwriteHistory
            ||
            (this.settings.historyIndex || 0) < this.MAX_HISTORY_LENGTH - 1;
  }

  public get history(): BoardHistory[] {
    return this.settings.history || [];
  }

  public saveHistory(boardHistory: BoardHistory){
    if (!this.saveEnabled) {
      this.snackbarService.showSnack('Cannot save history, max length reached');
      return;
    }

    this.settings.historyIndex = (
          (this.settings.historyIndex === undefined ? -1 : this.settings.historyIndex) 
          + 1
        ) % this.MAX_HISTORY_LENGTH;
    this.settings.history = this.settings.history || [];
    this.settings.history.splice(this.settings.historyIndex, 1, boardHistory);

    this.localStorageService.setStoredObj(this.SETTINGS_KEY, this.settings);
  }
}
