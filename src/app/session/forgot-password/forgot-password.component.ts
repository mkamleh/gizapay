import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { AuthServiceService } from "app/_services/authentication-service";
import { CookieService } from "ngx-cookie-service";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgxSmartModalService } from "ngx-smart-modal";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import { CustomValidation } from "app/_services/custom-validator.service";
import { CustomValidators } from "ng2-validation";
import { NgIf } from "@angular/common";
import Swal from "sweetalert2";
import { Encryption } from "app/_services/Encryption";
import { toasterService } from "app/_services/toaster-service";
import { HttpService } from "app/_services/HttpService";
import { HttpClientService } from "app/_services/HttpClientService";

const password = new FormControl("", [
  Validators.required,
  Validators.minLength(4),
  // Validators.pattern(
  //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+!=./*_(),])(?=\S+$).{8,}$/
  // ),
]);
const confirmPassword = new FormControl("", CustomValidators.equalTo(password));

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  otpCode: any;
  showUserNameCard: boolean = true;
  showOTPCard: boolean = false;
  showNewPassord: boolean = false;
  error: any;

  showSecurityQuestions: boolean = false;

  currentLang: any = environment.defultLang;
  layoutDir = "ltr";
  userForm: FormGroup;
  OTPform: FormGroup;
  confirmOTPform: FormGroup;
  langForm: FormGroup;
  answersForm: FormGroup;
  languages: string[] = [];
  inputValue = "+251";

  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  questionsArray: any[] = [];
  answersArray: any[] = [];
  securityQuestionsResources: any[] = [];

  questionsNumber: any;

  dynamicForm: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    public translate: TranslateService,
    private http: HttpClient,
    public ngxSmartModalService: NgxSmartModalService,
    public findLanguages: FindAllLanguagesService,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this.langForm = this.fb.group({
      langControl: [this.languages[1]],
    });
    this.userForm = this.fb.group({
      userName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
          this.customValidation.hasArabic(),
        ]),
      ],
    });

    this.OTPform = this.fb.group({
      confirmOtp: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]),
      ],
    });
    this.confirmOTPform = this.fb.group({
      password: password,
      confirmPassword: confirmPassword,
    });

    translate.addLangs(this.languages);

    if (this.cookieService.check("agtLng")) {
      let lang = JSON.parse(this.cookieService.get("agtLng"));
      this.translate.use(lang.code);
      this.layoutDir = lang.direction;
      this.langForm.get("langControl").setValue(lang);
    } else {
      this.translate.use(this.currentLang.code);
      this.layoutDir = this.currentLang.direction;
      this.cookieService.set("agtLng", JSON.stringify(this.currentLang));
    }
  }
  ngOnInit() {
    this.loadAnswersForm();
    this.getInputsNumber(0);
  }

  send() {
    if (this.userForm.valid) {
      let data = { username: this.userForm.value.userName };
      return this.httpClientService.httpClientMainRouter("WRMAL_388",`null`,"POST",data)
      .subscribe( res => {
        let data: any = this.encryption.decrypt(res);
        this.showUserNameCard = !this.showUserNameCard;
        this.showOTPCard = !this.showOTPCard;
        this.ngProgress.done();
        this.error = "";
      },err =>{
        console.log(err)
      });
    }
  }

  otpCheck(showOTPCard) {
    if (showOTPCard.valid) {
      let data = {
        username: this.userForm.value.userName,
        otp: this.OTPform.value.confirmOtp,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_389",`null`,"POST",data)
      .subscribe( res => {
        let data: any = this.encryption.decrypt(res);
        this.questionsNumber = data.body.securityQuestionsNumber;
        this.getInputsNumber(
          data.body.securityQuestionsCaptionResources.length
        );
        this.questionsArray = data.body.securityQuestionsCaptionResources;
        /// to reflect the recived OTP in the otp modal PS:
        /// remember to remove it
        this.showOTPCard = !this.showOTPCard;
        this.showSecurityQuestions = true;
      },err =>{
        console.log(err)
      });
    }
  }

  changePassword(formUser, formOtp, formChangePass) {
    if (formChangePass.valid) {
      let data = {
        username: this.userForm.value.userName,
        otp: this.OTPform.value.confirmOtp,
        newPassword: this.confirmOTPform.value.password,
        confirmPass: this.confirmOTPform.value.confirmPassword,
      };
      return this.httpClientService.httpClientMainRouter("WRMAL_391",`null`,"POST",data)
      .subscribe( res => {
        /// to reflect the recived OTP in the otp modal PS:
        /// remember to remove it
        this.authService.logoutUser();
        this.toaster.showSuccess("password successfuly changed");
        // reset all the form on submitting
        this.userForm.reset();
        this.OTPform.reset();
        this.confirmOTPform.reset();
        formUser.resetForm();
        formOtp.resetForm();
        formChangePass.resetForm();
        this.router.navigate(["/login-signup"]);
      },err =>{
        console.log(err)
      });
    }
  }

  loadAnswersForm() {
    this.answersForm = new FormGroup({
      answers: new FormArray([]),
    });
  }
  getInputsNumber(number) {
    let i = 0;
    for (i; i < number; i++) {
      this.answers.push(new FormControl(""));
      console.log(i, this.answers);
    }
  }
  get answers(): FormArray {
    return this.answersForm.get("answers") as FormArray;
  }
  async onFormSubmit() {
    if (this.answersForm.valid) {
      for (let i = 0; i < this.answers.length; i++) {
        console.log(this.answers.at(i).value);
        this.answersArray.push(this.answers.at(i).value);
      }
      for (let i = 0; i < this.answersArray.length; i++) {
        if (this.answersArray[i] != "") {
          this.securityQuestionsResources.push({
            answer: this.answersArray[i],
            securityQuestionsId: this.questionsArray[i].securityQuestionsId,
          });
        }
      }
      if (this.securityQuestionsResources.length < this.questionsNumber) {
        Swal(
          await this.findLanguages.getTranslate("warning!"),
          (await this.findLanguages.getTranslate("please answer at least")) +
            this.questionsNumber +
            (await this.findLanguages.getTranslate("questions")),
          "warning"
        );

        this.securityQuestionsResources = [];
        this.answersArray = [];
        return;
      }
      
      let data = {
        username: this.userForm.value.userName,
        securityQuestionsResources: this.securityQuestionsResources,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_390",`null`,"POST",data)
      .subscribe( res => {
        this.showNewPassord = !this.showNewPassord;
        this.showSecurityQuestions = !this.showSecurityQuestions;
        this.securityQuestionsResources = [];
        this.answersArray = [];
        this.answersForm.reset();
      },err =>{
        console.log(err)
      });
    }
  }
}
