import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private autenticado$ = new BehaviorSubject<boolean>(
    this.usuarioEstaConectado()
  );

  constructor(private msalService: MsalService) {
    // Emitir el estado inicial basado en las cuentas detectadas
    const hayCuentas = this.usuarioEstaConectado();
    console.log(
      'Cuentas detectadas al inicializar:',
      this.msalService.instance.getAllAccounts()
    );
    this.autenticado$.next(hayCuentas);
  }

  get estadoAutenticacion$() {
    return this.autenticado$.asObservable(); // Observable del estado de autenticación
  }

  /**
   * Verifica si hay cuentas activas utilizando `getAllAccounts`.
   * Retorna `true` si hay al menos una cuenta.
   */
  usuarioEstaConectado(): boolean {
    const cuentas = this.msalService.instance.getAllAccounts();
    console.log('Cuentas activas:', cuentas);
    return cuentas.length > 0;
  }

  /**
   * Inicia sesión redirigiendo al flujo de autenticación.
   */
  iniciarSesion(): void {
    this.msalService.loginRedirect();
  }

  /**
   * Cierra la sesión eliminando todas las cuentas y notificando el estado.
   */
  cerrarSesion(): void {
    // Limpia las cuentas activas y el almacenamiento
    this.msalService.instance.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200', // Cambiar según tu configuración
    });

    // Limpia el estado local
    this.autenticado$.next(false);
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * Maneja el retorno del flujo de inicio de sesión redirigido.
   * Verifica la respuesta y actualiza el estado de autenticación.
   */
  manejarRetornoDeLogin(): void {
    const msalInstance = this.msalService.instance;

    // Inicializa MSAL antes de usarlo
    msalInstance.initialize().then(() => {
      msalInstance
        .handleRedirectPromise()
        .then((response: AuthenticationResult | null) => {
          if (response) {
            console.log('Respuesta de login:', response);

            // Guarda el token JWT en localStorage
            const jwtToken = response.idToken;
            localStorage.setItem('jwt', jwtToken);
            console.log('Token JWT guardado en localStorage:', jwtToken);

            // Configura la cuenta activa
            msalInstance.setActiveAccount(response.account);

            // Notifica autenticación exitosa
            this.autenticado$.next(true);
          } else {
            const cuentas = msalInstance.getAllAccounts();
            this.autenticado$.next(cuentas.length > 0);
          }
        })
        .catch((error) => {
          console.error('Error manejando el retorno del login:', error);
          this.autenticado$.next(false); // Notifica autenticación fallida
        });
    });
  }
}
