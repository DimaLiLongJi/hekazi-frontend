import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { Qrcode, QrcodeDetail } from '@/types/qrcode';
import { QrcodeService } from '@/service/qrcode.service';
import { API_URL } from '@/service/environment.service';

@Component({
  selector: 'app-qrcode-list',
  templateUrl: './qrcode-list.component.html',
})
export class QrcodeListComponent implements OnInit, OnDestroy {
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
  public qrcodeList: QrcodeDetail[] = [];
  public total = null;
  public qrcodeCreatorVisible = false;
  public getQrcodeList$: Subscription;
  public activeQrcodeId: number;
  public updateQrcode$: Subscription;

  constructor(
    private service: QrcodeService,
    private message: NzMessageService,
    @Inject(API_URL) public apiUrl: string,
  ) { }

  public ngOnInit() {
    this.getQrcodeList(this.searchData);
  }

  public ngOnDestroy() {
    if (this.getQrcodeList$) this.getQrcodeList$.unsubscribe();
  }

  public async pageIndexChange(pageIndex: number) {
    this.searchData.pageIndex = pageIndex;
    this.getQrcodeList({
      ...this.searchData,
      pageIndex,
    });
  }

  private getQrcodeList(searchData: {
    keyword?: string,
    pageIndex: number,
    pageSize: number,
    isOn?: '1' | '2' | '',
  }) {
    if (this.getQrcodeList$) this.getQrcodeList$.unsubscribe();
    this.getQrcodeList$ = this.service.getList(searchData).subscribe(res => {
      if (res.success) {
        this.searchData = searchData;
        this.qrcodeList = res.data[0];
        this.total = res.data[1];
        this.message.success('搜索素材列表成功');
      } else {
        this.message.error('搜索素材列表失败');
      }
    });
  }


  public changeQrcodeCreatorModal(visible: boolean) {
    this.qrcodeCreatorVisible = visible;
    this.activeQrcodeId = null;
    this.getQrcodeList({
      ...this.searchData,
    });
  }

  public deleteQrcode(qrcode: Qrcode, isDelete: boolean) {
    if (this.updateQrcode$) this.updateQrcode$.unsubscribe();
    if (!isDelete) qrcode.deleteDate = null;
    else qrcode.deleteDate = new Date();
    this.updateQrcode$ = this.service.update(qrcode.id, {
      isOn: isDelete ? '2' : '1',
    }).subscribe(res => {
      if (res.success) {
        this.message.success('更新权限成功');
        this.getQrcodeList(this.searchData);
      } else {
        this.message.error('更新权限失败');
      }
    });
  }

  public editQrcode(id: number) {
    this.activeQrcodeId = id;
    this.qrcodeCreatorVisible = true;
  }

  public changeQrcodeEditorModal(visible: boolean) {
    this.qrcodeCreatorVisible = visible;
    this.activeQrcodeId = null;
    this.getQrcodeList(this.searchData);
  }
  
  public copyLink(id: number) {
      // TODO 增加复制连接
      const url = `${this.apiUrl}/qrcode-created/${id}`;
      const transfer = document.createElement("input");
      document.body.appendChild(transfer);
      transfer.value = url; // 这里表示想要复制的内容
      transfer.focus();
      transfer.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
      }
      transfer.blur();
      document.body.removeChild(transfer);
      console.log(2222, "复制成功", url);
  }
}
