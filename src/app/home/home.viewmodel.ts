import { inject } from "@angular/core";
import { ScreenPort } from "./screen.port";
import { ScreenService } from "./screen.service";

export class HomeViewModel {
    private screenService = inject<ScreenPort>(ScreenService);

    screenType$ = this.screenService.screenType$;
}