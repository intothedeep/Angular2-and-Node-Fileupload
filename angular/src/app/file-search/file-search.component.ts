import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { File } from '../file';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.css']
})
export class FileSearchComponent implements OnInit {
  files$: Observable<File[]>;
  private searchWords = new Subject<string>();

  constructor(private fileService: FileService) {}

  // Push a search term into the observable stream.
  search( word: string ): void {
    this.searchWords.next(word);
  }

  ngOnInit(): void {
    this.files$ = this.searchWords.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((word: string) => this.fileService.searchFiles('originalname', word)),
    );
  }
}
