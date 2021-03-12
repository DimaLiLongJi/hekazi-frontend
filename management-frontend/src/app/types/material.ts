import { UserDetail } from ".";
import { File } from "./file";

export interface IMaterialSearch {
  keyword?: string,
  pageIndex: number,
  pageSize: number,
  isOn?: '1' | '2' | '',
}

export class Material {
  public id?: number;
  public name?: string;
  public background?: string;
  public file?: number;
  public creator?: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}

export class MaterialDetail {
  public id?: number;
  public name?: string;
  public background?: string;
  public file?: File;
  public creator?: UserDetail;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}