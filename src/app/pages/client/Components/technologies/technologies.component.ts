import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Technologies } from '../../models/clients';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-technologies',
  imports: [RouterLink],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
})
export class TechnologiesComponent implements OnInit {
  clientService = inject(ClientService);
  allTechnologies: Technologies[] = [];
  ngOnInit() {
    this.getAllTechnologies();
  }

  getAllTechnologies(): void {
    this.clientService.getTechnologies().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTechnologies = data;
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
