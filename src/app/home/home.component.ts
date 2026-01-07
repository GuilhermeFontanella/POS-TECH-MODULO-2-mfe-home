import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, inject, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ExtratoComponent } from 'src/app/home/extrato/extrato.component';
import { checkScreenSize, ScreenType } from 'src/utils/check-screen-size';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';
import { NewTransactionCardComponent } from './new-transaction-card/new-transaction-card.component';
import { HomeViewModel } from './home.viewmodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ExtratoComponent,
    WelcomeCardComponent,
    NewTransactionCardComponent
  ],
  providers: [
    HomeViewModel
  ],
})
export class HomeComponent {
  vm = inject(HomeViewModel);
}
