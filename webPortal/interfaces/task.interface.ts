import { Timestamp } from "@angular/fire/firestore";

export enum TaskState {
    BackLog,
    InDev,
    Testing,
    Done
}

export interface TaskInterface {
    id: string,
    name: string,
    desc: string,
    creatorId: string,
    createdOn: Timestamp,
    deadlineOn: Timestamp,
    completedOn?: Timestamp,
    state: TaskState,
}
