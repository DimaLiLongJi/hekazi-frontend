import { PermissionDetail } from './premission';
import { UserDetail } from './user';

export class Role {
  public id?: number;
  public name?: string;
  public permissionIds?: number[];
  public creator?: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}

export class RoleDetail {
  public id?: number;
  public name?: string;
  public permissionIds?: number[];
  public permissionList?: PermissionDetail[];
  public creator?: UserDetail;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}
