import { DatePipe, CurrencyPipe, TitleCasePipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable, Subscription, take, map} from 'rxjs';
import { TransactionService } from 'src/services/transactionService.service';
import { UserAccountService } from 'src/services/user-account.service';
import { IUser } from 'src/utils/model/user-interface';
import { UserDataHandler } from 'src/utils/store-user-data';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-welcome-card',
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    NzDividerModule,
    NzIconModule,
    NzCardModule,
    NzButtonModule
  ]
})
export class WelcomeCardComponent implements OnInit, OnDestroy {
  todayDate: Date = new Date();
  showAmmount: boolean = false;
  userData: IUser | null = null;
  userHandler?: UserDataHandler;
  userAccountInfo: any;
  totalAmmount: number = 0;
  checkTotalAmmount$ = new Subscription();
  userAccountInfo$ = new Subscription();
  alertaMensagem$!: Observable<string>;


  dashboardVisible = false;
  metaEconomia = 10000;
  alertaGastoPercentual = 85;

  constructor(
    private userAccountService: UserAccountService,
    private transactionService: TransactionService
  ) {
    this.userHandler = new UserDataHandler();
    this.userData = this.userHandler.getUserStored() ?? null;
  }

  ngOnInit(): void {
    this.transactionService.getAccountFunds();
    this.getUserAccountInfo();
    this.checkTotalAmmount();
    this.alertaMensagem$ = this.calcularAlerta$(this.totalAmmount, this.metaEconomia);
  }

  ngOnDestroy(): void {
    this.checkTotalAmmount$.unsubscribe();
    this.userAccountInfo$.unsubscribe();
  }

  checkTotalAmmount() {
    this.checkTotalAmmount$ = this.transactionService.totalAmmount.subscribe((value) => {
      this.totalAmmount = value
    });
  }
  getUserAccountInfo() {
    if (this.userData) {
      this.userAccountService.getUserAccountInfo(this.userData?.accountId)
        .subscribe((accountInfo) => {
          this.userAccountInfo = accountInfo;
          console.log('Informações da conta do usuário:', this.userAccountInfo);
        });

    }
  }

  public formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  public formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  }


  openDashboard() {
    this.dashboardVisible = true;
    setTimeout(() => this.initCharts(), 100);
  }

  closeDashboard() {
    this.dashboardVisible = false;
  }

  hideAmmount() {
    this.showAmmount = !this.showAmmount;
  }

  initCharts(): void {
    this.transactionService.getTransactions()
      .pipe(take(1))
      .subscribe(data => {
        console.log('Dados recebidos para os gráficos:', data);
        const labels = data.map(item => item.month);
        const valores = data.map(item =>
          item.categoria.reduce((sum: number, cat: { amount: number }) => sum + cat.amount, 0)
        );


        const ctx1 = document.getElementById('chartDesempenho') as HTMLCanvasElement;
        new Chart(ctx1, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Saldo Mensal',
              data: valores,
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true
          }
        });

        const tipoTotaisMap = new Map<string, number>();

        data.forEach(item => {
          item.categoria.forEach((cat: { description: string; amount: number; }) => {
            const tipo = cat.description;
            const valor = cat.amount;
            tipoTotaisMap.set(tipo, (tipoTotaisMap.get(tipo) || 0) + valor);
          });
        });

        const tipoLabels = Array.from(tipoTotaisMap.keys());
        const tipoValores = Array.from(tipoTotaisMap.values());

        const ctx2 = document.getElementById('chartGastos') as HTMLCanvasElement;
        new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: tipoLabels,
            datasets: [{
              data: tipoValores.map(v => Math.abs(v)),
              backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        });
      });
  }
  calcularAlerta$(saldoMensal: number, metaEconomia: number): Observable<string> {
    
    return this.transactionService.getTransactions().pipe(
      take(1),
      map(transacoes => {
        const totalGastos = transacoes
          .flatMap(t => t.categoria)
          .filter(c => c.amount < 0)
          .reduce((sum, c) => sum + Math.abs(c.amount), 0);

        const limite = saldoMensal - metaEconomia;
        const percentual = limite > 0 ? (totalGastos / limite) * 100 : 0;

        if (percentual >= 100) {
          return `🚨 Você excedeu seu limite de gastos! (${percentual.toFixed(0)}%)`;
        } else if (percentual >= 90) {
          return `⚠️ Atenção! Você já gastou ${percentual.toFixed(0)}% do limite permitido.`;
        } else {
          return `✅ Seus gastos estão dentro do limite (${percentual.toFixed(0)}%).`;
        }
      })
    );
  }
}
