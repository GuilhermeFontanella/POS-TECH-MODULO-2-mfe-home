import { inject, Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { ChartService, IChartData } from "../chart/chart.service";
import { TRANSACTION } from "../port/transaction.token";
import { UserFirebaseService } from "src/app/infra/firebase/user-firebase.service";
import { User } from "src/utils/model/user-interface";
import { BalanceFirebaseService } from "src/app/infra/firebase/balance-firebase.service";

@Injectable()
export class WelcomeCardViewModel implements OnDestroy {
    private transactionService = inject(TRANSACTION);
    private balanceService = inject(BalanceFirebaseService);
    public totalAmmount$ = new BehaviorSubject<number>(0);
    public chartData$ = new BehaviorSubject<IChartData | null>(null);
    public transactions$ = this.transactionService.getTransactions();
    public todayDate = new Date();
    public saldoMensal$ = new BehaviorSubject<number>(0);
    public alertaMensagem$!: Observable<string>;
    public userAccountInfo$ = new BehaviorSubject<any>(null);
    public chartData: any;
    public balance$ = this.balanceService.balance$;
    private destroy$ = new Subject<void>();

    constructor(
        private chartService: ChartService,
        private userFireBaseService: UserFirebaseService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    init() {
        this.loadChartData();
        this.loadUserInfo();
    }

    private loadUserInfo() {
        const user = sessionStorage.getItem('user');
        if (!user) return;

        const parsedUser = JSON.parse(user) as User;

        this.userFireBaseService.getUserInfo(parsedUser.id).subscribe({
            next: (value) => this.userAccountInfo$.next(value)
        });

        this.balanceService.getBalance(parsedUser.id).subscribe()
    }

    private loadChartData() {
        this.chartService.getChartData$().subscribe({
            next: (data) => this.chartData$.next(data)
        });
    }
}