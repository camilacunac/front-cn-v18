import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() titulo: string = '';
  @Input() contenido: any[] = [];
  @Input() mostrar: boolean = false;
  @Output() cerrarModal = new EventEmitter<void>();

  cerrar(): void {
    this.cerrarModal.emit();
  }
}
