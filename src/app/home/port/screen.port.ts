import { Observable } from 'rxjs';
import { ScreenType } from 'src/utils/check-screen-size';


export interface ScreenPort {
    screenType$: Observable<ScreenType>;
}