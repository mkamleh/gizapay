/** @format */

import { UserIdleService } from "angular-user-idle";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CustomValidators } from "ng2-validation";
import { AuthServiceService } from "app/_services/authentication-service";
import { CookieService } from "ngx-cookie-service";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { environment } from "environments/environment";
import { operationLanguage } from "app/_services/operationLanguage-service";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { HttpClient } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { CustomValidation } from "app/_services/custom-validator.service";
import { NgxUiLoaderDemoService } from "app/_services/ngx-ui-loader-demo.service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SharedService } from "app/_services/shared-service";
import { Observable } from "rxjs";
import { HttpClientService } from "app/_services/HttpClientService";

// const reCaptcha = new FormControl(null, Validators.required);

@Component({
  selector: "app-login-signup",
  templateUrl: "./login-signup.component.html",
  styleUrls: ["./login-signup.component.scss"],
})
export class LoginSignupComponent implements OnInit {
  //from Login component
  loginForm: FormGroup;
  recaptchaform: FormGroup;
  emailLogin: string;
  passwordLogin: string;
  langForm: FormGroup;
  currentLang: any = environment.defultLang;
  layoutDir = "ltr";
  languages: Array<string> = [];

  //from Login component
  signupForm: FormGroup;
  userName: string;
  brandName: string;
  CRN: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isRequired = false;
  cities: any;
  districts: any;
  city: string;
  OTPform: FormGroup;
  timeLeft: number = 60;
  interval;
  phoneFlage;
  error: any;
  showOTPfield: boolean = false;
  showErrorMsg: boolean;
  errorMsg: any;
  securityQuestionNumber: any;

  robotCheck: any;
  showRecaptcha: boolean = false;
  recaptcha_isValid: boolean = true;
  @ViewChild("myDiv",{static: false}) myDiv: ElementRef;
  code: any;
  canv_: any;

  resolved(captchaResponse: string) {
    this.recaptchaform.get("reCaptcha").setValue(captchaResponse);
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    public translate: TranslateService,
    private operationLang: operationLanguage,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    public ngxSmartModalService: NgxSmartModalService,
    private customValidation: CustomValidation,
    public ngProgress: NgProgress,
    public demoService: NgxUiLoaderDemoService,
    public findAllLanguagesService: FindAllLanguagesService,
    private userIdle: UserIdleService,
    private _sharedService: SharedService,
    private httpClientService: HttpClientService,
    private _sharedServices: SharedService,
    private httpClient: HttpClient
  ) {
    this.operationLang.removeAllLanguage();
    this.operationLang.getAllLanguage();
    this.languages = this.operationLang.languages;

    this.langForm = this.fb.group({
      langControl: [this.languages[1]],
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

    this.getJSON().subscribe((data) => {
      console.log(data);
      this.robotCheck = data.robotCheck;
      console.log("robotCheck", this.robotCheck);
      if (this.robotCheck == 0) {
        this.showRecaptcha = false;
      } else {
        this.showRecaptcha = true;
      }
    });
  }

  ngOnInit() {
    console.log("start")
    this.createCaptcha();
    //Login form
    this.loadForm();
    // this.getCities();
    this.getJSON().subscribe((data) => {
      console.log(data);
      this.robotCheck = data.robotCheck;
      console.log("robotCheck", this.robotCheck);
      if (this.robotCheck == 0) {
        this.showRecaptcha = false;
      } else {
        this.showRecaptcha = true;
        this.getCapcha();
      }
    });
    console.log("end")

  }
  loadForm() {
    let loginPasas = new FormControl("", [Validators.required]);
    this.loginForm = this.fb.group({
      userName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
          this.customValidation.hasArabic(),
        ]),
      ],
      password: loginPasas,
    });
    let codeCaptcha = new FormControl(this.code, []);
    console.log("codeCaptcha", this.code);
    this.recaptchaform = this.fb.group({
      codeCaptcha: codeCaptcha,
      reCaptcha: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.equalTo(codeCaptcha),
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
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
    });

