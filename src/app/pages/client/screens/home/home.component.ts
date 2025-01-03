import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { HeroComponent } from '../../Components/hero/hero.component';
import { MarketsComponent } from '../../Components/markets/markets.component';
import { ServicesComponent } from '../../Components/services/services.component';
import { OurcompanyComponent } from '../../Components/ourcompany/ourcompany.component';
import { TechnologiesComponent } from '../../Components/technologies/technologies.component';
import { ContactUsComponent } from '../../Components/contact-us/contact-us.component';
import { ActivatedRoute } from '@angular/router';

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
export class HomeComponent implements OnInit, AfterViewInit {
  route = inject(ActivatedRoute);
  sections: HTMLElement[] = [];
  activeSectionIndex = 0;
  isScrolling = false;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.sections = Array.from(
      this.el.nativeElement.querySelectorAll('section')
    );
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          window.scrollTo({
            top: 3930,
            behavior: 'smooth',
          });
          this.activeSectionIndex = 6;
        }
      }
    });
  }

  @HostListener('window:wheel', ['$event'])
  onScroll(event: any) {
    if (this.isScrolling) return;
    if (event.deltaY > 0) {
      this.nextSection();
    } else {
      this.previousSection();
    }
  }

  nextSection() {
    if (this.activeSectionIndex < this.sections.length - 1) {
      this.activeSectionIndex++;
      this.scrollToSection(this.sections[this.activeSectionIndex]);
    }
  }

  previousSection() {
    if (this.activeSectionIndex > 0) {
      this.activeSectionIndex--;
      this.scrollToSection(this.sections[this.activeSectionIndex]);
    }
  }

  scrollToSection(element: HTMLElement) {
    this.isScrolling = true;
    const navbarHeight = 6 * 16;
    if (element) {
      const elementPosition = element.offsetTop;
      const scrollPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.isScrolling = false;
      }, 600);
    }
  }

  scrollToSection2(index: number): void {
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
