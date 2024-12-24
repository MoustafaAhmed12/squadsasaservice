import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Areas } from '../../models/clients';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  clientService = inject(ClientService);
  allAreas: Areas[] = [];
  ngOnInit() {
    this.getAllAreas();
  }

  getAllAreas(): void {
    this.clientService.getAreas().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allAreas = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
