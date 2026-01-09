import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExtratoViewModel } from './extrato.viewmodel';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';


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
    NzInputModule,
    NzModalModule
  ],
  providers: [ExtratoViewModel]
})
export class ExtratoComponent implements OnInit {
  vm = inject(ExtratoViewModel);
  showModal: boolean = false;
  optionList = [
    { label: 'Depósito', value: 'income' },
    { label: 'DOC/TED', value: 'transfer' },
    { label: 'Empréstimo e Financiamento', value: 'expense' }
  ];
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

  openEditModal(transactionId: unknown) {
    this.vm.openEditModal(transactionId);
    this.showModal = true;
  }

  closeEditModal() {
    this.showModal = false;
    this.vm.closeEditModal();
  }

  saveEdit() {
    this.vm.saveEdit();
  }

  deleteCategoria(transactionId: unknown) {
    this.vm.deleteCategoria(transactionId);
  }

  formatCurrencyBRL(value: number): string {
    return this.vm.formatCurrencyBRL(value);
  }

  formatDateBR(dateInput: string | number): string {
    return this.vm.formatDateBR(dateInput);
  }
}
