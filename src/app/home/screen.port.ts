import { Observable } from 'rxjs';
import { ScreenType } from './../../utils/check-screen-size';

export interface ScreenPort {
    screenType$: Observable<ScreenType>;
}