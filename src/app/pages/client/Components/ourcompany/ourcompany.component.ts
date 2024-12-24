import { CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-ourcompany',
  imports: [CommonModule],
  templateUrl: './ourcompany.component.html',
  styleUrl: './ourcompany.component.scss',
})
export class OurcompanyComponent {
  @ViewChild('numberSection') numberSection!: ElementRef;

  // Target numbers to animate
  targetNumbers = [2000, 42, 19];
  animatedNumbers = [
    { number: 0, label: 'Employees' },
    { number: 0, label: 'IT Units' },
    { number: 0, label: 'Spanish’ Delivery Hubs' },
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.startAnimation();
          observer.disconnect(); // Stop observing after animation starts
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    observer.observe(this.numberSection.nativeElement);
  }

  startAnimation() {
    this.targetNumbers.forEach((target, index) => {
      const step = Math.ceil(target / 100); // Calculate step for smoother animation
      let current = 0;

      const interval = setInterval(() => {
        if (current < target) {
          current += step;
          if (current > target) current = target; // Ensure it doesn't exceed the target
          this.animatedNumbers[index].number = current;
        } else {
          clearInterval(interval); // Stop the interval when target is reached
        }
      }, 20); // Update every 20ms
    });
  }
}
