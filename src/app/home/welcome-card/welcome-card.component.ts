import { DatePipe, CurrencyPipe, TitleCasePipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/services/transactionService.service';
import { UserAccountService } from 'src/services/user-account.service';
import { IUser } from 'src/utils/model/user-interface';
import { UserDataHandler } from 'src/utils/store-user-data';

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
        });

    }
  }

  hideAmmount() {
    this.showAmmount = !this.showAmmount;
  }

  public formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  public formatDateBR(dateInput: string | number): string {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  }
}
