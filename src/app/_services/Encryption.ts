

import { Injectable } from "@angular/core"
import * as CryptoJS from 'crypto-js';


@Injectable()

export class Encryption {
    public AesUtil: any = ""
    
    constructor( ) {


        this.AesUtil = function(keySize, iterationCount) {
            this.keySize = keySize / 32;
            this.iterationCount = iterationCount;
          };
          
        this.AesUtil.prototype.generateKey = function(salt, passPhrase) {
            var key = CryptoJS.PBKDF2(
                passPhrase, 
                CryptoJS.enc.Hex.parse(salt),
                { keySize: this.keySize, iterations: this.iterationCount });
            return key;
          };
          
          this.AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
            var key = this.generateKey(salt, passPhrase);
            var encrypted = CryptoJS.AES.encrypt(
                plainText,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          };
          
          this.AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
            var key = this.generateKey(salt, passPhrase);
            var cipherParams = CryptoJS.lib.CipherParams.create({
              ciphertext: CryptoJS.enc.Base64.parse(cipherText)
            });
            var decrypted = CryptoJS.AES.decrypt(
                cipherParams,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
          };
    }
    encrypt(data) {
    
        var AesUtil = function(keySize, iterationCount) {
            this.keySize = keySize / 32;
            this.iterationCount = iterationCount;
          };
          
          AesUtil.prototype.generateKey = function(salt, passPhrase) {
            var key = CryptoJS.PBKDF2(
                passPhrase, 
                CryptoJS.enc.Hex.parse(salt),
                { keySize: this.keySize, iterations: this.iterationCount });
            return key;
          };
          
          AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
            var key = this.generateKey(salt, passPhrase);
            var encrypted = CryptoJS.AES.encrypt(
                plainText,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          };
          
          AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
            var key = this.generateKey(salt, passPhrase);
            var cipherParams = CryptoJS.lib.CipherParams.create({
              ciphertext: CryptoJS.enc.Base64.parse(cipherText)
            });
            var decrypted = CryptoJS.AES.decrypt(
                cipherParams,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
          };
      
      
    
        var iterationCount = 1000;
        var keySize = 128;
        var passphrase = '$@y+>DUFbT3Fd9VA1s';
    
        var four = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
        var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
        var aesUtil = new AesUtil(keySize, iterationCount);
        var ciphertext = aesUtil.encrypt(salt, four, passphrase, JSON.stringify(data));
        var ciphertextBase64 = btoa(four+"::"+salt+"::"+ciphertext);
          return ciphertextBase64
    
    
      }

     decrypt(data) {
        var AesUtil = function(keySize, iterationCount) {
            this.keySize = keySize / 32;
            this.iterationCount = iterationCount;
          };
          
          AesUtil.prototype.generateKey = function(salt, passPhrase) {
            var key = CryptoJS.PBKDF2(
                passPhrase, 
                CryptoJS.enc.Hex.parse(salt),
                { keySize: this.keySize, iterations: this.iterationCount });
            return key;
          };
          
          AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
            var key = this.generateKey(salt, passPhrase);
            var encrypted = CryptoJS.AES.encrypt(
                plainText,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          };
          
          AesUtil.prototype.decrypt = function(salt, iv, passPhrase, cipherText) {
            var key = this.generateKey(salt, passPhrase);
            var cipherParams = CryptoJS.lib.CipherParams.create({
              ciphertext: CryptoJS.enc.Base64.parse(cipherText)
            });
            var decrypted = CryptoJS.AES.decrypt(
                cipherParams,
                key,
                { iv: CryptoJS.enc.Hex.parse(iv) });
            return decrypted.toString(CryptoJS.enc.Utf8);
          };
    
        var iterationCount = 1000;
        var keySize = 128;
   
        var passphrase = '$@y+>DUFbT3Fd9VA1s';
    

        var aesUtil = new AesUtil(keySize, iterationCount);
  
        var b64_to_utf8 = decodeURIComponent(escape(window.atob( data )))
        var arr = b64_to_utf8.split("::")
        // decrypt = function(salt, iv, passPhrase, cipherText)
        var decrypt = aesUtil.decrypt(arr[1], arr[0], passphrase, arr[2]);

        return JSON.parse(decrypt)
    
      }

}