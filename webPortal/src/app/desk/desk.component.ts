import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { TaskApiService } from 'src/service/task.api.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { DeskService } from 'src/service/desk.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, Subscription } from 'rxjs';
import { MenuEventsService } from 'src/service/menu-events.service';

class DeskContainer {
    public get backLog() {
        return this._backLogTasks;
    }

    public get inDev() {
        return this._inDevTasks;
    }

    public get testing() {
        return this._testingTasks;
    }

    public get done() {
        return this._doneTasks;
    }

    private _backLogTasks: TaskInterface[] = [];
    private _inDevTasks: TaskInterface[] = [];
    private _testingTasks: TaskInterface[] = [];
    private _doneTasks: TaskInterface[] = [];

    private _taskStates = TaskState;

    constructor(tasks: TaskInterface[]) {
        this.showAllTasks(tasks);
        this.sortTasksArrays();
    }

    showAllTasks(tasks: TaskInterface[]) {
        tasks.forEach((task) =>{
            switch(task.state) {
                case(this._taskStates.BackLog):
                    this._backLogTasks.push(task);
                    return;
                case(this._taskStates.InDev):
                    this._inDevTasks.push(task);
                    return;
                case (this._taskStates.Testing):
                    this._testingTasks.push(task);
                    return;
                case (this._taskStates.Done):
                    this._doneTasks.push(task);
                    return;
                }
            })
    }

    public sortTasksArrays() {
        this._backLogTasks.sort(this.sortByTimestamp);
        this._inDevTasks.sort(this.sortByTimestamp);
        this.testing.sort(this.sortByTimestamp);
        this._doneTasks.sort(this.sortByTimestamp);
    }

    sortByTimestamp(a: TaskInterface, b: TaskInterface) {
        if(a.deadlineOn.seconds < b.deadlineOn.seconds) {
            return -1;
        } else if (a.deadlineOn.seconds > b.deadlineOn.seconds) {
            return 1
        }

        return 0;
    }
}

@Component({
    selector: 'app-desk',
    templateUrl: './desk.component.html',
    styleUrls: ['./desk.component.scss']
})
export class DeskComponent implements OnInit {
    public isLoading = true
    public deskStash: DeskContainer;
    private _subscriptions = new Subscription();

    constructor(
        private _taskApiService: TaskApiService,
        private _dialog: MatDialog,
        private _deskService: DeskService,
        private _snackBarService: MatSnackBar,
        private _menuEvents: MenuEventsService
    ) {}

    ngOnInit(): void {
        this.loadData();

        this._subscriptions.add(this._menuEvents.desk$.subscribe(() => this.loadData()))
    }

    private loadData() {
        this.deskStash = null;
        this._taskApiService.getTask()
        .subscribe({
            next: (tasks) => {
                this.deskStash = new DeskContainer(tasks);
        },
            error: () => {
                this._snackBarService.open(`An error was occured!`, 'OK', { duration: 5000 });
            }
        })
    }

    public updateTaskState(event: CdkDragDrop<TaskInterface[]>) {
        if(event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
              );

            const targetTask = event.item.data;
            const newState = Number(event.container.id);

            this._deskService.handleTaskStateChange(targetTask, newState)
            .pipe(finalize(() => this.deskStash.sortTasksArrays()))
            .subscribe({
                error: () => {
                    this._snackBarService.open(`An error was occured!`, 'OK', { duration: 5000 });
                }
            });
        }
    }

    public taskDialogOpen(targetTask: TaskInterface) {
        this._dialog.open(TaskDialogComponent, {
            data: { taskInfo: targetTask },
            height: '400px',
            width: '600px',
          })
    }

    public exportToExcel() {
        this._deskService.exportToExcel();
    }
}
