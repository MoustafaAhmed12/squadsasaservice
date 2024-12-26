import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../model/responseHeader';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  http = inject(HttpClient);
  getMarkets(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Markets`);
  }
  getAreas(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Areas`);
  }
  getTechnologies(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Technologies`
    );
  }
}
