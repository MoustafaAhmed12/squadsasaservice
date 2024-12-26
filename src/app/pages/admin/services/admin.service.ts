import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ResponseHeader,
  RootResponse,
} from '../../../shared/model/responseHeader';
import { CacheService } from '../../../shared/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  http = inject(HttpClient);
  cacheService = inject(CacheService);
  getAllAdmins(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/admins/pagination`
    );
  }

  // Orders
  getAllOrders(
    currentPage: number,
    pageSize: number
  ): Observable<RootResponse> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.cacheService.get<RootResponse>(
      `${environment.BASE_URL}/api/admin/orders`,
      params
    );
  }
  getOrderById(id: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/orders/${id}`
    );
  }

  //Markets
  addMarket(info: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/markets`,
      info
    );
  }

  //Area
  addArea(info: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/areas`,
      info
    );
  }
  //job Titles
  addJobTitle(name: { name: string }): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/jobTitles`,
      name
    );
  }
  getjobTitles(): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/jobTitles`
    );
  }

  addTechnology(info: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/technologies`,
      info
    );
  }

  getAllContactUs(
    currentPage: number,
    pageSize: number
  ): Observable<RootResponse> {
    const params = new HttpParams()
      .set('PageNumber', currentPage)
      .set('PageSize', pageSize);
    return this.cacheService.get<RootResponse>(
      `${environment.BASE_URL}/api/admin/contactUs/pagination`,
      params
    );
  }
}
