import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHeader } from '../../../shared/model/responseHeader';
@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  http = inject(HttpClient);

  // admin

  createAdmin(formData: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/SuperAdmin/admin`,
      formData
    );
  }
  deleteAdmin(id: string): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/admin/${id}`
    );
  }
  editRole(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/users/role`,
      info
    );
  }

  // market
  deleteMarket(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/markets/${id}`
    );
  }

  // Area
  deleteArea(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/areas/${id}`
    );
  }

  changeTechnologiesOfArea(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/areas/technology`,
      info
    );
  }

  // Tech
  deletetechnology(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/technologies/${id}`
    );
  }

  changeProfileOfTech(info: any): Observable<ResponseHeader> {
    return this.http.put<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/technogolies/profile`,
      info
    );
  }

  //job Titles
  deleteJobTitles(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/jobTitle/${id}`
    );
  }
}
