import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/environments/constants';
import { EncryptDecrypt } from '../shared/crypto';

@Component({
  selector: 'app-team-memeber',
  templateUrl: './team-memeber.component.html',
  styleUrls: ['./team-memeber.component.css'],
})
export class TeamMemeberComponent implements OnInit {
  private randomNumber = `${Constants.RandomNumber}`;

  headerData: any;
  headerDataDecrypted: Promise<string>;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    alert();
    let key: any;
    await import('crypto-js')
      .then(async (module) => {
        key = module.enc.Utf8.parse(this.randomNumber);
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.route.params.subscribe(() => {
      this.route.url.subscribe(async (urlValue: Array<any>) => {
        this.headerData = decodeURIComponent(urlValue[1].path);
       // console.log(this.headerData);
        this.headerDataDecrypted = await EncryptDecrypt.decryptUsingAES256(
          this.headerData,
          key
        );
      });
    });
  }
}
