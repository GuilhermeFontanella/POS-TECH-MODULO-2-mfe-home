import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UploadComponent } from './components/upload/upload.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NewTransactionViewModel } from './new-transaction-viewmodel';

@Component({
  selector: 'app-new-transaction-card',
  templateUrl: './new-transaction-card.component.html',
  styleUrls: ['./new-transaction-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    UploadComponent,
    NzSelectModule,
    NzInputModule,
  ],
  providers: [NewTransactionViewModel]
})
export class NewTransactionCardComponent {
  vm = inject(NewTransactionViewModel);

  handleInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.vm.onValueChange(val);
  } 

  submit() {
    this.vm.saveTransaction();
  }

  optionList = [
    { label: 'Depósito', value: 'income' },
    { label: 'DOC/TED', value: 'transfer' },
    { label: 'Empréstimo e Financiamento', value: 'expense' }
  ];
  selectedValue = this.optionList[0];

  onFileSelected(event: any): void {
    // const input = event.target as HTMLInputElement;

    // if (input.files && input.files[0]) {
    //   const file = input.files[0];
    //   this.receiptFile = file;
    //   this.receiptName = file.name;
    //   const fileType = file.type;
    //   const blobUrl = URL.createObjectURL(file);
    //   this.receiptBlobUrl = blobUrl;
    //   this.isImage = fileType.startsWith('image/');
    //   this.isPDF = fileType === 'application/pdf';
    //   const reader = new FileReader();

    //   reader.onload = () => {
    //     this.receiptPreviewUrl = reader.result as string;
    //   };

    //   reader.readAsDataURL(file);
    // }
  }
}
