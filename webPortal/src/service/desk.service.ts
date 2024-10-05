import { Injectable } from '@angular/core';
import { getFirestore } from '@firebase/firestore';
import { TaskApiService } from './task.api.service';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { doc, updateDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { saveAs } from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class DeskService {

    private _apiHost: string = 'http://localhost:5000';

    constructor(private _taskApi: TaskApiService, private _http: HttpClient) { }

    handleTaskStateChange(targetTask: TaskInterface, newState: TaskState) {
        targetTask.state = newState;
        return this._http.put(`${this._apiHost}/tasks/${targetTask.id}`, targetTask)
    }

    exportToExcel() {
        this._http.get(`${this._apiHost}/export_tasks`, { responseType: 'blob' })
        .pipe(
            catchError(error => {
            console.error('Error downloading the file', error);
            return throwError(error);
            })
        )
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'tasks.xlsx');
      });

    }

}
