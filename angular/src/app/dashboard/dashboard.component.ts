import { Component, OnInit } from '@angular/core';
import { File } from '../file';
import { FileService } from '../file.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  files: File[] = [];

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles(): void {
    this.fileService.getFiles()
      .subscribe(files => this.files = files.slice(0, 4));
  }
}
