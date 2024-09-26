import { Component, Inject } from '@angular/core';
import { addDoc, collection, getFirestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { TaskApiService } from 'src/service/task.api.service';


interface TaskDelete {
    _targetTaskId: string,
    deleteTask(): void
}

class ConcreteTaskDelete implements TaskDelete {
    public _targetTaskId: string

    constructor(
        protected _taskId: string,
        private _taskApiService: TaskApiService,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    ) {
        this._targetTaskId = _taskId;
    }


    deleteTask() {
        this._taskApiService.deleteTask(this._targetTaskId)
        .pipe(finalize(() => this._matDialog.closeAll()))
        .subscribe({
            next: () => this._matSnackBar.open('Task was deleted successfully!', 'OK', { duration: 5000}),
            error: (err) => {
                this._matSnackBar.open("Error on deleting task!", 'OK', { duration: 5000});
                console.log(err);
            }
        });
    }
}

class TaskDeleteDecorator implements TaskDelete {
    protected concreteTaskDelete: TaskDelete;
    public _targetTaskId: string;

    constructor(component: TaskDelete) {
        this.concreteTaskDelete = component;
        this._targetTaskId = this.concreteTaskDelete._targetTaskId;
    }

    deleteTask(): void {
        this.concreteTaskDelete.deleteTask();
    }
}

class LogTaskDeleteDecorator extends TaskDeleteDecorator {
    override deleteTask(): void {
        const db = getFirestore();
        const setDoc = addDoc(collection(db, "DeleteLogs"), {
            taskId: this._targetTaskId,
            DeletedDate: new Date()
        })
        this.concreteTaskDelete.deleteTask();
    }
}

@Component({
  selector: 'app-task-delete-dialog',
  templateUrl: './task-delete-dialog.component.html',
  styleUrls: ['./task-delete-dialog.component.scss']
})

export class TaskDeleteDialogComponent {

    private _taskDeleteComponent: TaskDelete;
    private _taskDeleteDecorator: TaskDeleteDecorator;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data : { taskId: string },
        private _taskApiService: TaskApiService,
        private _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar) {
            this._taskDeleteComponent = new ConcreteTaskDelete(
                data.taskId,
                _taskApiService,
                _matDialog,
                _matSnackBar
            );

            this._taskDeleteDecorator = new LogTaskDeleteDecorator(this._taskDeleteComponent);
        }

        public deleteTask() {
            this._taskDeleteDecorator.deleteTask();
        }

}
