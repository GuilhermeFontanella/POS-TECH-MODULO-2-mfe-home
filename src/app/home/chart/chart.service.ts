import { Injectable } from "@angular/core";
import { Chart } from "chart.js";
import { map, Observable, of, take } from "rxjs";
import { TransactionService } from "src/services/transactionService.service";

export interface IChartData {
    desempenho: { labels: string[]; valores: number[] };
    gastos: { labels: string[]; valores: number[] };
}

@Injectable({providedIn: 'root'})
export class ChartService {
    getChartData$(): Observable<IChartData> {
        return of({
            desempenho: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                valores: [0, 50, 100, 250, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000]
            },
            gastos: {
                labels: ['Alimentação', 'Transporte', 'Moradia', 'Lazer'],
                valores: [1000, 500, 2000, 800]
            }
        });
    }
}