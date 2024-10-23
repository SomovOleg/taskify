import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskState } from 'interfaces/task.interface';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { MenuEventsService } from 'src/service/menu-events.service';
import { TaskApiService } from 'src/service/task.api.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent {

    constructor(
        private _taskApiSerivce: TaskApiService,
        private _matSnackBar: MatSnackBar,
        private _authService: AuthService,
        private _menuEvents: MenuEventsService,
    ) {
        this._subscriptions.add(this._menuEvents.desk$.subscribe(() => this.createTask()));
    }

    private _subscriptions = new Subscription();

    public minimalAvailableDate = new Date();
    public isLoading = false;

    public nameOfTask: string;
    public descriptionOfTask: string;
    public deadlineOn: Date = new Date();

    createTask() {
        this.isLoading = true;
        this._taskApiSerivce.createTask({
            name: this.nameOfTask,
            desc: this.descriptionOfTask,
            deadlineOn: Timestamp.fromDate(this.deadlineOn),
            createdOn: Timestamp.fromDate(new Date()),
            creatorId: this._authService.user.uid,
            state: TaskState.BackLog
        })
        .pipe(finalize(() => this.isLoading = !this.isLoading))
        .subscribe({
            next: () => {
                this._matSnackBar.open('Task was create successfully!', 'OK', {duration: 5000});
                this.nameOfTask = '';
                this.descriptionOfTask = '';
                this.deadlineOn = new Date();
            },
            error: () => {
                this._matSnackBar.open('Error on creating task!', 'OK', {duration: 5000});
            }
        })
    }
}

export interface TaskForm {
    name: string,
    desc: string,
    creatorId: string,
    createdOn: Timestamp,
    deadlineOn: Timestamp,
    state: TaskState

}
