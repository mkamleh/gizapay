import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, PageEvent } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgProgress } from "ngx-progressbar";
import Swal from "sweetalert2";
import { AuthServiceService } from "app/_services/authentication-service";
import { CookieService } from "ngx-cookie-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "environments/environment";
import { SharedService } from "app/_services/shared-service";
import { HttpService } from "app/_services/HttpService";
import { toasterService } from "app/_services/toaster-service";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-answer-security-questions",
  templateUrl: "./answer-security-questions.component.html",
  styleUrls: ["./answer-security-questions.component.scss"],
})
export class AnswerSecurityQuestionsComponent implements OnInit {
  securityQuestionsNumber: any;
  public form: FormGroup;

  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  questionsArray: any[] = [];
  answersArray: any[] = [];
  languages: Array<string> = [];
  layoutDir: any;
  currentLang: any = environment.defultLang;

  constructor(
    private _sharedService: SharedService,
    private fb: FormBuilder,
    private httpService: HttpService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthServiceService,
    private ngProgress: NgProgress,
    private toaster: toasterService,
    private cookieService: CookieService,
    public findLanguages: FindAllLanguagesService,
    public translate: TranslateService,
    private httpClientService: HttpClientService,

  ) {
    translate.addLangs(this.languages);

    if (this.cookieService.check("agtLng")) {
      let lang = JSON.parse(this.cookieService.get("agtLng"));
      this.translate.use(lang.code);
      this.layoutDir = lang.direction;
    } else {
      this.translate.use(this.currentLang.code);
      this.layoutDir = this.currentLang.direction;
      this.cookieService.set("agtLng", JSON.stringify(this.currentLang));
    }
  }

  async ngOnInit() {
    if (!this._sharedService.enableNavigation) {
      this.router.navigate(["/authentication/login-signup"]);
    }
    this.loadForm();

    // this.securityQuestionsNumber = this._sharedService.getSecurityQuestionsNumber();
    this.securityQuestionsNumber = this.cookieService.get(
      "sec-Question-No-agt"
    );
    console.log("this.securityQuestionsNumber", this.securityQuestionsNumber);

    this.getSecurityQuestions();
  }

  loadForm() {
    this.form = this.fb.group({
      securityQuestionsId: ["", Validators.compose([Validators.required])],
      answer: ["", Validators.compose([Validators.required])],
    });
  }

  async getSecurityQuestions() {
    //this.request_options.path = `customer/securityQuestion/findAll`;
    this.httpClientService.httpClientMainRouter("WRMAL_302",`null`,"GET")
      .subscribe( res => {
        this.questionsArray = this._sharedService.decrypt(res).body;
      },err =>{
        console.log(err)
      });
  }

  answerQuestion() {
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.form.valid) {
      let obj = {
        securityQuestionsId:
          this.form.value.securityQuestionsId.securityQuestionsId,
        answer: this.form.value.answer,
      };
      this.answersArray.push(obj);

      console.log("answersss", this.answersArray);
      this.questionsArray.splice(
        this.questionsArray.indexOf(this.form.value.securityQuestionsId),
        1
      );
      console.log("this.questionsArray", this.questionsArray);
      this.form.reset();
    }
  }
  editQuestionsArray(question) {
    //   this.questionsArray.splice(this.questionsArray.indexOf(question), 1);
    //   console.log("this.questionsArray", this.questionsArray);
  }

  async submit() {
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.form.valid) {
      let obj = {
        securityQuestionsId:
          this.form.value.securityQuestionsId.securityQuestionsId,
        answer: this.form.value.answer,
      };
      this.answersArray.push(obj);

      console.log("answersss", this.answersArray);
      this.questionsArray.splice(
        this.questionsArray.indexOf(this.form.value.securityQuestionsId),
        1
      );
    }

    if (this.form.valid) {
      let body = {
        questionsAccountResourceList: this.answersArray,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_299",`null`,"POST",body)
      .subscribe( async res => {
        this.form.reset();
        Swal({
          title: await this.findLanguages.getTranslate(
            "Answers-saved-successfully"
          ),
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: await this.findLanguages.getTranslate("ok"),
        }).then(async (result) => {
          if (result.value) {
            this.router.navigate([this.authService.homeUrl]);
          }
        });
      },err =>{
        console.log(err)
      });
    }
  }

  logout() {
    this.router.navigate(["/authentication/login-signup"]);
  }
}
