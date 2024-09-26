import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { finalize, take } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import { TaskDeleteDialogComponent } from '../task-delete-dialog/task-delete-dialog.component';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

    public taskInfo: TaskInterface;
    public creatorName: string;
    public isLoading: boolean;

    public taskState = TaskState;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: { taskInfo: TaskInterface },
        private _authService: AuthService,
        private _matDialog: MatDialog
    ) {
        this.taskInfo = data.taskInfo;
        this.isLoading = true;
    }

    checkDoneState() {
        if(this.taskInfo.state === TaskState.Done) {
            return true
        }
        return false;
    }

    checkDeleteState() {
        if(this.taskInfo.state === TaskState.Done || this.taskInfo.state === TaskState.BackLog) {
            return true;
        }
        return false;
    }

    ngOnInit(): void {
        this._authService.getUserInfo(this.taskInfo.creatorId)
        .pipe(take(1), finalize(() => { this.isLoading = false} ))
            .subscribe({
                next:(userInfo) => {
                    this.creatorName = userInfo.firstName + ' ' + userInfo.lastName;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    openDeleteTaskDialog(targetTaskId: string) {
        this._matDialog.open(TaskDeleteDialogComponent, {
            data: { taskId: targetTaskId }
        });
    }

    closeDialog() {
        this._matDialog.closeAll();
    }
}
