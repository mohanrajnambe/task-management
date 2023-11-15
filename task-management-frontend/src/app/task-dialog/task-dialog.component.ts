import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Status, StatusEnum, Task, TaskService } from '../services/api/taskservice.service';

interface Data {
  task: Task,
  status: Status[]
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.sass']
})
export class TaskDialogComponent {

  taskForm: FormGroup;
  allStatus: Status[];
  StatusEnum = StatusEnum;
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data, private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [null, Validators.required],
      statusId: [0]
    });
    this.allStatus = data.status;
    if (data.task) {
      this.taskForm.patchValue(data.task);
      this.taskForm.get('status')?.setValue(this.allStatus.find((status) => status.id === this.taskForm.get('statusId')?.value)?.name);
    }
  }
  get titleControl(): FormControl {
    return this.taskForm.get('title') as FormControl;
  }
  getStatusValues(): string[] {
    return Object.values(StatusEnum).filter(value => typeof value === 'string') as string[];
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const task = this.taskForm.getRawValue();
    task['statusId'] = this.allStatus.find((status) => status.name === task['status'])?.id;
    if (task['id'] === 0) {
      this.taskService.postTask(task).subscribe((task) => {
        this.dialogRef.close(task);
      });
    } else {
      this.taskService.updateTask(task).subscribe((task) => {
        this.dialogRef.close(task);
      });
    }
  }

  delete() {
    const task = this.taskForm.getRawValue();
    this.taskService.deleteTask(task).subscribe(() =>{
      this.dialogRef.close(task);
    })
  }
}
