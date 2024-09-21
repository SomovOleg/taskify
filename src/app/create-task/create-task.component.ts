import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
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
    ) {}

    public minimalAvailableDate = new Date();
    public isLoading = false;

    public nameOfTask: string;
    public descriptionOfTask: string;
    public deadlineOn: Date = new Date();

    createTask() {
        this.isLoading = true;
        if(!this.nameOfTask || !this.descriptionOfTask || !this.deadlineOn) {
            this.isLoading = !this.isLoading
            this._matSnackBar.open('Error on creating task!', 'OK', { duration: 5000 });
            return;
        }

        this._taskApiSerivce
            .createNewTask(this.nameOfTask, this.descriptionOfTask, this.deadlineOn)
            .pipe(finalize(() =>  this.isLoading = false ))
            .subscribe({
                next:() => {
                    this._matSnackBar.open('The task was successfully created and was added to backlog!', 'OK', { duration: 5000 });
                    this.nameOfTask = '';
                    this.descriptionOfTask = '';
                    this.deadlineOn = new Date();
                },
                error:() => {
                    this._matSnackBar.open('Error on creating task!', 'OK', { duration: 5000 });
                }
            })
    }
}
