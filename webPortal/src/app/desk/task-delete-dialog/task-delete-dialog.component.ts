import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { MenuEventsService } from 'src/service/menu-events.service';
import { TaskApiService } from 'src/service/task.api.service';

@Component({
  selector: 'app-task-delete-dialog',
  templateUrl: './task-delete-dialog.component.html',
  styleUrls: ['./task-delete-dialog.component.scss']
})

export class TaskDeleteDialogComponent {


    constructor(
        @Inject(MAT_DIALOG_DATA) private data : { taskId: string },
        private _taskApiService: TaskApiService,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        private _menuEventsService: MenuEventsService
    ) {}

    deleteTask() {
        this._taskApiService.deleteTask(this.data.taskId)
        .pipe(finalize(() => this._matDialog.closeAll()))
        .subscribe({
            next: () => {
                this._matSnackBar.open('Task was deleted successfully!', 'OK', { duration: 5000});
                this._menuEventsService.deskRefresh();
            },
            error: (err) => {
                this._matSnackBar.open("Error on deleting task!", 'OK', { duration: 5000});
            }
        });
    }
}
