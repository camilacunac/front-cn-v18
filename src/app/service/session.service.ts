import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private autenticado$ = new BehaviorSubject<boolean>(
    this.usuarioEstaConectado()
  );

  constructor(private msalService: MsalService) {
    this.actualizarEstadoAutenticacion();
  }

  get estadoAutenticacion$() {
    return this.autenticado$.asObservable();
  }

  usuarioEstaConectado(): boolean {
    const cuentas = this.msalService.instance.getAllAccounts();
    return cuentas.length > 0;
  }

  iniciarSesion(): void {
    this.msalService.loginRedirect();
  }

  cerrarSesion(): void {
    this.msalService.instance.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200',
    });
  }

  actualizarEstadoAutenticacion(): void {
    const cuentas = this.msalService.instance.getAllAccounts();
    this.autenticado$.next(cuentas.length > 0);
  }
}
