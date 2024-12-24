import { Component, inject, OnInit } from '@angular/core';
import { Markets } from '../../models/clients';
import { ClientService } from '../../services/client.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-markets',
  imports: [RouterLink],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent implements OnInit {
  clientService = inject(ClientService);
  allMarkets: Markets[] = [];
  ngOnInit() {
    this.getAllMarkets();
  }

  getAllMarkets(): void {
    this.clientService.getMarkets().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allMarkets = data;
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
