import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactUsComponent } from '../../Components/contact-us/contact-us.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-it-services',
  imports: [RouterLink, ContactUsComponent, NgClass],
  templateUrl: './it-services.component.html',
  styleUrl: './it-services.component.scss',
})
export class ItServicesComponent implements OnInit {
  sections: HTMLElement[] = [];
  activeSectionIndex = 0;
  constructor(private el: ElementRef) {}
  ngOnInit() {
    this.sections = Array.from(
      this.el.nativeElement.querySelectorAll('section')
    );
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
