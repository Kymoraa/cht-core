import { Routes } from '@angular/router';

import { AppRouteGuardProvider } from '../../app-route.guard.provider';
import { TrainingCardDeactivationGuardProvider } from 'src/ts/training-card.guard.provider';
import { ReportsComponent } from '@mm-modules/reports/reports.component';
import { ReportsContentComponent } from '@mm-modules/reports/reports-content.component';
import { ReportsAddComponent } from '@mm-modules/reports/reports-add.component';
import {
  ReportsAddDeactivationGuardProvider,
  ReportsSelectModelDeactivationGuardProvider
} from '@mm-modules/reports/report-route.guard.provider';

export const routes:Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    data: { permissions: ['can_view_reports'], tab: 'reports' },
    canActivate: [ AppRouteGuardProvider ],
    children: [
      {
        path: '',
        component: ReportsContentComponent,
        data: { name: 'reports.detail' },
        canDeactivate: [ ReportsSelectModelDeactivationGuardProvider, TrainingCardDeactivationGuardProvider ],
      },
      {
        path: ':id',
        component: ReportsContentComponent,
        data: { name: 'reports.detail' },
        canDeactivate: [ TrainingCardDeactivationGuardProvider ],
      },
      {
        path: 'add/:formId',
        component: ReportsAddComponent,
        data: { permissions: ['can_edit'], hideTraining: true },
        canActivate: [ AppRouteGuardProvider ],
        canDeactivate: [ ReportsAddDeactivationGuardProvider ],
      },
      {
        path: 'edit/:reportId',
        component: ReportsAddComponent,
        data: { permissions: ['can_edit'], hideTraining: true },
        canActivate: [ AppRouteGuardProvider ],
        canDeactivate: [ ReportsAddDeactivationGuardProvider ],
      }
    ]
  },
];
