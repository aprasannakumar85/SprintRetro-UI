
export class EncryptDecrypt {

  // Methods for the encrypt and decrypt Using AES
  static async encryptUsingAES256(encryptData: any, key: any) {
    var encrypted: any;
    await import('crypto-js')
      .then(module => {
        encrypted = module.AES.encrypt(module.enc.Utf8.parse(JSON.stringify(encryptData)), key, {
          keySize: 128 / 8,
          iv: key,
          mode: module.mode.CBC,
          padding: module.pad.Pkcs7
        });
      })
      .catch(err => {
        console.log(err);
      });

    // var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(encryptData)), key, {
    //   keySize: 128 / 8,
    //   iv: key,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });
    return '' + encrypted;
  }

  static async decryptUsingAES256(decryptData: any, key: any): Promise<any> {
    var decrypted: any;
    var decryptedString: any;
    await import('crypto-js')
      .then(module => {
        decrypted = module.AES.decrypt(decryptData, key, {
          keySize: 128 / 8,
          iv: key,
          mode: module.mode.CBC,
          padding: module.pad.Pkcs7
        })
      })
      .catch(err => {
        console.log(err);
      });

    // var decrypted = CryptoJS.AES.decrypt(decryptData, key, {
    //   keySize: 128 / 8,
    //   iv: key,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.Pkcs7
    // });
    // return decrypted.toString(module.enc.Utf8);
     await import('crypto-js')
      .then(module => {
        decryptedString = decrypted.toString(module.enc.Utf8);
      });

      return decryptedString;
  }
}
