import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/environments/constants';
import { RetroData } from './models/retro.model';

@Injectable({
  providedIn: 'root'
})
export class RetroDataPollingService {
  private retroServerAPI = `${Constants.RETRO_SERVER_API_PATH_BASE}`;

  constructor(private httpClient: HttpClient) {  }

  getAllRetroData(partitionKey: string) {
    partitionKey = encodeURIComponent(partitionKey);
    return this.httpClient.get<RetroData[]>(`${this.retroServerAPI}sprintRetro/${partitionKey}`, { observe: 'response' });
  }
}
