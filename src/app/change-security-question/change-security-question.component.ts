import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { toasterService } from "app/_services/toaster-service";
import { HttpClientService } from "app/_services/HttpClientService";
@Component({
  selector: "app-change-security-question",
  templateUrl: "./change-security-question.component.html",
  styleUrls: ["./change-security-question.component.scss"],
})
export class ChangeSecurityQuestionComponent implements OnInit {
  pageTitle: string = "change_security_question";
  form: FormGroup;
  changeForm: FormGroup;

  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  questionsArray: any[] = [];
  newQuestionsArray: any[] = [];
  selectNewQuestion: boolean = false;
  noSecurityQuestions: boolean = false;

  constructor(
    private httpService: HttpService,
    private _sharedService: SharedService,
    private fb: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    private http: HttpClient,
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService,
    private toaster: toasterService,
    public findLanguages: FindAllLanguagesService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    // this.ngProgress.start();

    this.getSecurityQuestions();

    this.form = this.fb.group({
      securityQuestionsId: [null, Validators.compose([Validators.required])],
      answer: [null, Validators.compose([Validators.required])],
    });
    this.changeForm = this.fb.group({
      securityQuestionsId: [null, Validators.compose([Validators.required])],
      answer: [null, Validators.compose([Validators.required])],
    });
   // this.ngProgress.done();;
  }

  getSecurityQuestions() {
    this.httpClientService.httpClientMainRouter("WRMAL_300",`null`,"GET")
      .subscribe( res => {
        this.questionsArray = this._sharedService.decrypt(res).body;
        if (this.questionsArray.length == 0) {
          this.noSecurityQuestions = true;
        } else {
          this.noSecurityQuestions = false;
        }   
      },err =>{
      });
  }

  async getNewSecurityQuestions(id) {
    this.httpClientService.httpClientMainRouter("WRMAL_302","securityQuestionsId=" + id,"GET")
      .subscribe( res =>{
        this.newQuestionsArray = this._sharedService.decrypt(res).body;
      },err =>{
      });
  }

  validateSecurityQuestion() {
    if (this.form.valid) {
      let body = {
        securityQuestionsId:
          this.form.value.securityQuestionsId.securityQuestionsId,
        answer: this.form.value.answer,
      };

      this.httpClientService.httpClientMainRouter("WRMAL_301",`null`,"POST",body)
      .subscribe( res =>{
        this.getNewSecurityQuestions(
          this.form.value.securityQuestionsId.securityQuestionsId
        );
        this.selectNewQuestion = true;
      },err =>{
      });
    }
  }

  changeSecurityQuestion() {
    if (this.changeForm.valid) {
      let body = {
        securityQuestionsId:
          this.form.value.securityQuestionsId.securityQuestionsId,
        securityQuestionsIdNew:
          this.changeForm.value.securityQuestionsId.securityQuestionsId,
        answer: this.changeForm.value.answer,
      };

      this.httpClientService.httpClientMainRouter("WRMAL_303",`null`,"POST",body)
      .subscribe( async res =>{
        this.changeForm.reset();
        this.form.reset();
        this.selectNewQuestion = false;
        this.getSecurityQuestions();
        this.toaster.showSuccess(
          await this.findLanguages.getTranslate("sec-question-changed")
        );
       
      },err =>{
        console.log(err)
      });
    }
  }
}
