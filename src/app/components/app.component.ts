import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <router-outlet></router-outlet>
  `,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'website-builder';
}
