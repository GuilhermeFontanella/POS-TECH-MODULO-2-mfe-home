import { checkScreenSize } from 'src/utils/check-screen-size';
import { Injectable } from "@angular/core";

import { fromEvent, map, startWith } from "rxjs";
import { ScreenPort } from './port/screen.port';

@Injectable({providedIn: 'root'})
export class ScreenService implements ScreenPort {
    screenType$ = fromEvent(window, 'resize').pipe(
        startWith(null),
        map(() => checkScreenSize(window.innerWidth))
    );
}