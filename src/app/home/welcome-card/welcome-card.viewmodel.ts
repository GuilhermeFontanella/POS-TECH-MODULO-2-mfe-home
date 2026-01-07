import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import { TransactionService } from "src/services/transactionService.service";
import { ChartService, IChartData } from "../chart/chart.service";
import { TransactionPort } from "../port/transaction.port";
import { TRANSACTION } from "../port/transaction.token";

@Injectable()
export class WelcomeCardViewModel {
    public totalAmmount$ = new BehaviorSubject<number>(0);
    public userData$ = new BehaviorSubject<{name: string | null}>({name: 'Manoel'});
    public chartData$ = new BehaviorSubject<IChartData | null>(null);
    public transactions$ = this.transactionPort.getTransactions();
    public todayDate = new Date();

    public saldoMensal$ = new BehaviorSubject<number>(0);
    public alertaMensagem$!: Observable<string>;
    public userAccountInfo$ = new BehaviorSubject<any>(null);
    public chartData: any;

    constructor(
        private transactionService: TransactionService,
        private chartService: ChartService,
        @Inject(TRANSACTION) private transactionPort: TransactionPort
    ) {}

    init() {
        this.loadTransactions();
        this.loadTotalAmmount();
        this.loadSaldoMensal();
        this.loadChartData();
    }

    private loadTransactions() {
        this.transactionPort.getTransactions().subscribe({
            next: (data) => console.log(data)
        });
    }

    private loadChartData() {
        this.chartService.getChartData$().subscribe({
            next: (data) => this.chartData$.next(data)
        });
    }

    

    private loadSaldoMensal() {
        this.transactionService.getTransactions()
        .pipe(take(1))
        .subscribe(data => {
            const valores = data.map(item =>
            item.categoria.reduce((sum: number, cat: { amount: number }) => sum + cat.amount, 0)
            );
            this.saldoMensal$.next(valores.reduce((acc, val) => acc + val, 0));
        });
    }

    private loadTotalAmmount() {
        this.transactionService.getTransactions()
            .pipe(take(1))
            .subscribe(data => {
                const valores = data.map(item => item.categoria.reduce((sum: number, cat: { ammount: number}) => sum + cat.ammount, 0));
                this.saldoMensal$.next(valores.reduce((total: number, val: number) => total + val, 0));
            });
    }
}