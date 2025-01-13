import { Routes } from '@angular/router';
import { FailedComponent } from './failed/failed.component';
import { HomeComponent } from './home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { PatientsComponent } from './patients/patients.component';

export const routes: Routes = [
  {
    path: 'pacientes',
    component: PatientsComponent,
    canActivate: [MsalGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [MsalGuard],
  },
  // {
  //   path: 'login-failed',
  //   component: FailedComponent,
  // },
];
