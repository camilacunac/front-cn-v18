import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from 'src/app/service/WebSocketService.service';

@Component({
  selector: 'app-alertas',
  template: `
    <div class="alertas-container">
      <div class="alerta" *ngFor="let alerta of alertas; let i = index">
        <p><strong>Mensaje:</strong> {{ alerta.mensaje }}</p>
        <p>
          <strong>Frecuencia Cardíaca:</strong> {{ alerta.frecuenciaCardiaca }}
        </p>
        <p><strong>Temperatura:</strong> {{ alerta.temperatura }}</p>
        <p>
          <strong>Saturación de Oxígeno:</strong> {{ alerta.saturacionOxigeno }}
        </p>
        <button (click)="cerrarAlerta(i)">X</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      .alertas-container {
        position: fixed;
        top: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
      }
      .alerta {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        color: #721c24;
        width: 300px;
        position: relative;
      }
      .alerta button {
        position: absolute;
        top: 5px;
        right: 5px;
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #721c24;
      }
      .alerta button:hover {
        color: #491217;
      }
    `,
  ],
})
export class Alertas implements OnInit {
  alertas: any[] = [];

  constructor(
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.webSocketService
      .connect(
        'ws://ec2-44-194-230-117.compute-1.amazonaws.com:8081//ws/alertas'
      )
      .subscribe((mensaje: any) => {
        console.log('Mensaje en componente:', mensaje);
        this.alertas.unshift(JSON.parse(mensaje)); // Agregar la nueva alerta al inicio del array
        this.cdr.detectChanges();
      });
  }

  cerrarAlerta(index: number) {
    this.alertas.splice(index, 1); // Eliminar la alerta específica
    this.cdr.detectChanges();
  }
}
