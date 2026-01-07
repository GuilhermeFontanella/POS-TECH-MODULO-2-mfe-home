import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { HomeComponent } from "./home.component";
import { authTokenInterceptor } from "../interceptors/auth-token.interceptor";
import { authErrorInterceptor } from "../interceptors/auth-error.interceptor";

export const HomeRoutes = [
    { 
        path: '', 
        component: HomeComponent,
        providers: [
            provideHttpClient(
                withInterceptors([
                    authTokenInterceptor,
                    authErrorInterceptor
                ])
            )
        ]
    }
]