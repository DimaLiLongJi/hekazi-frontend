import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { API_URL, STATIC_API_URL } from '@/service/environment.service';

@Component({
  selector: 'app-material-previewer',
  templateUrl: './material-previewer.component.html',
})
export class MaterialPreviewerComponent {
    @Input() public materialImgUrl: string;
    @Input() public materialBackground: string = '#ffffff';
    @Input() public modalVisible = false;
    @Output() private changeModal = new EventEmitter<boolean>();
    public isOkLoading = false;
  
  
    constructor(
      @Inject(STATIC_API_URL) public staticUrl: string,
    ) { }
  
    public handleCancel() {
      this.changeModal.emit(false);
      this.isOkLoading = false;
    }
  
  
    public handleOnOk() {
      this.changeModal.emit(false);
      this.isOkLoading = false;
    }

    public afterClose() {
    }
}
