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
  getAllAdminsPagination(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.BASE_URL}/api/Admin/admins/pagination`
    );
  }

  deleteAdmin(id: string): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/Admin/admins/${id}`
    );
  }

  actionsAdmin(formData: any): Observable<ResponseHeader> {
    return this.http.post<any>(
      `${environment.BASE_URL}/api/Admin/admins`,
      formData
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
  deleteOrder(id: number): Observable<ResponseHeader> {
    return this.http.delete<ResponseHeader>(
      `${environment.BASE_URL}/api/admin/orders/${id}`
    );
  }
}
