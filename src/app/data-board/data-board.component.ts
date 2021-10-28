import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { interval } from "rxjs/internal/observable/interval";
import { Subscription } from 'rxjs';
import { Constants } from 'src/environments/constants';
import { EditRetroComponent } from '../edit-retro/edit-retro.component';
import { EncryptDecrypt } from '../shared/crypto';
import { RetroData } from '../shared/models/retro.model';
import { RetroDataPollingService } from '../shared/retro.polling.service';
import { RetroService } from '../shared/retro.service';
import { startWith, switchMap, retry } from 'rxjs/operators';

@Component({
  selector: 'app-data-board',
  templateUrl: './data-board.component.html',
  styleUrls: ['./data-board.component.css'],
})
export class DataBoardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() headerData: string;
  private key: any;
  private randomNumber = `${Constants.RandomNumber}`;

  retroDataList: RetroData[];

  displayedColumns: string[] = ['message', 'action'];
  dataSource = new MatTableDataSource<RetroData>();

  retroServiceSubscription = new Subscription();
  timeInterval: Subscription;

  constructor(private retroService: RetroService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private retroDataPollingService: RetroDataPollingService) {

    import('crypto-js')
      .then(async (module) => {
        this.key = module.enc.Utf8.parse(this.randomNumber);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  ngOnInit(): void {
    // console.log(this.headerData)
    if (!this.headerData) {
      return;
    }

    this.timeInterval = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.retroDataPollingService.getAllRetroData(this.headerData))
      ).subscribe(res => {
        let temp = res.body;
        this.formatRetroData(temp);
      },
        err => console.log('HTTP Error', err));
  }

  ngOnChanges() {
    this.GetRetoData();
  }

  async GetRetoData() {
    //console.log(this.headerData);
    this.retroServiceSubscription.add(
      (await this.retroService.getRetroData(this.headerData)).subscribe(
        (data: RetroData[]) => {
          this.formatRetroData(data);
        },
        (error) => {
          this.retroDataList = [];
          this.dataSource.data = this.retroDataList;
          //console.log(error);
        }
      )
    );
  }

  private formatRetroData(data: RetroData[]) {
    this.retroDataList = [];
    this.retroDataList = data;
    this.retroDataList.forEach(async (element) => {
      element.headerData = await EncryptDecrypt.decryptUsingAES256(element.headerData, this.key);
      element.message = await EncryptDecrypt.decryptUsingAES256(element.message, this.key);
    });
    //console.log(this.retroDataList);
    this.dataSource.data = this.retroDataList;
  }

  openDialog(action: any, obj: { action: any; }) {
    //console.log(obj);
    obj.action = action;
    const dialogRef = this.dialog.open(EditRetroComponent, {
      width: '300px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result.event == 'Update') {
        this.updateRetro(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRetro(result.data);
      }
      else if (result.event.toString().startsWith('Add')) {
        this.addRetro(result.data, result.event);
      }
    });
  }

  async addRetro(retroData: RetroData, messageType: string) {
    retroData.headerData = this.headerData;
    retroData.message = retroData.message;
    retroData.messageType = messageType.replace('Add ', '');

    this.retroServiceSubscription.add(
      (await this.retroService.createRetroData(retroData)).subscribe(data => {
        this.GetRetoData();
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        }));
  }

  async updateRetro(retroData: RetroData) {
    this.retroServiceSubscription.add(
      (await this.retroService.updateRetro(retroData)).subscribe(() => {
        this.retroDataList.forEach(async retroDataElement => {
          if (retroDataElement.id === retroData.id) {
            let message = await EncryptDecrypt.decryptUsingAES256(retroData['message'], this.key)
            retroDataElement['message'] = message.toString().replace(/(^"|"$)/g, '');
          }
        });
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        })
    );
  }

  async deleteRetro(retroData: RetroData) {
    this.retroServiceSubscription.add(
      (await this.retroService.deleteRetro(retroData.headerData, retroData.id)).subscribe(() => {
        this.GetRetoData();
      },
        error => {
          //console.log(error);
          this._snackBar.open('there is a server exception, please contact  hosting team', 'Dismiss', {
            duration: 10000
          });
        })
    );
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      this.timeInterval.unsubscribe();
    }

    if (this.retroServiceSubscription) {
      this.retroServiceSubscription.unsubscribe();
    }
  }
}
