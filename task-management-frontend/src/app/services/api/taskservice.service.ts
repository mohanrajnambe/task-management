import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  description: string;
  statusId: number;
}

export interface Status {
  id: number;
  name: string
}

export enum StatusEnum {
  "To-do" = 1,
  "In-progress" = 2,
  "Done" = 3
}
const URI = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  getAllTasks() : Observable<Task[]>{
   return this.http.get<Task[]>(URI+"/task");
  }

  getAllStatus() : Observable<Status[]>{
    return this.http.get<Status[]>(URI+"/status");
  }

  postTask(task: Task) : Observable<Task>{
    return this.http.post<Task>(URI+"/task", task, {headers: this.headers});
  }

  updateTask(task: Task) : Observable<Task>{
    return this.http.put<Task>(URI+"/task/"+task.id+"/"+task.statusId, task, {headers: this.headers});
  }

  deleteTask(task: Task) : Observable<Task>{
    return this.http.delete<Task>(URI+"/task/"+task.id);
  }


}
