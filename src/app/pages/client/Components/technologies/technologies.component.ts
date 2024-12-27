import { Component, inject, OnInit } from '@angular/core';
import { Technologies } from '../../models/clients';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-technologies',
  imports: [RouterLink, NgClass],
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.scss',
})
export class TechnologiesComponent implements OnInit {
  sharedService = inject(SharedService);
  allTechnologies: Technologies[] = [];
  ngOnInit() {
    this.getAllTechnologies();
  }

  getAllTechnologies(): void {
    this.sharedService.getTechnologies().subscribe({
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
