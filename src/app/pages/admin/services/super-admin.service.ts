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

  // order
  deleteOrder(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/orders/${id}`
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

  // Tech
  deletetechnology(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/technologies/${id}`
    );
  }

  //job Titles
  deleteJobTitles(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/jobTitle/${id}`
    );
  }

  //contact us
  deleteContactUs(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/SuperAdmin/contactUs/${id}`
    );
  }
}
