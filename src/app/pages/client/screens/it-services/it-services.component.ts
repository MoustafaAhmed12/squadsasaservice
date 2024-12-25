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
  isScrolling = false;
  constructor(private el: ElementRef) {}
  ngOnInit() {
    this.sections = Array.from(
      this.el.nativeElement.querySelectorAll('section')
    );
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

    const navbarHeight = 6 * 16; // 6rem, assuming the root font-size is 16px
    if (element) {
      const elementPosition = element.offsetTop;
      const scrollPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.isScrolling = false;
      }, 500); // Adjust time to match scroll duration
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
