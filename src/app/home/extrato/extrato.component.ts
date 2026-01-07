import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { TransactionService } from 'src/services/transactionService.service';
import { Categoria, Transaction } from 'src/utils/model/extrato-transaction';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExtratoViewModel } from './extrato.viewmodel';
import { TRANSACTION } from '../port/transaction.token';
import { TransactionsFirebaseService } from 'src/app/infra/firebase/transactions-firebase.service';
import { PortalModule } from '@angular/cdk/portal';


@Component({
  selector: 'app-extrato',
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    InfiniteScrollModule,
    NzSelectModule,
    NzDatePickerModule,
    OverlayModule,
    NzIconModule,
    NzButtonModule,
    PortalModule,
  ],
  providers: [
    ExtratoViewModel,
    { provide: TRANSACTION, useClass: TransactionsFirebaseService }
  ]
})
export class ExtratoComponent implements OnInit {
  vm = inject(ExtratoViewModel);
  showModal: boolean = false;

  editForm = this.vm.editForm;

  ngOnInit(): void {
      this.vm.init();
  }

  applyFilters(event?: Event) {
    event?.preventDefault();
    this.vm.applyFilters();
  }

  clearFilters() {
    this.vm.clearFilters();
  }

  openEditModal(transactionId: number, categoriaId: number) {
    this.vm.openEditModal(transactionId, categoriaId);
    this.showModal = true;
  }

  closeEditModal() {
    this.vm.closeEditModal();
    this.showModal = false;
  }

  saveEdit() {
    this.vm.saveEdit();
  }

  deleteCategoria(transactionId: number, categoriaId: number) {
    this.vm.deleteCategoria(transactionId, categoriaId);
  }

  formatCurrencyBRL(value: number): string {
    return this.vm.formatCurrencyBRL(value);
  }

  formatDateBR(dateInput: string | number): string {
    return this.vm.formatDateBR(dateInput);
  }
}
