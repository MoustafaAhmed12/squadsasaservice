import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { environment } from '../../../../environments/environment';
import { Markets } from '../models/clients';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  http = inject(HttpClient);
  allMarkets: Markets[] = [];

  // .pipe(
  //     tap(({ statusCode, data }: ResponseHeader) => {
  //       if (statusCode === 200) {
  //         this.doLoggedUser(data);
  //       }
  //     })
  //   );;

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
  getTechnologiesByAreaId(areaId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Technologies/area/${areaId}`
    );
  }
  getProfilesByTechnologyId(technologyId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/JobTitles/technology/${technologyId}`
    );
  }
  getAreasByTechnologyId(technologyId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Areas/technology/${technologyId}`
    );
  }
  confirmOrder(formData: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Orders`,
      formData
    );
  }
}
