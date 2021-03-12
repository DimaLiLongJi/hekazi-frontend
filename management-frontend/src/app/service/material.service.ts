import { Injectable } from '@angular/core';
import { HttpService } from '@/service/http.service';
import { IResponse } from '@/types';
import { Observable } from 'rxjs';
import { IMaterialSearch, Material, MaterialDetail } from '@/types/material';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  constructor(
    private httpService: HttpService,
  ) { }

  public getList(query?: IMaterialSearch): Observable<IResponse<[MaterialDetail[], number]>> {
    return this.httpService.get<IMaterialSearch, IResponse<[MaterialDetail[], number]>>('/api/material/find', query);
  }

  public getById(id: number): Observable<IResponse<MaterialDetail>> {
    return this.httpService.get<void, IResponse<MaterialDetail>>(`/api/material/${id}`);
  }

  public create(detail: Material): Observable<IResponse<MaterialDetail>> {
    return this.httpService.post<Material, IResponse<MaterialDetail>>('/api/material', detail);
  }

  public update(id: number, detail?: any): Observable<IResponse> {
    return this.httpService.put<Material, IResponse>(`/api/material/${id}`, detail);
  }

  public removeFile(info: { materialId: number, fileId: number }): Observable<IResponse> {
    return this.httpService.post<typeof info, IResponse>(`/api/material/deleteFile`, info);
  }
}
