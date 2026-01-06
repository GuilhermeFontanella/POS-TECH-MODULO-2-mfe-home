import { checkScreenSize } from 'src/utils/check-screen-size';
import { Injectable } from "@angular/core";
import { ScreenPort } from "./screen.port";
import { fromEvent, map, startWith } from "rxjs";

@Injectable({providedIn: 'root'})
export class ScreenService implements ScreenPort {
    screenType$ = fromEvent(window, 'resize').pipe(
        startWith(null),
        map(() => checkScreenSize(window.innerWidth))
    );
}