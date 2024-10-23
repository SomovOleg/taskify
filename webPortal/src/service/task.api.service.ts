import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { TaskForm } from 'src/app/create-task/create-task.component';

@Injectable({
    providedIn: 'root'
})
export class TaskApiService {

    constructor(
        private _authService: AuthService,
        private _http: HttpClient

    ) {}

    private _apiHost: string = 'http://localhost:5002';

    getTask(): Observable<TaskInterface[]> {
        return this._http.get(`${this._apiHost}/tasks`) as Observable<TaskInterface[]>;
    }

    deleteTask(taskId: string) {
        return this._http.delete(`${this._apiHost}/tasks/${taskId}`);
    }

    createTask(newTask: TaskForm) {
        return this._http.post(`${this._apiHost}/tasks`, newTask);
    }
}
