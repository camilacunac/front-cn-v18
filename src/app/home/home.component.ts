import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../commons/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class HomeComponent implements OnInit {
  totalPacientes: number = 0;
  alertasActivas: number = 0;
  alertasAtendidas: number = 0;
  alertasCriticas: any[] = [];

  private baseUrl =
    'http://ec2-44-194-230-117.compute-1.amazonaws.com:8081/bff';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarAlertas();
  }

  cargarPacientes(): void {
    this.http.get<any[]>(`${this.baseUrl}/pacientes`).subscribe({
      next: (data: any) => {
        this.totalPacientes = data.res.length;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
      },
    });
  }

  cargarAlertas(): void {
    this.http.get<any[]>(`${this.baseUrl}/alertas`).subscribe({
      next: (data: any) => {
        this.alertasActivas = data.res.filter(
          (alerta: any) => alerta.atendida === 'N'
        ).length;
        this.alertasAtendidas = data.res.filter(
          (alerta: any) => alerta.atendida === 'S'
        ).length;
        this.alertasCriticas = data.res.filter(
          (alerta: any) => alerta.gravedad === 'Alta'
        );
      },
      error: (err) => {
        console.error('Error al cargar alertas:', err);
      },
    });
  }
}
