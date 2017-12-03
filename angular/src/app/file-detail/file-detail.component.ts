import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { File } from '../file';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FileService } from '../file.service';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.css']
})
export class FileDetailComponent implements OnInit {
  @Input() file: File;

  // constructor() { }
  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private location: Location
  ) {}

  // ngOnInit() {
  // }
  ngOnInit(): void {
    this.getFile();
  }

  getFile(): void {
    const fileSeq = +this.route.snapshot.paramMap.get('fileSeq');
    this.fileService.getFile(fileSeq)
      .subscribe(file => this.file = file);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
     this.fileService.updateFile(this.file)
       .subscribe(() => this.goBack());
   }

}
