import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/screens/home/home.component';
import { ConfiguratorComponent } from './pages/client/screens/configurator/configurator.component';
import { ItServicesComponent } from './pages/client/screens/it-services/it-services.component';
import { LayoutClientComponent } from './layouts/layout-client/layout-client.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutClientComponent,
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
];
