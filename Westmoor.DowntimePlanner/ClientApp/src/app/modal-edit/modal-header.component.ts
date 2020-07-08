import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
})
export class ModalHeaderComponent {
  @Input() public title: string;
  @Output() public close = new EventEmitter<void>();
}
