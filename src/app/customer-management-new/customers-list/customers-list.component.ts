import { Component, OnInit } from "@angular/core";
import { NgxSmartModalService } from "ngx-smart-modal";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { CustomValidation } from "app/_services/custom-validator.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HttpClientService } from "../../_services/HttpClientService";
import { async } from "@angular/core/testing";
@Component({
  selector: "app-customers-list",
  templateUrl: "./customers-list.component.html",
  styleUrls: ["./customers-list.component.scss"],
})
export class CustomersListComponent implements OnInit {
  pageTitle: any = "customers-list";

  showErrorMsg: boolean;
  errorMsg: string;

  count = 50;
  offset = 0;
  rows: any;
  temp: any = [];

  customers: any = [];

  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  form: FormGroup;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    private router: Router,
    private _formBuilder: FormBuilder,
    private httpClientService: HttpClientService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  async ngOnInit() {
    // this.ngProgress.start();
    this.loadForm();
    await this.getAllCustomers(0);
   // this.ngProgress.done();;
  }
  loadForm() {
    this.form = this._formBuilder.group({
      mobileNo: new FormControl(null, [
        Validators.minLength(9),
        Validators.maxLength(13),
        Validators.pattern("^[0-9]*$"),
      ]),
    });
  }

  getAllCustomers(page) {    
    if (this.form.valid) {
      let mobile = this.form.value.mobileNo || "";
      let serviceParams = "mobile=" + mobile + `&page=${page}&size=${10}`
      this.httpClientService.httpClientMainRouter("WRMAL_395",serviceParams,"GET")
        .subscribe((response:any)=> {
          response = this._sharedService.decrypt(response)
          this.onSuccessCustomerList(response)
        }
        , (err) =>{
      });     
   }
  }

  onSuccessCustomerList(response){
    this.customers = response.body.pageList;
    let detailedRrows = response.body.pageList;
    this.count = response.body.count;
    this.rows = detailedRrows.map((item) => {
    let email = item.email || "---"  ;
    return {
      id: item.id,
      accountId: item.accountId,
      fullName: item.fullNameEN,
      phoneNo: item.mobileNo,
      address: item.address,
      email: email,
      statusId: item.statusId,
      walletLevel: item.walletLevel,
    };
    });
  }

  onPage(event) {
    this.getAllCustomers(event.offset);
  }
  updateFilter(event) {
    const val = event.target.value;
    console.log("searche Value", val);

    // filter our data
    const temp = this.temp.filter((d) => {
      return (
        d.commercialRegisterName.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.billerCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.brandName.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.phoneNo.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.email.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.expDate.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.statusCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
  }

  selectToUpdate(accountId) {
    this.router.navigate(["/customer/create-customer"], {
      queryParams: { accountId: accountId },
    });
  }
}
