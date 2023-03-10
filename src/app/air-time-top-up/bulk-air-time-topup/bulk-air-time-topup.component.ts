import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { trigger, transition, animate, style } from "@angular/animations";
import { NgxSmartModalService } from "ngx-smart-modal";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { ModalDirective } from "angular-bootstrap-md";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidation } from "app/_services/custom-validator.service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import Swal from "sweetalert2";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import { FileUploader } from "ng2-file-upload";
import { HttpClientService } from "app/_services/HttpClientService";
@Component({
  selector: "app-bulk-air-time-topup",
  templateUrl: "./bulk-air-time-topup.component.html",
  styleUrls: ["./bulk-air-time-topup.component.scss"],
})
export class BulkAirTimeTopupComponent implements OnInit {
  pageTitle: any = "bulk-air-time-topup";
  uploader: FileUploader = new FileUploader({
    url: "test",
    headers: [{ name: "x-auth-token", value: "test" }],
  });

  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  progress = 0;

  private request_options: any = {
    method: "POST",
    path: "",
    body: "",
  };
  noFiles: boolean = true;
  excelError: any = {
    row: null,
    sheet: null,
    column: null,
    descriptionAr: null,
    descriptionEn: null,
  };

  @ViewChild("fileInput",{static: false}) fileInput: ElementRef;
  showFailedData: any;
  successTransaction: any;
  failedTransaction: any;
  failedData: any = [];

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private toaster1: toasterService,
    public dialog: MatDialog,
    private toaster: SweetAlertToastService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
  fileOverBase(e: any): void {
    console.log("fileOverBase: ");
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    console.log("fileOverAnother: ");
    this.hasAnotherDropZoneOver = e;
  }

  async uploadFile(item) {
    // this.ngProgress.start();
    let reader = new FileReader();
    reader.readAsDataURL(item.file.rawFile);
    reader.onload = () => {
      let body = {
        sourceCode: "WEB",
        file: (<string>reader.result).split(",")[1],
      };
      this.httpClientService.httpClientMainRouter("WRMAL_298",`null`,"POST",body)
      .subscribe( async res=> {
        let response = this._sharedService.decrypt(res)
        this.successTransaction = response.body.successTransaction;
        this.failedTransaction = response.body.failedTransaction;
        this.failedData = response.body.bulkExcelDataList;
        this.showFailedData = this.failedData.map((el) => {
          return {
            amount: el.amount,
            walletNumber: el.walletCode,
            description: el.description,
          };
        });
        if (this.failedTransaction <= 0) {
          Swal({
            title: await this.findAllLanguagesService.getTranslate(
              "file-uploaded"
            ),
            text:
              (await this.findAllLanguagesService.getTranslate(
                "The Number Of Successful transactions is "
              )) + this.successTransaction,

            type: "success",
            showConfirmButton: true,
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonText:
              await this.findAllLanguagesService.getTranslate("OK"),
          });
        } else {
          this.openDialog();
        }
        this.removeItem(item);
      },err =>{
        console.log(err)
      });
    };
  }

  onFileChange(event) {
    console.log("event", event);
  }

  removeItem(item) {
    this.fileInput.nativeElement.value = "";
    item.remove();
  }

  async exportTemplate() {
    this.httpClientService.httpClientMainRouter("WRMAL_296",`null`,"GET")
      .subscribe( res =>{
        let response = this._sharedService.decrypt(res)
        this.exportExcel(response.body.base64, response.body.name);
      },err =>{
        console.log(err)
      });
    } 

  exportExcel(data, fileName) {
    console.log("data: ", data);
    var blob = new Blob([this.s2ab(atob(data))], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
    });

    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentDialogBulkATT, {
      data: {
        data: this.showFailedData,
        success: this.successTransaction,
        failed: this.failedTransaction,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog1.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogContentDialogBulkATT {
  today = Date.now();
  layoutDir;
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialogBulkATT>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any // public cashOut: CashOutComponent
  ) {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    // will log the entire data object
    console.log("from DialogContentDialog1", this.data);
  }
}
