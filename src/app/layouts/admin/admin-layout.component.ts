/** @format */

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  OnChanges,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MenuItems } from "../../shared/menu-items/menu-items";
import { HorizontalMenuItems } from "../../shared/menu-items/horizontal-menu-items";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

import PerfectScrollbar from "perfect-scrollbar";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { Http } from "@angular/http";
import { environment } from "../../../environments/environment";
import "rxjs/add/operator/map";
import { CookieService } from "ngx-cookie-service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthServiceService } from "app/_services/authentication-service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import { HttpService } from "app/_services/HttpService";
import { NgxUiLoaderDemoService } from "app/_services/ngx-ui-loader-demo.service";
import { TranslateService } from "@ngx-translate/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { SharedService } from "app/_services/shared-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { NgProgress } from "ngx-progressbar";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private _router: Subscription;
  pageTitle: any;

  languages: any[] = [];
  defaultImage = "assets/images/agent_defualt.png";
  today: number = Date.now();
  url: string;
  showSettings = false;
  dark: boolean;
  boxed: boolean;
  collapseSidebar: boolean;
  compactSidebar: boolean;
  horizontal: boolean = false;
  sidebarBg: boolean = true;
  currentLang: any = environment.defultLang;
  layoutDir = "ltr";
  menuLayout: any = "vertical-menu";
  selectedSidebarImage: any = "bg-1";
  selectedSidebarColor: any = "sidebar-default";
  selectedHeaderColor: any = "header-default";
  collapsedClass: any = "side-panel-opened";
  langForm: FormGroup;
  walletId: any;
  showErrorMsg: boolean;
  errorMsg: any;
  error: any;
  lastLoginTime = "";

  firstName: string;
  lastName: string;
  greeting: any;
  wallets: any;
  wallet: any;

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  public now: Date = new Date();

  @ViewChild("sidemenu") sidemenu;
  public config: PerfectScrollbarConfigInterface = {};
  constructor(
    private router: Router,
    public menuItems: MenuItems,
    public horizontalMenuItems: HorizontalMenuItems,
    public translate: TranslateService,
    private http: HttpClient,
    private cookieService: CookieService,
    private fb: FormBuilder,
    public authService: AuthServiceService,
    private operationLang: operationLanguage,
    private httpService: HttpService,
    public demoService: NgxUiLoaderDemoService,
    public findAllLanguagesService: FindAllLanguagesService,
    private toaster: SweetAlertToastService,
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService,
    private _sharedService: SharedService,
    public encryption: Encryption
  ) {
    _sharedService.changeEmitted$.subscribe((title) => {
      this.pageTitle = title;
    });
    //////////////////
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
    }
    //////////////////
  }

  AgentBalance() {
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET").subscribe( res=>{
      this.wallets = this._sharedService.decrypt(res).body;
      this.wallet = this.wallets[0];
    },err =>{
    });
  }

  refresh() {
    if (this.cookieService.check("agt_token")) {
      // this.lastLoginTime = this.cookieService.get("agt_lgnTim");
      if (this.cookieService.check("agt_lgnTim")) {
        this.lastLoginTime = this.cookieService.check("agt_lgnTim")
          ? this.cookieService.get("agt_lgnTim")
          : "";
        console.log("LAST LOGIN", this.lastLoginTime);
      }
      this.httpClientService.httpClientMainRouter("WRMAL_007",`null`,"GET").subscribe( res=>{
        this.authService.loggedInUser = this._sharedService.decrypt(res).body;
        let response = this._sharedService.decrypt(res)
        if (response.body.userRoleCode == "MASTER") {
          this.firstName = response.body.agentProfileResource.agentName;
          this.lastName = "";
        } else {
          this.firstName = response.body.firstName;
          this.lastName = response.body.lastName;
        }
        if (response.body.agentProfileResource) {
          if (response.body.agentProfileResource.agentLogo) {
            this.defaultImage = response.body.agentProfileResource.agentLogo;
          }
        }
        //this.wallet = this.wallets[0];
      },err =>{
      });
    }
  }

  async ngOnInit() {
    ///////////////////////////
    //Getting the Languages
    this.httpClientService.httpClientMainRouter("WRMAL_118",`null`,"GET").subscribe( res=>
      {
        let body = this._sharedService.decrypt(res).body;
        body.map((lngs) => {
          this.languages.push(lngs);
        });
        this.ngProgress.done();
      },err =>{
    });
    await this.refresh();
    await this.AgentBalance();
    this.operationLang.removeAllLanguage();
    this.operationLang.getAllLanguage();
    this.languages = this.operationLang.languages;
    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.url;
        if (this.isOver()) {
          this.sidemenu.close();
        }
        if (
          window.matchMedia(`(min-width: 960px)`).matches &&
          !this.isMac() &&
          !this.compactSidebar &&
          this.layoutDir != "rtl"
        ) {
        }
      });   
    this.getCurrentTime();
  }

  async getCurrentTime() {
    let currentTime = this.now.getHours();
    if (currentTime >= 5 || currentTime <= 12) {
      console.log("Morning");
      this.greeting = await this.findAllLanguagesService.getTranslate(
        "Good Morning"
      );
    } else if (currentTime >= 13 || currentTime <= 17) {
      console.log("Afternoon");
      this.greeting = await this.findAllLanguagesService.getTranslate(
        "Good Afternoon"
      );
    } else if (currentTime >= 18 || currentTime <= 24) {
      console.log("Evening");
      this.greeting = await this.findAllLanguagesService.getTranslate(
        "Good Evening"
      );
    }
  }

  @HostListener("click", ["$event"])
  onClick(e: any) {
    // const elemSidebar = <HTMLElement>(
    //   document.querySelector(".sidebar-container ")
    // );
    // setTimeout(() => {
    //   if (
    //     window.matchMedia(`(min-width: 960px)`).matches &&
    //     !this.isMac() &&
    //     !this.compactSidebar &&
    //     this.layoutDir != "rtl"
    //   ) {
    //     const ps = new PerfectScrollbar(elemSidebar, {
    //       wheelSpeed: 2,
    //       suppressScrollX: true,
    //     });
    //   }
    // }, 350);
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  isOver(): boolean {
    if (
      this.url === "/apps/messages" ||
      this.url === "/apps/calendar" ||
      this.url === "/apps/media" ||
      this.url === "/maps/leaflet"
    ) {
      return true;
    } else {
      return window.matchMedia(`(max-width: 960px)`).matches;
    }
  }

  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }

  menuMouseOver(): void {
    if (
      window.matchMedia(`(min-width: 960px)`).matches &&
      this.collapseSidebar
    ) {
      this.sidemenu.mode = "over";
    }
  }

  menuMouseOut(): void {
    if (
      window.matchMedia(`(min-width: 960px)`).matches &&
      this.collapseSidebar
    ) {
      this.sidemenu.mode = "side";
    }
  }

  menuToggleFunc() {
    this.sidemenu.toggle();

    if (this.collapsedClass == "side-panel-opened") {
      this.collapsedClass = "side-panel-closed";
    } else {
      this.collapsedClass = "side-panel-opened";
    }
  }

  changeMenuLayout(value) {
    if (value) {
      this.menuLayout = "top-menu";
    } else {
      this.menuLayout = "vertical-menu";
      this.menuToggleFunc();
    }
  }

  onSelectSidebarImage(selectedClass, event) {
    this.selectedSidebarImage = selectedClass;
  }

  onSelectedSidebarColor(selectedClass) {
    this.selectedSidebarColor = selectedClass;
  }

  onSelectedHeaderColor(selectedClass) {
    this.selectedHeaderColor = selectedClass;
  }

  isBgActive(value) {
    if (value == this.selectedSidebarImage) {
      return true;
    } else {
      return false;
    }
  }

  isSidebarActive(value) {
    if (value == this.selectedSidebarColor) {
      return true;
    } else {
      return false;
    }
  }

  isHeaderActive(value) {
    if (value == this.selectedHeaderColor) {
      return true;
    } else {
      return false;
    }
  }

  addMenuItem(): void {
    // this.menuItems.add({
    //   state: "menu",
    //   name: "MENU",
    //   type: "sub",
    //   icon: "trending_flat",
    //   children: [
    //     { state: "menu", name: "MENU" },
    //     { state: "timelmenuine", name: "MENU" }
    //   ]
    // });
  }

  changeLang() {
    this.translate.use(this.langForm.value.langControl.code);
    this.layoutDir = this.langForm.value.langControl.direction;
    this.cookieService.set(
      "agtLng",
      JSON.stringify(this.langForm.value.langControl)
    );
    location.reload();
  }

  toViewProfile() {
    this.router.navigate(["/user-profile"]);
  }
  signOut() {
    this.authService.logoutUser();
    this.ngProgress.done();
  }

  toChangeSecurityQuestion() {
    this.router.navigate(["/change-security-question"]);
  }

  toChangePassword() {
    if (
      this.authService.loggedInUser &&
      this.authService.loggedInUser.userRoleCode === "MASTER"
    ) {
      this.router.navigate(["/change-password-master"]);
    } else {
      this.router.navigate(["/change-password"]);
    }
  }
  getWalletId() {
    if (this.wallet.id) {
      console.log("this.walletId >>>>>>..", this.wallet.id);

      return this.wallet.id;
    }
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
}
