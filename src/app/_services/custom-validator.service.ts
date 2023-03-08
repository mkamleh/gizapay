import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';


@Injectable()
export class CustomValidation {


  constructor() {
  }

  hasNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let hasNumber = /\d/.test(control.value);
      const valid = hasNumber;
      if (!valid) {
        return { hasNumber: true };
      }
      return null;
    };
  }


  hasUpper(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let hasUpper = /[A-Z]/.test(control.value);
      const valid = hasUpper;
      if (!valid) {
        return { hasUpper: true };
      }
      return null;
    };
  }

  hasLower(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let hasLower = /[a-z]/.test(control.value);
      const valid = hasLower;
      if (!valid) {
        return { hasLower: true };
      }
      return null;
    };
  }

  hasSpicalChar(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let hasSpicalChar = /[!@#\$%\^&]/.test(control.value);
      const valid = hasSpicalChar;
      if (!valid) {
        return { hasSpicalChar: true };
      }
      return null;
    };
  }

  startLetter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let startLetter = /^[a-z]/i.test(control.value);
      const valid = startLetter;
      if (!valid) {
        return { startLetter: true };
      }
      return null;
    };
  }


  dateGreaterThan(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      var expiaryDate = new Date(input);

      var issueDate = new Date(control.root.value[field_name]);


      let isValid = true
      if(control.root.value[field_name] === ""){
        console.log("expiredate null -----> return true");
        return { 'dateGreaterThan': { isValid } }
      }

      isValid = expiaryDate > issueDate;
      console.log("continue -----> "+isValid);
      if (!isValid)
        return { 'dateGreaterThan': { isValid } }
      else
        return null;
    };
  }

  dateLessThan(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      var issueDate = new Date(input);

      var expiaryDate = new Date(control.root.value[field_name]);

      let isValid = true
      if(control.root.value[field_name] === ""){
        console.log("issue null -----> return true");
        return { 'dateLessThan': { isValid } }
      }

      isValid = issueDate < expiaryDate;
      console.log("continue -----> "+isValid);
      if (!isValid)
        return { 'dateLessThan': { isValid } }
      else
        return null;
    };
  }

  isNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let isNotNumber = isNaN(control.value);
      console.log("isNotNumber: "+isNotNumber)
      const valid = !isNotNumber;
      if (!valid) {
        return { isNotNumber: true };
      }
      return null;
    };
  }


  hasArabic(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let hasArabic = /[\u0600-\u06FF]/.test(control.value);
      const valid = !hasArabic;
      if (!valid) {
        return { hasArabic: true };
      }
      return null;
    };
  }

}
