import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TaskApiService {

    constructor(
        private _firestore: Firestore,
        private _authService: AuthService,
        private _http: HttpClient

    ) {}

    private _taskCollection = collection(this._firestore, 'Tasks');
    private _apiHost: string = 'http://localhost:5000';

    getTask(): Observable<TaskInterface[]> {
        return this._http.get(`${this._apiHost}/tasks`) as Observable<TaskInterface[]>;
    }

    deleteTask(taskId: string) {
        return this._http.delete(`${this._apiHost}/tasks/${taskId}`);
    }

    createNewTask(name: string, description: string, deadlineOn: Date) {
        return from(addDoc(this._taskCollection, {
            name: name,
            desc: description,
            deadlineOn: deadlineOn,
            createdOn: new Date(),
            completedOn: new Date('0001-01-01T00:00:00Z'),
            state: TaskState.BackLog,
            creatorId: this._authService.user.uid
        })
            .then((response) => response.id ));
    }
}
