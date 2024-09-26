import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { TaskApiService } from 'src/service/task.api.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { DeskService } from 'src/service/desk.service';

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
        this._backLogTasks = tasks.filter(task => task.state === this._taskStates.BackLog);
        this._inDevTasks = tasks.filter(task => task.state === this._taskStates.InDev);
        this._testingTasks = tasks.filter(task => task.state === this._taskStates.Testing);
        this._doneTasks = tasks.filter(tasks => tasks.state === this._taskStates.Done);
    }

    private sortTasksArrays() {
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
    public deskStash: DeskContainer = {} as DeskContainer;

    constructor(
        private _taskApiService: TaskApiService,
        private _dialog: MatDialog,
        private _deskService: DeskService
    ) {}

    ngOnInit(): void {
        this._taskApiService.getTasks()
        .subscribe({
            next: (tasks) => {
            this.deskStash = new DeskContainer(tasks);
        },
            error: (err) => {
                console.log(err);
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

            this._deskService.handleTaskStateChange(targetTask, newState);
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
        console.log('testing');
        this._deskService.exportToExcel();
    }
}
