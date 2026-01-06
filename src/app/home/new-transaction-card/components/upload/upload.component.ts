import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
    selector: 'app-upload',
    template: `
        <nz-upload
        nzAction="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        [nzFileList]="fileList"
        (nzChange)="handleChange($event)"
        >
        <button nz-button>
            <span nz-icon nzType="upload"></span>
            Carregar arquivo
        </button>
        </nz-upload>
    `,
    standalone: true,
    imports: [
        CommonModule,
        NzUploadModule
    ]
})
export class UploadComponent {
    public fileList: NzUploadFile[] = [];

    handleChange(info: NzUploadChangeParam): void {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });

        this.fileList = fileList;
    }
}