import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HeroComponent } from '../../Components/hero/hero.component';
import { MarketsComponent } from '../../Components/markets/markets.component';
import { ServicesComponent } from '../../Components/services/services.component';
import { OurcompanyComponent } from '../../Components/ourcompany/ourcompany.component';
import { TechnologiesComponent } from '../../Components/technologies/technologies.component';
import { ContactUsComponent } from '../../Components/contact-us/contact-us.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    MarketsComponent,
    ServicesComponent,
    OurcompanyComponent,
    TechnologiesComponent,
    ContactUsComponent,
    NgClass,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  sections = Array(7).fill(null);
  activeSectionIndex = 0;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const sectionOffsets = this.sections.map((_, index) => {
      const sectionElement = document.getElementById('section' + index);
      return sectionElement ? sectionElement.offsetTop : 0;
    });

    const scrollPosition = window.scrollY;

    for (let i = 0; i < sectionOffsets.length; i++) {
      if (
        scrollPosition >= sectionOffsets[i] - 100 &&
        scrollPosition < sectionOffsets[i] + 100
      ) {
        this.activeSectionIndex = i;
        break;
      }
    }
  }

  scrollToSection(index: number): void {
    const sectionElement = document.getElementById('section' + index);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
