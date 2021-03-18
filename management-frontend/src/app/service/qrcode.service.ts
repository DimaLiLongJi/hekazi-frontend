import { Injectable } from '@angular/core';
import { HttpService } from '@/service/http.service';
import { IResponse } from '@/types';
import { Observable } from 'rxjs';
import { IMaterialSearch, Material, MaterialDetail } from '@/types/material';
import { IQrcodeSearch, QrcodeDetail } from '@/types/qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrcodeService {
  constructor(
    private httpService: HttpService,
  ) { }

  public getList(query?: IQrcodeSearch): Observable<IResponse<[QrcodeDetail[], number]>> {
    return this.httpService.get<IQrcodeSearch, IResponse<[QrcodeDetail[], number]>>('/api/qrcode/find', query);
  }

  public getById(id: number): Observable<IResponse<QrcodeDetail>> {
    return this.httpService.get<void, IResponse<QrcodeDetail>>(`/api/qrcode/${id}`);
  }

  public create(detail: Material): Observable<IResponse<QrcodeDetail>> {
    return this.httpService.post<Material, IResponse<QrcodeDetail>>('/api/qrcode', detail);
  }

  public update(id: number, detail?: any): Observable<IResponse> {
    return this.httpService.put<Material, IResponse>(`/api/qrcode/${id}`, detail);
  }
}
