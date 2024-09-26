import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { TaskInterface, TaskState } from 'interfaces/task.interface';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TaskApiService {

    constructor(private _firestore: Firestore, private _authService: AuthService) {
    }

    private _taskCollection = collection(this._firestore, 'Tasks');

    getTasks(): Observable<TaskInterface[]> {
        return collectionData(this._taskCollection, {
            idField: 'id'
        }) as Observable<TaskInterface[]>;
    };

    updateTaskState(taskId: string, newState: TaskState) {
        const db = getFirestore();

        updateDoc(doc(db, 'Tasks', taskId), {
            state: newState
        })
    }

    deleteTask(taskId: string) {
        const db = getFirestore();
        const promise = deleteDoc(doc(db, 'Tasks', taskId))
        return from(promise);
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
