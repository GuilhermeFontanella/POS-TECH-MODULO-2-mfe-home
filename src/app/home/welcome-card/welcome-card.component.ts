import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Chart, registerables } from 'chart.js';
import { OverlayModule } from '@angular/cdk/overlay';
import { WelcomeCardViewModel } from './welcome-card.viewmodel';
import { ChartComponent } from '../chart/chart.component';
import { BehaviorSubject, Observable } from 'rxjs';

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
  providers: [WelcomeCardViewModel]
})
export class WelcomeCardComponent {
  @ViewChild('chartDesempenho', { static: false }) desempenhoEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartGastos', { static: false }) gastosEl!: ElementRef<HTMLCanvasElement>;
  dashboardVisible = false;
  showAmmount = false;
  public balance!: Observable<number>;


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

  formatCurrencyBRL(value: number | null): string {
    const amount = value ?? 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  }

  formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR');
  }
}
