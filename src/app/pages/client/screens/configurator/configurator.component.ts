import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Areas, Markets, Profiles, Technologies } from '../../models/clients';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SuccessMsgComponent } from '../../Components/success-msg/success-msg.component';
import { SharedService } from '../../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configurator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SuccessMsgComponent,
    CurrencyPipe,
  ],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.scss',
})
export class ConfiguratorComponent implements OnInit {
  sharedService = inject(SharedService);
  clientService = inject(ClientService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
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
  stepM: number = 7;
  minPosition: number = 0;
  maxPosition: number = 20;
  marketId: number = 0;
  areaId: number = 0;
  techId: number = 0;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  order: { [key: string]: any } = {};
  profiles: {
    jobTitleId: number;
    jobTitle: string;
    quantity: number;
    price: number;
  }[] = [];
  counters: number[] = [];
  isDragging: boolean[] = [false, false, false, false, false];
  positionX: number[] = [0, 0, 0, 0, 0];
  screenWidth: number = window.innerWidth;
  lineWidth: number = 0;
  startX: number = 0;
  period: number = 1;
  fileName: string = '';
  date: any;

  constructor() {
    this.orderForm = this.fb.group({
      ContactName: ['', [Validators.required]],
      ContactEmail: ['', [Validators.required, Validators.email]],
      Telephone: ['', [Validators.required]],
      Company: ['', [Validators.required]],
      Question: [''],
      Subscribe: [false],
      acceptPolicy: [false],
      AreaId: ['', [Validators.required]],
      MarketId: ['', [Validators.required]],
      TechnologyId: ['', [Validators.required]],
      Profiles: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.order = {};
    this.counters = [];
    this.calculateStep();
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
          { id: 5, label: 'success' },
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
            { id: 5, label: 'success' },
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
            { id: 5, label: 'success' },
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
    this.sharedService.getMarkets().subscribe({
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
    this.sharedService.getAreas().subscribe({
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
          if (this.counters.length === 0) {
            this.counters = Array(this.allProfiles.length).fill(0);
          }
          if (this.positionX.length === 0) {
            this.positionX = Array(this.allProfiles.length).fill(0);
          }
          if (this.isDragging.length === 0) {
            this.isDragging = Array(this.allProfiles.length).fill(false);
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
        this.allProfiles[i].price,
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
        this.allProfiles[i].price,
        this.counters[i]
      );
    }
  }

  updateSelectedArray(
    id: number,
    name: string,
    price: number,
    counter: number
  ) {
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
        this.profiles.push({
          jobTitleId: id,
          jobTitle: name,
          price: price,
          quantity: counter,
        });
        this.counters === this.profiles.map((p) => p.quantity);
      }
    }
    this.totalQuantity = this.profiles.reduce(
      (sum, job) => sum + job.quantity,
      0
    );
    this.totalPrice = this.profiles.reduce(
      (sum, job) => sum + job.price * job.quantity,
      0
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.calculateStep();
  }

  getStepValue(i: number): number {
    return this.counters[i] * this.step;
  }

  onClickLine(event: MouseEvent, i: number) {
    const line = event.currentTarget as HTMLElement;
    const mouseX = event.clientX - line.getBoundingClientRect().left;
    const percentage = (mouseX / line.offsetWidth) * 100;
    const newStep = Math.round((percentage / 100) * 20);
    this.positionX[i] = newStep * this.step;
    if (this.positionX[i] > this.lineWidth) {
      this.positionX[i] = this.lineWidth;
    }
    if (this.positionX[i] < 0) {
      this.positionX[i] = 0;
    }
    this.counters[i] = Math.round(newStep);
    this.updateSelectedArray(
      this.allProfiles[i].id,
      this.allProfiles[i].name,
      this.allProfiles[i].price,
      this.counters[i]
    );
  }

  onMouseDown(event: MouseEvent, i: number) {
    event.stopPropagation();
    this.isDragging[i] = true;
    this.startX = event.clientX;
    document.addEventListener('mousemove', (e) => this.onMouseMove(e, i));
    document.addEventListener('mouseup', () => this.onMouseUp(i));
  }

  onMouseMove(event: MouseEvent, i: number) {
    if (!this.isDragging[i]) return;
    const deltaX = event.clientX - this.startX;
    this.positionX[i] = Math.max(
      0,
      Math.min(this.lineWidth, this.positionX[i] + deltaX)
    );
    const percentage = (this.positionX[i] / this.lineWidth) * 100;
    const counterValue = Math.round((percentage / 100) * 20);
    this.counters[i] = counterValue;
    this.updateSelectedArray(
      this.allProfiles[i].id,
      this.allProfiles[i].name,
      this.allProfiles[i].price,
      this.counters[i]
    );
    this.startX = event.clientX;
  }

  onMouseUp(i: number) {
    this.isDragging[i] = false;
    document.removeEventListener('mousemove', (e) => this.onMouseMove(e, i));
    document.removeEventListener('mouseup', () => this.onMouseUp(i));
  }

  handleBack(): void {
    this.activeTab -= 1;
  }

  handleNext(): void {
    if (this.period === 0) {
      this.toastr.warning('Period must be greater than 1 month.');
      return;
    }
    this.activeTab = 4;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    let mName = this.allMarkets.find(
      (m) => m.id === this.order['marketId']
    )?.name;
    let mArea = this.allAreas.find((m) => m.id === this.order['areaId'])?.name;
    let mTech = this.allTechnologiesBelongArea.find(
      (m) => m.id === this.order['technologyId']
    )?.name;
    this.order['marketName'] = mName;
    this.order['areaName'] = mArea;
    this.order['techName'] = mTech;
    this.totalPrice = this.totalPrice * this.period;
    this.clientService
      .generatePdfFromData(
        this.order,
        this.profiles,
        this.totalQuantity,
        this.totalPrice,
        this.period
      )
      .then((pdfData) => {
        this.date = pdfData;
      });
  }

  filterNullValues(form: FormGroup): { [key: string]: any } {
    const filteredData: { [key: string]: any } = {};
    Object.keys(form.value).forEach((key) => {
      const value = form.get(key)?.value;
      if (value !== null && value !== undefined) {
        filteredData[key] = value;
      }
    });
    return filteredData;
  }

  confirmOrder(): void {
    this.orderForm.get('MarketId')?.setValue(this.order['marketId']);
    this.orderForm.get('AreaId')?.setValue(this.order['areaId']);
    this.orderForm.get('TechnologyId')?.setValue(this.order['technologyId']);
    this.orderForm.get('Profiles')?.setValue(this.profiles);
    this.orderForm.get('MonthsCount')?.setValue(this.period);

    if (this.orderForm.invalid) {
      this.displayFormErrors();
      return;
    }

    if (this.orderForm.get('acceptPolicy')?.value === false) {
      this.toastr.warning('Should accept the privacy policy.');
      return;
    }

    const myForm = this.filterNullValues(this.orderForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.orderForm.get(key)?.value;
      if (key === 'Profiles') {
        value.forEach((profile: any, index: number) => {
          formData.append(`Profiles[${index}].JobTitle`, profile.jobTitle);
          formData.append(`Profiles[${index}].Quantity`, profile.quantity);
        });
      } else {
        formData.append(key, value);
      }
    });
    formData.append('Attachment.FileName', 'Fiker-order.pdf');
    formData.append('MonthsCount', String(this.period));
    formData.append('Attachment.Data', this.date);

    this.isLoading = true;
    this.clientService.confirmOrder(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.counters = [];
          this.profiles = [];
          this.order = {};
          this.activeTab = 5;
          this.period = 0;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          this.isLoading = false;
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoading = false;
        } else if (statusCode === 500) {
          this.toastr.warning(message);
          this.isLoading = false;
        } else {
          errors.forEach((error: any) => {
            this.toastr.error(error);
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  displayFormErrors() {
    Object.keys(this.orderForm.controls).forEach((field) => {
      const control = this.orderForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
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
  calculateStep() {
    if (this.screenWidth >= 1024) {
      this.lineWidth = 390;
      this.step = 390 / 20;
    } else if (this.screenWidth >= 768) {
      this.lineWidth = 290;
      this.step = 290 / 20;
    } else if (this.screenWidth >= 640) {
      this.lineWidth = 405;
      this.step = 405 / 20;
    } else {
      this.lineWidth = 135;
      this.step = 135 / 20;
    }
  }
}
