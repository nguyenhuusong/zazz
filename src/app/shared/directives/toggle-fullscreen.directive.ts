import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[appToggleFullscreen]'
})
export class ToggleFullscreenDirective {

  @HostListener('click') onClick() {
    // if (screenfull.enabled) {
    //   screenfull.toggle();
    // }
  }
}
