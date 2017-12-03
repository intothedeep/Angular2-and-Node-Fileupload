import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';

import { File } from './file';

import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class FileService {
  private restUrl = 'http://localhost:3000/api/files';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  /** GET files from the server */
  getFiles (): Observable<File[]> {
    const url = `${this.restUrl}`;
    return this.http.get<File[]>(this.restUrl)
      .pipe(
        tap(files => this.log(`GET ${url} | LIST`)),
        catchError(this.handleError('getFiles', []))
      );
  }


  /** GET file by fileSeq. Will 404 if fileSeq not found */
  getFile(fileSeq: number): Observable<File> {
    const url = `${this.restUrl}/${fileSeq}`;
    return this.http.get<File>(url).pipe(
      tap(_ => this.log(`GET ${url} | fileSeq=${fileSeq}`)),
      catchError(this.handleError<File>(`getFile fileSeq=${fileSeq}`))
    );
  }

  /** PUT: update the file on the server */
  updateFile (file: File): Observable<any> {
    const url = `${this.restUrl}`;
    return this.http.put(this.restUrl, file, httpOptions).pipe(
      tap(_ => this.log(`PUT ${url} | fileSeq=${file.fileSeq}'s originalname to ${file.originalname}`)),
      catchError(this.handleError<any>('updateFile'))
    );
  }

  /** POST: add a new file to the server */
  addFile (file: File): Observable<File> {
    return this.http.post<File>(this.restUrl, file, httpOptions).pipe(
      tap((file: File) => this.log(`added file w/ fileSeq=${file.fileSeq}`)),
      catchError(this.handleError<File>('addFile'))
    );
  }

  /** DELETE: delete the file from the server */
  deleteFile (file: File | number): Observable<File> {
    const fileSeq = typeof file === 'number' ? file : file.fileSeq;
    const url = `${this.restUrl}/${fileSeq}`;

    return this.http.delete<File>(url, httpOptions).pipe(
      tap(_ => this.log(`DELETE ${url}  | fileSeq=${fileSeq}`)),
      catchError(this.handleError<File>('deleteFile'))
    );
  }

  /* GET files whose name contains search term */
  searchFiles( key:string, word:string ): Observable<File[]> {
    const url = `${this.restUrl}/key/${key}/word/${word}`;

    if (!word.trim()) {
      // if not search term, return empty file array.
      return of([]);
    }
    return this.http.get<File[]>(url).pipe(
      tap(_ => this.log(`GET ${url} | found files matching key="${key}", word="${word}"`)),
      catchError(this.handleError<File[]>('searchFiles', []))
    );
  }

  /** Log a FileService message with the MessageService */
  private log(message: string) {
    this.messageService.add('FileService  >>>  ' + message);
  }
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
