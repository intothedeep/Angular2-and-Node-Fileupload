import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilesComponent } from './files/files.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileSearchComponent } from './file-search/file-search.component';
import { MessagesComponent } from './messages/messages.component';

import { FileService } from './file.service';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective,
    FileDropDirective,
    FileDetailComponent,
    MessagesComponent,
    FilesComponent,
    FileSearchComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    FileService,
    MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
