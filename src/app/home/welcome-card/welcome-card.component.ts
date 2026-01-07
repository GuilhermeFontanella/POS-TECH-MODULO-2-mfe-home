import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Chart, registerables } from 'chart.js';
import { OverlayModule } from '@angular/cdk/overlay';
import { WelcomeCardViewModel } from './welcome-card.viewmodel';
import { ChartService } from '../chart/chart.service';
import { ChartComponent } from '../chart/chart.component';
import { BehaviorSubject } from 'rxjs';
import { TRANSACTION } from '../port/transaction.token';
import { TransactionsFirebaseService } from 'src/app/infra/firebase/transactions-firebase.service';

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
    NzButtonModule,
    OverlayModule,
    ChartComponent
  ],
  providers: [
    WelcomeCardViewModel,
    { provide: TRANSACTION, useClass: TransactionsFirebaseService }
  ]
})
export class WelcomeCardComponent {
  @ViewChild('chartDesempenho', { static: false }) desempenhoEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartGastos', { static: false }) gastosEl!: ElementRef<HTMLCanvasElement>;
  dashboardVisible = false;
  showAmmount = false;


  constructor(
    public vm: WelcomeCardViewModel,
  ) {}

  ngOnInit(): void {
    this.vm.init();
  }

  openDashboard() {
    this.dashboardVisible = true;
  }

  cloaseDashboard() {
    this.dashboardVisible = false;
  }

  toggleAmmount() {
    this.showAmmount = !this.showAmmount;
  }

  formatCurrencyBRL(value: BehaviorSubject<number>): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value.value);
  }

  formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
  }
}
