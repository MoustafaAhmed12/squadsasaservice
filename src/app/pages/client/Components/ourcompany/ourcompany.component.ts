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
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;

  @ViewChild('counterSection', { static: false }) counterSection!: ElementRef;

  private hasAnimated = false;
  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const section = document.getElementById('counterSection');
    if (section && !this.hasAnimated) {
      const sectionTop = section.getBoundingClientRect().top;
      const screenHeight = window.innerHeight;

      if (sectionTop < screenHeight - 100) {
        this.hasAnimated = true;
        this.startCounting();
      }
    }
  }

  startCounting(): void {
    const duration = 2000; // Duration in milliseconds (2 seconds)
    const target1 = 2000;
    const target2 = 49;
    const target3 = 19;

    const stepTime = 10; // Time interval between increments in milliseconds
    const increment1 = target1 / (duration / stepTime);
    const increment2 = target2 / (duration / stepTime);
    const increment3 = target3 / (duration / stepTime);

    // Ensure that counters are initialized to 0
    this.counter1 = 0;
    this.counter2 = 0;
    this.counter3 = 0;

    // Set interval to update counters
    const interval = setInterval(() => {
      let updated = false; // Flag to check if any counter was updated

      // Update counter1
      if (this.counter1 < target1) {
        this.counter1 = Math.min(
          Math.round(this.counter1 + increment1),
          target1
        );
        updated = true;
      }

      // Update counter2
      if (this.counter2 < target2) {
        this.counter2 = Math.min(
          Math.round(this.counter2 + increment2),
          target2
        );
        updated = true;
      }

      // Update counter3
      if (this.counter3 < target3) {
        this.counter3 = Math.min(
          Math.round(this.counter3 + increment3),
          target3
        );
        updated = true;
      }

      // Log counters for debugging

      // Manually trigger Angular's change detection
      this.cdr.detectChanges();

      // Check if all counters have reached their target values
      if (!updated) {
        clearInterval(interval); // Stop the interval if no counter was updated
      }
    }, stepTime);
  }
}
