import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from 'src/app/service/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  autenticado: boolean = false;

  constructor(
    private authService: SessionService,
    private cdr: ChangeDetectorRef // Servicio para forzar la detección de cambios
  ) {}

  ngOnInit(): void {
    this.authService.estadoAutenticacion$.subscribe((estado) => {
      console.log({ estaOnNav: estado });
      this.autenticado = estado;
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }

  iniciarSesion(): void {
    this.authService.iniciarSesion();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