    //Signup form
    let signupPasas = new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]);
    this.signupForm = this.fb.group({
      userName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          // Validators.maxLength(16),
          this.customValidation.hasArabic(),
        ]),
      ],
      brandName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(16),
        ]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.email,
          this.customValidation.hasArabic(),
        ]),
      ],
      phone: [
        null,
        Validators.compose([
          Validators.required,
          // CustomValidators.phone("en-US")
        ]),
      ],
      CRN: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
          // CustomValidators.phone("en-US")
        ]),
      ],
      city: [null, Validators.required],
      district: [null, Validators.required],
      password: signupPasas,
      confirmPassword: new FormControl(
        "",
        CustomValidators.equalTo(signupPasas)
      ),
    });
  }
  getCapcha() {
    console.log("kkk", this.showRecaptcha);

    if (this.showRecaptcha) {
      console.log(this.canv_);
      console.log(this.canv_);
      console.log(this.canv_);
      console.log(this.canv_);
      console.log(this.canv_);
      var canvasData = this.canv_.toDataURL();
      this.myDiv.nativeElement.innerHTML = '<img src="' + canvasData + '">';
      console.log(this.myDiv.nativeElement.innerHTML);
    }
  }
  create() {
    var ctx = document.querySelector("canvas").getContext("2d"),
      dashLen = 220,
      dashOffset = dashLen,
      speed = 100,
      txt = "STROKE x",
      x = 30,
      i = 0;

    ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.globalAlpha = 2 / 3;
    ctx.strokeStyle = ctx.fillStyle = "#1f2f90";
    this.xxop(ctx, dashOffset, dashLen, speed, txt, x, i);
  }
  xxop(ctx, dashOffset, dashLen, speed, txt, x, i) {
    ctx.clearRect(x, 0, 60, 150);
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, 90); // stroke letter

    if (dashOffset > 0) this.xxop(ctx, dashOffset, dashLen, speed, txt, x, i);
    // animate
    else {
      ctx.fillText(txt[i], x, 90); // fill final letter
      dashOffset = dashLen; // prep next char
      x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
      ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
      ctx.rotate(-Math.random() * 0.1); // random rotation
      if (i < txt.length) this.xxop(ctx, dashOffset, dashLen, speed, txt, x, i);
    }
  }

  createCaptcha() {
    //clear the contents of captcha div first
    this.canv_ = "";
    var charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1) {
        captcha.push(charsArray[index]);
      } else {
        i--;
      }
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 150;
    canv.height = 50;

    var ctx = canv.getContext("2d");
    ctx.font = "30px Georgia";

    ctx.strokeText(captcha.join(""), 30, 30);
    ctx.rotate(-Math.random() * 0.15);
    ctx.setTransform(1, 0, 1, 1, 0, 3 * Math.random());

    this.code = captcha.join("");
    console.log("hiiiiiiiii", this.code);

    this.canv_ = canv; // adds the canvas to the body element
    console.log(this.canv_);
  }

  public getJSON(): Observable<any> {
    return this.httpClient.get("assets/config/config.json");
  }

  changeLang() {
    this.translate.use(this.langForm.value.langControl.code);
    this.layoutDir = this.langForm.value.langControl.direction;
    this.cookieService.set(
      "agtLng",
      JSON.stringify(this.langForm.value.langControl)
    );
    window.location.reload();
  }

  ///getOTP component
  getOTP() {
    this.markFormGroupTouched(this.loginForm.controls);
    this.markFormGroupTouched(this.recaptchaform.controls);

    if (this.recaptchaform.valid) {
      this.createCaptcha();
      this.recaptcha_isValid = true;
    } else {
      this.recaptcha_isValid = false;
    }

    if (!this.showRecaptcha) {
      this.recaptcha_isValid = true;
    }
    if (this.loginForm.valid && this.recaptcha_isValid) {

      this.stopTimer();
      console.log("get OTP >>>>>>>>>>>>>>>>>>> >>>>>>>");

      let body = {
        username: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_179",`null`,"POST",body)
      .subscribe( res=>{
        this.showOTPfield = true;
        this.timeLeft = 60;
        this.startTimer();
      },err =>{
        console.log(err)
      });
    } else {
      console.log("error: ", this.loginForm);
    }
  }
  ///Login component
  login() {
    this.markFormGroupTouched(this.loginForm.controls);
    this.markFormGroupTouched(this.OTPform.controls);
    if (this.loginForm.valid && this.OTPform.valid) {
      let body = {
        username: this.loginForm.value.userName,
        password: this.loginForm.value.password,
        otp: this.OTPform.value.confirmOtp,
      };
      let authHeader = btoa(
        "1," +
          this.loginForm.value.userName +
          ",AGT," +
          "en" +
          ":" +
          this.loginForm.value.password
      );
      this.httpClientService.httpClientMainRouter("WRMAL_003"
      ,"null"
      ,"POST"
      ,body
      ,"Basic " + authHeader)
        .subscribe((response:any)=> {
          console.log("hiii")
          this.onSuccessfullLogin(response)
        },
        (err) =>{
          console.log(err)
        });     
    } else {
      console.log("error: ", this.loginForm);
      // this.toaster.showWarning(" ");
    }
  }

  onSuccessfullLogin(response){
    response = this._sharedService.decrypt(response)
    this.authService.homeUrl = "";
    this.authService.isloggedIn = true;
    this.authService.loggedInUser = response.body;
    this.cookieService.set("agt_token", response.body.token);
    window.sessionStorage.setItem("agt_token_check", "true");
    this.cookieService.set(
      "agt_lgnTim",
      this.parseDate(response.body.lastLoginDate)
    );
    this.stopTimer();
    this.securityQuestionNumber = response.body.securityQuestionNumber;  
    this.cookieService.set(
      "sec-Question-No-agt",
      response.body.securityQuestionNumber
    );

    if (this.securityQuestionNumber > 0) {
      this._sharedService.enableNavigation = true;

      this._sharedService.setSecurityQuestionsNumber(
        this.securityQuestionNumber
      );
      this.router.navigate(["/authentication/security-questions"]);
    } else {
      console.log("loool")
      this.router.navigate([this.authService.homeUrl]);
    }
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    // this.userIdle.onTimerStart().subscribe((count) => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.authService.logoutUser();
     // this.ngProgress.done();;
      console.log("Time is up!");
    // alert("Time is up! , you need to login again");
  });
  }
  parseDate(date) {
    let dayOfMonth = date.dayOfMonth.toString();

    if (dayOfMonth.length < 2) {
      dayOfMonth = "0" + dayOfMonth;
    }

    let monthValue = date.monthValue.toString();
    if (monthValue.length < 2) {
      monthValue = "0" + monthValue;
    }

    let hour = date.hour.toString();

    if (hour.length < 2) {
      hour = "0" + hour;
    }

    let minute = date.minute.toString();
    if (minute.length < 2) {
      minute = "0" + minute;
    }

    let second = date.second.toString();
    if (second.length < 2) {
      second = "0" + second;
    }

    let year = date.year;

    return (
      dayOfMonth + "-" + monthValue + "-" + year + " " + hour + ":" + minute
    );
  }
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
  ///Register component
 
  //OTP timer
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.OTPform.get("confirmOtp").setValue(null);
        this.showOTPfield = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }

  private markFormGroupTouched(controls) {
    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
    });
  }
}
