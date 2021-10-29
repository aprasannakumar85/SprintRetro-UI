export class HelperRetro {
  static async encryptHeaderData(headerData: string): Promise<string> {
    let finalValue = '';
    headerData.split('').forEach((element) => {
      let ascii = element.charCodeAt(0);
      finalValue = `${finalValue}${ascii}`;
    });
    return finalValue;
  }

  static async decryptHeaderData(headerData: string): Promise<string> {
    let finalValue = '';
    for (let i = 0; i < headerData.length; i += 2) {
      let twoNumbers = headerData.substring(i, i + 2);
      let oneChar = String.fromCharCode(+twoNumbers);
      finalValue = `${finalValue}${oneChar}`;
    }
    return finalValue;
  }
}
