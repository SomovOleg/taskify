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

    constructor(private _taskApi: TaskApiService, private _http: HttpClient) { }

    handleTaskStateChange(targetTask: TaskInterface, newState: TaskState) {
        if(newState === 0) {
            this._taskApi.updateTaskState(targetTask.id, newState);

            const db = getFirestore();

            updateDoc(doc(db, 'Tasks', targetTask.id), {
                completedOn: new Date()
            })
        } else if (newState === 3) {
            return;
        } else {
            this._taskApi.updateTaskState(targetTask.id, newState);
        }
    }

    exportToExcel() {
        console.log('Test')
        this._http.get('http://localhost:5000/export_tasks', { responseType: 'blob' })
      .pipe(
        catchError(error => {
          console.error('Error downloading the file', error);
          return throwError(error);
        })
      )
      .subscribe((response: Blob) => {
        // Создаем Blob из ответа
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Используем file-saver для сохранения файла
        saveAs(blob, 'tasks.xlsx');
      });

    }

}
