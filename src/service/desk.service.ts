import { Injectable } from '@angular/core';
import { getFirestore } from '@firebase/firestore';
import { TaskApiService } from './task.api.service';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeskService {

  constructor(private _taskApi: TaskApiService) { }

  handleTaskStateChange(targetTask: TaskInterface, newState: TaskState) {
    debugger;
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
}
