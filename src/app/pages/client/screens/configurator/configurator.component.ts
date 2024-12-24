import { CommonModule, formatCurrency } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Areas, Markets, Profiles, Technologies } from '../../models/clients';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-configurator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.scss',
})
export class ConfiguratorComponent {
  clientService = inject(ClientService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  orderForm!: FormGroup;
  allMarkets: Markets[] = [];
  allAreas: Areas[] = [];
  allTechnologiesBelongArea: Technologies[] = [];
  allProfiles: Profiles[] = [];
  tabs: { id: number; label: string }[] = [];
  activeTab: number = 0;
  isLoadingM: boolean = false;
  isLoadingA: boolean = false;
  isLoadingT: boolean = false;
  isLoadingP: boolean = false;
  isLoading: boolean = false;
  step: number = 15;
  minPosition: number = 0;
  maxPosition: number = 20;
  marketId: number = 0;
  areaId: number = 0;
  techId: number = 0;
  totalQuantity: number = 0;
  order: { [key: string]: any } = {};
  profiles: { jobTitleId: number; name: string; quantity: number }[] = [];
  counters: number[] = [];

  constructor() {
    this.orderForm = this.fb.group({
      contactName: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      company: ['', [Validators.required]],
      question: ['', [Validators.required]],
      areaId: ['', [Validators.required]],
      marketId: ['', [Validators.required]],
      technologyId: ['', [Validators.required]],
      profiles: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.order = {};
    this.counters = [];
    this.route.queryParams.subscribe((params) => {
      this.marketId = +params['catId'];
      this.areaId = +params['areaId'];
      this.techId = +params['techId'];
      if (this.marketId) {
        this.tabs = [
          { id: 0, label: 'Markets' },
          { id: 1, label: 'Area' },
          { id: 2, label: 'Technology' },
          { id: 3, label: 'Profiles' },
          { id: 4, label: 'order' },
        ];
        this.order['marketId'] = this.marketId;
        this.getAllMarkets();
        this.activeTab = 1;
        this.getAllAreas();
      } else {
        if (this.areaId) {
          this.order['areaId'] = this.areaId;
          this.tabs = [
            { id: 0, label: 'Area' },
            { id: 1, label: 'Markets' },
            { id: 2, label: 'Technology' },
            { id: 3, label: 'Profiles' },
            { id: 4, label: 'order' },
          ];
          this.getAllAreas();
          this.activeTab = 1;
          this.getAllMarkets();
        } else if (this.techId) {
          this.order['technologyId'] = this.techId;
          this.tabs = [
            { id: 0, label: 'Technology' },
            { id: 1, label: 'Area' },
            { id: 2, label: 'Markets' },
            { id: 3, label: 'Profiles' },
            { id: 4, label: 'order' },
          ];
          this.getAreasByTechnologyId(this.techId);
          this.activeTab = 1;
        } else {
          this.tabs = [
            { id: 0, label: 'Markets' },
            { id: 1, label: 'Area' },
            { id: 2, label: 'Technology' },
            { id: 3, label: 'Profiles' },
            { id: 4, label: 'order' },
            { id: 5, label: 'success' },
          ];
          this.activeTab = 0;
          this.getAllMarkets();
        }
      }
    });
  }

  getAllMarkets(): void {
    this.isLoadingM = true;
    this.clientService.getMarkets().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allMarkets = data;
          this.isLoadingM = false;
        } else {
          console.log('error');
          this.isLoadingM = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingM = false;
      },
    });
  }

