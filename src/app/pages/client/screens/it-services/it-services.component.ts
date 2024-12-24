import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactUsComponent } from '../../Components/contact-us/contact-us.component';

@Component({
  selector: 'app-it-services',
  imports: [RouterLink, ContactUsComponent],
  templateUrl: './it-services.component.html',
  styleUrl: './it-services.component.scss',
})
export class ItServicesComponent {}
