import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RetroData } from '../shared/models/retro.model';

@Component({
  selector: 'app-edit-retro',
  templateUrl: './edit-retro.component.html',
  styleUrls: ['./edit-retro.component.css']
})
export class EditRetroComponent implements OnInit {

  action:string;
  local_data:any;

  constructor(public dialogRef: MatDialogRef<EditRetroComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RetroData) {
      this.local_data = {...data};
      this.action = this.local_data.action;
    }

  ngOnInit(): void {
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