  getAllAreas(): void {
    this.isLoadingA = true;
    this.clientService.getAreas().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allAreas = data;
          this.isLoadingA = false;
        } else {
          console.log('error');
          this.isLoadingA = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingA = false;
      },
    });
  }
  getAllTechnologiesBelongArea(areaId: number): void {
    this.isLoadingT = true;
    this.clientService.getTechnologiesByAreaId(areaId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTechnologiesBelongArea = data;
          this.isLoadingT = false;
        } else {
          console.log('error');
          this.isLoadingT = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingT = false;
      },
    });
  }

  getAllProfiles(techId: number): void {
    this.isLoadingP = true;
    this.clientService.getProfilesByTechnologyId(techId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allProfiles = data;
          debugger;
          if (this.counters.length === 0) {
            this.counters = Array(this.allProfiles.length).fill(0);
          }
          this.isLoadingP = false;
        } else {
          console.log('error');
          this.isLoadingP = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingP = false;
      },
    });
  }
  getAreasByTechnologyId(techId: number): void {
    this.isLoadingP = true;
    this.clientService.getAreasByTechnologyId(techId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allAreas = data;
          this.isLoadingP = false;
        } else {
          console.log('error');
          this.isLoadingP = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingP = false;
      },
    });
  }

  navigateFromMarket(market: Markets, label: string, nextTab: number): void {
    this.activeTab = nextTab;
    if (label === 'area') {
      this.getAllAreas();
    } else if (label === 'tech') {
      this.getAllTechnologiesBelongArea(this.areaId);
    } else {
      this.counters = [];
      this.getAllProfiles(this.techId);
    }
    this.order['marketId'] = market.id;
  }
  navigateFormArea(area: Areas, label: string, nextTab: number): void {
    this.activeTab = nextTab;

    this.order['areaId'] = area.id;
    this.getAllMarkets();
    this.getAllTechnologiesBelongArea(this.order['areaId']);
  }
  navigateFromTechnology(
    tech: Technologies,
    label: string,
    nextTab: number
  ): void {
    this.activeTab = nextTab;
    if (label === 'area') {
      this.getAreasByTechnologyId(this.techId);
    } else {
      this.getAllProfiles(tech.id);
    }
    this.order['technologyId'] = tech.id;
  }

  moveRight(i: number) {
    if (this.counters[i] < this.maxPosition) {
      this.counters[i]++;
      this.updateSelectedArray(
        this.allProfiles[i].id,
        this.allProfiles[i].name,
        this.counters[i]
      );
    }
  }

  moveLeft(i: number) {
    if (this.counters[i] > this.minPosition) {
      this.counters[i]--;
      this.updateSelectedArray(
        this.allProfiles[i].id,
        this.allProfiles[i].name,
        this.counters[i]
      );
    }
  }

  updateSelectedArray(id: number, name: string, counter: number) {
    const existingIndex = this.profiles.findIndex(
      (item) => item.jobTitleId === id
    );
    if (counter === 0) {
      if (existingIndex !== -1) {
        this.profiles.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        this.profiles[existingIndex].quantity = counter;
      } else {
        this.profiles.push({ jobTitleId: id, name: name, quantity: counter });
        this.counters === this.profiles.map((p) => p.quantity);
      }
    }
    this.totalQuantity = this.profiles.reduce(
      (sum, job) => sum + job.quantity,
      0
    );
    console.log(this.counters);
  }

  backToTech() {
    if (this.techId) {
      this.activeTab = 0;
    } else {
      this.activeTab = 2;
    }
  }
  backToArea() {
    if (this.areaId) {
      this.activeTab = 0;
    } else {
      this.activeTab = 1;
    }
  }
  backToMarket() {
    if (this.marketId) {
      this.activeTab = 0;
    } else {
      if (this.areaId) {
        this.activeTab = 1;
      } else if (this.techId) {
        this.activeTab = 2;
      } else {
        this.activeTab = 0;
      }
    }
  }

  handleBack(): void {
    this.activeTab -= 1;
  }
  handleNext(): void {
    this.activeTab = 4;
    let mName = this.allMarkets.find(
      (m) => m.id === this.order['marketId']
    )?.name;
    let mArea = this.allAreas.find((m) => m.id === this.order['areaId'])?.name;
    debugger;
    let mTech = this.allTechnologiesBelongArea.find(
      (m) => m.id === this.order['technologyId']
    )?.name;
    this.order['marketName'] = mName;
    this.order['areaName'] = mArea;
    this.order['techName'] = mTech;
  }

  confirmOrder(): void {
    this.orderForm.get('marketId')?.setValue(this.order['marketId']);
    this.orderForm.get('areaId')?.setValue(this.order['areaId']);
    this.orderForm.get('technologyId')?.setValue(this.order['technologyId']);
    this.orderForm.get('profiles')?.setValue(this.profiles);
    if (this.orderForm.invalid) {
      console.log('first');
      return;
    }
    this.isLoading = true;
    this.clientService.confirmOrder(this.orderForm.value).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          alert('done');
          this.isLoading = false;
        } else {
          console.log('error');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
