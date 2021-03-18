import { UserDetail } from ".";
import { MaterialDetail } from "./material";

export interface IQrcodeSearch {
  keyword?: string,
  pageIndex: number,
  pageSize: number,
  isOn?: '1' | '2' | '',
}

export class QrcodeMaterial {
  public id?: number;
  public name?: string;
  public probability?: number;
  public material?: number;
  public qrcode?: number;
}

export class QrcodeMaterialDetail {
  public id?: number;
  public name?: string;
  public probability?: number;
  public material?: MaterialDetail;
  public qrcode?: QrcodeDetail;
}

export class Qrcode {
  public id?: number;
  public name?: string;
  public qrcodeMaterialList?: QrcodeMaterial[];
  public creator?: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}

export class QrcodeDetail {
  public id?: number;
  public name?: string;
  public qrcodeMaterialList?: QrcodeMaterialDetail[];
  public creator?: UserDetail;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}