import { Component, OnInit } from '@angular/core';
import { DeskService } from 'src/service/desk.service';
import { TaskApiService } from 'src/service/task.api.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
    public sideNavState = false;
    public currentTab = 0;

    constructor(public taskApiService: TaskApiService, private _desk: DeskService) {}

    changeSideNavState() {
        this.sideNavState = !this.sideNavState;
    }

    changeTab(targetTab: number) {
        this.currentTab = targetTab
    }

    exportToExcel() {
        this._desk.exportToExcel();
    }
}
