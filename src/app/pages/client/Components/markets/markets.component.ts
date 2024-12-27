import { Component, inject, OnInit } from '@angular/core';
import { Markets } from '../../models/clients';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-markets',
  imports: [RouterLink, NgClass],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.scss',
})
export class MarketsComponent implements OnInit {
  sharedService = inject(SharedService);
  allMarkets: Markets[] = [];
  ngOnInit() {
    this.getAllMarkets();
  }

  getAllMarkets(): void {
    this.sharedService.getMarkets().subscribe({
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
