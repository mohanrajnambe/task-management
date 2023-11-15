import { Component } from '@angular/core';
import { Task, Status, TaskService, StatusEnum } from '../services/api/taskservice.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent {
  allTask: Task[] = [];
  filteredTasks: Task[] = [];
  status: Status[] = [];
  createdTask!: Task;
  StatusEnum = StatusEnum;
  statusFilterForm: FormGroup;

  constructor(private taskService: TaskService, public dialog: MatDialog, private fb: FormBuilder) {
    this.statusFilterForm = this.fb.group({
    toDo: [true],          // Default: not checked
    inProgress: [true],    // Default: not checked
    done: [false],          // Default: not checked
  });}

  ngOnInit() {
    this.getTaskandStatus();
    this.statusFilterForm.valueChanges.subscribe(() => {
      this.updateFilteredTasks();
    });
  }

  getIcon(statusId: number | undefined){
    switch(statusId){
      case 1:
        return 'history';
      case 2:
        return 'downloading';
      case 3:
          return 'doneAll';
      default:
        return 'none';
    }
  }

  getTaskandStatus() {
    this.taskService.getAllTasks().subscribe((task) => {
      this.allTask = task
      this.updateFilteredTasks(); });
    this.taskService.getAllStatus().subscribe((status) => (this.status = status));
  }

  openDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {task: task, status: this.status}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTaskandStatus();
      }
    });
  }
  updateFilteredTasks() {
    // Get the values of the checkboxes
    const { toDo, inProgress, done } = this.statusFilterForm.value;

    // Filter the tasks based on the checkbox values
    this.filteredTasks = this.allTask.filter(task => {
      return (toDo && task.statusId === 1) ||
             (inProgress && task.statusId === 2) ||
             (done && task.statusId === 3);
    });
  }

}
