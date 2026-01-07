import { inject } from "@angular/core";
import { ScreenService } from "./screen.service";
import { ScreenPort } from "./port/screen.port";

export class HomeViewModel {
    private screenService = inject<ScreenPort>(ScreenService);

    screenType$ = this.screenService.screenType$;
}