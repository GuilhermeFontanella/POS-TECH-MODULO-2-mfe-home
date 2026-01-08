import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ExtratoComponent } from 'src/app/home/extrato/extrato.component';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';
import { NewTransactionCardComponent } from './new-transaction-card/new-transaction-card.component';
import { HomeViewModel } from './home.viewmodel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UserFirebaseService } from '../infra/firebase/user-firebase.service';

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
    ExtratoComponent,
    WelcomeCardComponent,
    NewTransactionCardComponent
  ],
  providers: [
    HomeViewModel,
    UserFirebaseService
  ],
})
export class HomeComponent {
  vm = inject(HomeViewModel);
}
