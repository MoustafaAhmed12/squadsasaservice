import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
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
export class HomeComponent implements OnInit {
  sections: HTMLElement[] = [];
  activeSectionIndex = 0;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.sections = Array.from(
      this.el.nativeElement.querySelectorAll('section')
    );
    const videoSection = this.el.nativeElement.querySelector('#section1');
    const videoElement: HTMLVideoElement = videoSection.querySelector('video');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    observer.observe(videoSection);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const offset = 96; // 4rem = 64px

    this.sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;

      if (
        window.scrollY + offset >= sectionTop &&
        window.scrollY + offset < sectionTop + section.offsetHeight
      ) {
        this.activeSectionIndex = index;
      }
    });
  }

  scrollToSection(index: number): void {
    const offset = 96; // 4rem = 64px
    const section = this.sections[index];
    const sectionTop = section.offsetTop;

    window.scrollTo({
      top: sectionTop - offset,
      behavior: 'smooth',
    });
    this.activeSectionIndex = index;
  }
}
