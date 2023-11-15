import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {
  @Output() emitToggle = new EventEmitter<boolean>();
  toggleOpen = true;

  toggleSideNav() {
    this.toggleOpen = !this.toggleOpen
    this.emitToggle.emit(this.toggleOpen);
  }
}
