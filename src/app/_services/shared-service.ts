import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Encryption } from "./Encryption";
import { ErrorHandling } from "./ErrorHandling";

@Injectable()
export class SharedService {
  // Observable string sources
  constructor(
    private encryption: Encryption,
    private errorHandling: ErrorHandling,
  ) { }
  private emitChangeSource = new Subject();

  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  securityQuestionNumber: number = 0;

  enableNavigation: boolean = false;

  // Service message commands
  emitChange(change: string) {
    this.emitChangeSource.next(change);
  }

  errorHandlingMethod(err){
    this.errorHandling.handleErrorMsg(err)
  }

  decrypt(data){
    return this.encryption.decrypt(data);
  }

  setSecurityQuestionsNumber(securityQuestionNumber) {
    this.securityQuestionNumber = securityQuestionNumber;
  }
  getSecurityQuestionsNumber() {
    return this.securityQuestionNumber;
  }
}
