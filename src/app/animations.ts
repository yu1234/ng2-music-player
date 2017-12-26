import {animate, style, transition, trigger, state, query, group} from '@angular/animations';

// Component transition animations
export const routeAnimation =
  trigger('routeAnimation', [
    transition(':enter', [
      style({
        position: 'absolute'
      }),
      animate('0.5s ease-in-out')
    ]),
    transition('* => *', [
      query(':leave', style({transform: 'translateX(0)', position: 'absolute'}), {optional: true}),
      query(':enter', style({transform: 'translateX(100%)', position: 'absolute'}), {optional: true}),

      group([
        query(':leave', animate('.5s ease-in-out', style({transform: 'translateX(-100%)'})), {optional: true}),
        query(':enter', animate('.5s ease-in-out', style({transform: 'translateX(0)'})), {optional: true})
      ])
    ])
  ]);
