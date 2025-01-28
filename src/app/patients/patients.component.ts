import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ModalComponent } from '../commons/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [ModalComponent, CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  pacientes: any[] = [];
  pacienteSeleccionado: any = null;
  formularioVisible = false;
  formularioPaciente: any = {};
  alertasPaciente: any[] = [];
  mostrarModal = false;

  private baseUrl =
    'https://rumftoezz6.execute-api.us-east-1.amazonaws.com/dev/pacientes';

  // private baseUrl = 'http://localhost:8081/bff/pacientes';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.http.get<any[]>(this.baseUrl).subscribe((data: any) => {
      this.pacientes = data.res;
    });
  }

  verDetalle(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    this.formularioVisible = false;
  }

  nuevoPaciente(): void {
    this.formularioVisible = true;
    this.pacienteSeleccionado = null;
    this.formularioPaciente = {};
  }

  editarPaciente(paciente: any): void {
    console.log('Paciente seleccionado antes de clonar:', paciente);

    this.formularioVisible = true;
    this.pacienteSeleccionado = paciente;
    this.formularioPaciente = paciente;
  }

  guardarPaciente(): void {
    if (this.pacienteSeleccionado) {
      // Actualizar paciente
      this.http
        .put(
          `${this.baseUrl}/${this.pacienteSeleccionado.id}`,
          this.formularioPaciente
        )
        .subscribe(() => {
          this.cargarPacientes();
        });
    } else {
      // Crear paciente
      const body = {
        ...this.formularioPaciente,
        fechaIngreso: new Date(),
      };
      this.http.post(this.baseUrl, body).subscribe(() => {
        this.cargarPacientes();
        this.formularioVisible = false;
        this.pacienteSeleccionado = null;
      });
    }
  }

  eliminarPaciente(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => {
        this.formularioVisible = false;
        this.pacienteSeleccionado = null;
        this.cargarPacientes();
      });
    }
  }

  cancelar(): void {
    this.formularioVisible = false;
    this.pacienteSeleccionado = null;
    this.cargarPacientes();
  }

  mostrarAlertas(paciente: any): void {
    this.alertasPaciente = paciente.alertas.filter(
      (alerta: any) => alerta.atendida === 'N'
    );
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  tieneAlertasNoAtendidas(paciente: any): boolean {
    return paciente.alertas?.some((alerta: any) => alerta.atendida === 'N');
  }
}
