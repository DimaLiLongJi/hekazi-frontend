export interface Props extends Typings.RouteProps<any, any> {
}
export interface State {
    imageInfo: ImageInfo;
    hasSetWxShare: boolean;
}
export class File {
    public id?: number;
    public name?: string;
    public creator?: number;
    public createDate?: Date;
  }

export interface ImageInfo {
    id?: number;
    name: string;
    background?: string;
    file: File;
    creator: number;
    createDate?: Date;
    updateDate?: Date;
    deleteDate?: Date;
}
