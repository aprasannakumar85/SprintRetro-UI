import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { AdminComponent } from './admin/admin.component';
import { TeamMemeberComponent } from './team-memeber/team-memeber.component';
import { DataBoardComponent } from './data-board/data-board.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InputDataComponent } from './input-data/input-data.component';
import { RemoveQuotesPipe } from './shared/remove-quotes.pipe';
import { EditRetroComponent } from './edit-retro/edit-retro.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'retro/:header', component: TeamMemeberComponent  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    TeamMemeberComponent,
    DataBoardComponent,
    PageNotFoundComponent,
    InputDataComponent,
    RemoveQuotesPipe,
    EditRetroComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
