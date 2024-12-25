export interface ResponseHeader {
  statusCode: number;
  data: any;
  isSuccess: boolean;
  message: string;
  errors: any;
}
export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

export interface RootResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  message: any;
  data: any;
  isSuccess: boolean;
  errors: any;
}
