import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgxSmartModalService } from "ngx-smart-modal";
import { TooltipPosition } from "@angular/material";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CustomValidation } from "app/_services/custom-validator.service";
import { toasterService } from "app/_services/toaster-service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { Encryption } from "app/_services/Encryption";
import Swal from "sweetalert2";
import { HttpClientService } from "app/_services/HttpClientService";
@Component({
  selector: "app-otc-receive",
  templateUrl: "./otc-receive.component.html",
  styleUrls: ["./otc-receive.component.scss"],
})
export class OtcReceiveComponent implements OnInit {
  pageTitle: string = "otc-receive";
  form: FormGroup;
  searchForm: FormGroup;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  showForm: boolean = false;
  data: any;
  isApproved: boolean = false;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    public authService: AuthServiceService,
    public adminLayout: AdminLayoutComponent,
    public fb: FormBuilder,
    public findAllLanguagesService: FindAllLanguagesService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private _sharedService: SharedService,
    public findLanguages: FindAllLanguagesService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.ngProgress.start();
    this.loadForm();
    this.ngProgress.done();
  }
  loadForm() {
    this.searchForm = this.fb.group({
      reference: ["", Validators.compose([Validators.required])],
    });
    this.form = this.fb.group({
      amount: [""],

      senderFullName: [""],
      senderMobileNo: [""],
      senderIdentityNo: [""],

      receiverFullName: [""],
      receiverMobileNo: [""],
      receiverIdentityNo: [""],

      description: [""],
    });
  }

  async OTC_get() {
    if (this.searchForm.valid) {
      let ref = this.searchForm.value.reference;
      this.httpClientService.httpClientMainRouter("WRMAL_381",`reference=${ref}`,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res);
        this.showForm = true;
        this.data = response.body;
        if (this.data.statusCode == "TRANSACTION_APPROVED") {
          this.isApproved = true;
        } else {
          this.isApproved = false;
        }
        this.form.get("receiverFullName").setValue(this.data.receiverFullName);
        this.form
          .get("receiverMobileNo")
          .setValue(this.data.receiverMobileNo.substring(4));
        this.form
          .get("receiverIdentityNo")
          .setValue(this.data.receiverIdentityNo);

        this.form.get("senderFullName").setValue(this.data.senderFullName);
        this.form
          .get("senderMobileNo")
          .setValue(this.data.senderMobileNo.substring(4));
        this.form.get("senderIdentityNo").setValue(this.data.senderIdentityNo);

        this.form.get("amount").setValue(this.data.amount);
      },err =>{
        console.log(err)
      });
    }
  }

  async OTC_receive() {
    ///DONE
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.form.valid) {
      let body = {
        internalReference: this.searchForm.value.reference,
        sourceCode: "WEB",
        description: this.form.value.description,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_382",`null`,"POST",body)
      .subscribe( async res =>{
        Swal({
          title: await this.findAllLanguagesService.getTranslate(
            "otc-received"
          ),
          type: "success",
          showCancelButton: false,
          showCloseButton: true,
        });
        this.form.reset();
        this.searchForm.reset();
        this.showForm = false;
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key).setErrors(null);
        });
      },err =>{
      });
    }
  }
}
