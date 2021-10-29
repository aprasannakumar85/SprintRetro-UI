import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/environments/constants';
import { HelperRetro } from '../shared/helper.common';

@Component({
  selector: 'app-team-memeber',
  templateUrl: './team-memeber.component.html',
  styleUrls: ['./team-memeber.component.css'],
})
export class TeamMemeberComponent implements OnInit {
  private randomNumber = `${Constants.RandomNumber}`;

  headerData: any;
  headerDataDecrypted: any;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(() => {
      this.route.url.subscribe(async (urlValue: Array<any>) => {
        this.headerData = decodeURIComponent(urlValue[1].path);
       // console.log(this.headerData);
        this.headerDataDecrypted = await HelperRetro.decryptHeaderData(this.headerData);
      });
    },
    err => console.log('HTTP Error', err));
  }
}
