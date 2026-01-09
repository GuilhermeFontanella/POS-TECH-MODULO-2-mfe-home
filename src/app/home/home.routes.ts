import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { HomeComponent } from "./home.component";
import { authTokenInterceptor } from "../infra/interceptors/auth-token.interceptor";
import { authErrorInterceptor } from "../infra/interceptors/auth-error.interceptor";
import { UserFirebaseService } from "../infra/firebase/user-firebase.service";
import { TransactionsFirebaseService } from "../infra/firebase/transactions-firebase.service";
import { TRANSACTION } from "./port/transaction.token";
import { BalanceFirebaseService } from "../infra/firebase/balance-firebase.service";

export const HomeRoutes = [
    { 
        path: '', 
        component: HomeComponent,
        providers: [
            UserFirebaseService,
            BalanceFirebaseService,
            { provide: TRANSACTION, useClass: TransactionsFirebaseService },
            provideHttpClient(
                withInterceptors([
                    authTokenInterceptor,
                    authErrorInterceptor
                ])
            )
        ]
    }
]