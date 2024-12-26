import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/screens/home/home.component';
import { ConfiguratorComponent } from './pages/client/screens/configurator/configurator.component';
import { ItServicesComponent } from './pages/client/screens/it-services/it-services.component';
import { LayoutClientComponent } from './layouts/layout-client/layout-client.component';
import { LoginComponent } from './authentication/screens/login/login.component';
import { authGuard, authGuardLoggdIn } from './authentication/guard/auth.guard';
import { AdminHomeComponent } from './pages/admin/screens/admin-home/admin-home.component';
import { rolesGuard } from './authentication/guard/roles.guard';
import { LayoutAdminComponent } from './layouts/layout-admin/layout-admin.component';
import { OrdersComponent } from './pages/admin/screens/orders/orders.component';
import { AreasComponent } from './pages/admin/screens/areas/areas.component';
import { MarketsComponent } from './pages/admin/screens/markets/markets.component';
import { TechnologiesComponent } from './pages/admin/screens/technologies/technologies.component';
import { JobTitlesComponent } from './pages/admin/screens/job-titles/job-titles.component';
import { AddAdminComponent } from './pages/admin/screens/add-admin/add-admin.component';
import { ContactUsComponent } from './pages/admin/screens/contact-us/contact-us.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutClientComponent,
    canActivate: [rolesGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'configurator',
        component: ConfiguratorComponent,
      },
      {
        path: 'it-services',
        component: ItServicesComponent,
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuardLoggdIn],
    title: 'Fiker - Login Admin',
  },

  {
    path: 'admin',
    component: LayoutAdminComponent,
    canActivate: [authGuard, rolesGuard],
    title: 'Fiker - Admins',
    children: [
      {
        path: '',
        component: AdminHomeComponent,
      },
      {
        path: 'add-admin',
        component: AddAdminComponent,
        title: 'Fiker - Add a new admin',
      },
      {
        path: 'orders',
        component: OrdersComponent,
        title: 'Fiker - Orders',
      },
      {
        path: 'market',
        component: MarketsComponent,
        title: 'Fiker - Markets',
      },
      {
        path: 'areas',
        component: AreasComponent,
        title: 'Fiker - Areas',
      },
      {
        path: 'technologies',
        component: TechnologiesComponent,
        title: 'Fiker - Technologies',
      },
      {
        path: 'job-titles',
        component: JobTitlesComponent,
        title: 'Fiker - Job Titles',
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        title: 'Fiker - Contact-Us',
      },
    ],
  },
];
