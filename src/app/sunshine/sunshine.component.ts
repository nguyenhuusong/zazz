import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sunshine',
  templateUrl: './sunshine.component.html',
  styleUrls: ['./sunshine.component.scss']
})
export class SunshineComponent implements OnDestroy {
  router: Router;
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'sunshine');
    this.renderer.setAttribute(document.body, 'data-col', 'sunshine');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'sunshine');
  }
}
