import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { statusData } from '../constants/dummyData';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor() {}

  getData(): Observable<any> {
    return of(statusData);
  }
}
