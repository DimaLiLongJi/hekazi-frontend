import { Component, OnInit, OnDestroy } from '@angular/core';
import { Permission, PermissionDetail } from '@/types';
import { PermissionService } from '@/service/permission.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { Material, MaterialDetail } from '@/types/material';
import { MaterialService } from '@/service/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
})
export class MaterialListComponent implements OnInit, OnDestroy {
  public searchData: {
    keyword?: string,
    pageIndex: number,
    pageSize: number,
    isOn?: '1' | '2' | '',
  } = {
    keyword: '',
    pageIndex: 1,
    pageSize: 5,
    isOn: '',
  };
  public materialList: MaterialDetail[] = [];
  public total = null;
  public materialCreatorVisible = false;
  public materialEditorVisible = false;
  public getMaterialList$: Subscription;
  public activeMaterialId: number;
  public updateMaterial$: Subscription;

  constructor(
    private service: MaterialService,
    private message: NzMessageService,
  ) { }

  public ngOnInit() {
    this.getMaterialList(this.searchData);
  }

  public ngOnDestroy() {
    if (this.getMaterialList$) this.getMaterialList$.unsubscribe();
  }

  public async pageIndexChange(pageIndex: number) {
    this.searchData.pageIndex = pageIndex;
    this.getMaterialList({
      ...this.searchData,
      pageIndex,
    });
  }

  private getMaterialList(searchData: {
    keyword?: string,
    pageIndex: number,
    pageSize: number,
    isOn?: '1' | '2' | '',
  }) {
    if (this.getMaterialList$) this.getMaterialList$.unsubscribe();
    this.getMaterialList$ = this.service.getList(searchData).subscribe(res => {
      if (res.success) {
        this.searchData = searchData;
        this.materialList = res.data[0];
        this.total = res.data[1];
        this.message.success('搜索素材列表成功');
      } else {
        this.message.error('搜索素材列表失败');
      }
    });
  }


  public changeMaterialCreatorModal(visible: boolean) {
    this.materialCreatorVisible = visible;
    this.activeMaterialId = null;
    this.getMaterialList({
      ...this.searchData,
    });
  }

  public deleteMaterial(material: Material, isDelete: boolean) {
    if (this.updateMaterial$) this.updateMaterial$.unsubscribe();
    if (!isDelete) material.deleteDate = null;
    else material.deleteDate = new Date();
    this.updateMaterial$ = this.service.update(material.id, {
      isOn: isDelete ? '2' : '1',
    }).subscribe(res => {
      if (res.success) {
        this.message.success('更新权限成功');
        this.getMaterialList(this.searchData);
      } else {
        this.message.error('更新权限失败');
      }
    });
  }

  public editMaterial(id: number) {
    this.activeMaterialId = id;
    this.materialEditorVisible = true;
  }

  public changeMaterialEditorModal(visible: boolean) {
    this.materialEditorVisible = visible;
    this.activeMaterialId = null;
    this.getMaterialList(this.searchData);
  }
  

}
