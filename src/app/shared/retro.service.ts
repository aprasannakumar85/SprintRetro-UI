import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Constants } from 'src/environments/constants';
import { EncryptDecrypt } from './crypto';
import { RetroData } from './models/retro.model';

@Injectable({
  providedIn: 'root',
})
export class RetroService {
  private retroServerAPI = `${Constants.RETRO_SERVER_API_PATH_BASE}`;
  private randomNumber = `${Constants.RandomNumber}`;
  private key: any;

  constructor(private http: HttpClient) {
    import('crypto-js')
      .then(async (module) => {
        this.key = module.enc.Utf8.parse(this.randomNumber);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async getRetroData(partitionKey: string): Promise<Observable<any>> {
    partitionKey = encodeURIComponent(partitionKey);
    //console.log(partitionKey);
    return this.http
      .get<RetroData[]>(`${this.retroServerAPI}sprintRetro/${partitionKey}`)
      .pipe(catchError(this.handleError));
  }

  async createRetroData(retroData: RetroData): Promise<Observable<RetroData>> {
    let messageEncrypted = await EncryptDecrypt.encryptUsingAES256(
      retroData.message,
      this.key
    );

    retroData.message = messageEncrypted;

    return this.http
      .post<RetroData>(`${this.retroServerAPI}sprintRetro`, retroData)
      .pipe(catchError(this.handleError));
  }

  async updateRetro(retroData: RetroData): Promise<Observable<RetroData>> {
    let headerDataEncrypted = await EncryptDecrypt.encryptUsingAES256(
      retroData.headerData,
      this.key
    );
    let messageEncrypted = await EncryptDecrypt.encryptUsingAES256(
      retroData.message,
      this.key
    );

    retroData.headerData = headerDataEncrypted;
    retroData.message = messageEncrypted;

    return this.http
      .put<RetroData>(`${this.retroServerAPI}sprintRetro`, retroData)
      .pipe(catchError(this.handleError));
  }

  async deleteRetro(
    partitionKey: string,
    rowId: string
  ): Promise<Observable<any>> {
    let partitionKeyEncrypted = await EncryptDecrypt.encryptUsingAES256(
      partitionKey,
      this.key
    );

    partitionKeyEncrypted = encodeURIComponent(partitionKeyEncrypted);

    return this.http
      .delete<any>(
        `${this.retroServerAPI}sprintRetro/${partitionKeyEncrypted}/${rowId}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
