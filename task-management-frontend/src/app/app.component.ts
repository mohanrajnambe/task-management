import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'task-management-frontend';
  openSideNav = true;

  toggleSideNav(val: any){
    this.openSideNav = val;
  }
}
