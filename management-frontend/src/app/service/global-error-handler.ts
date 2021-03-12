import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  public handleError(error: any): void {
    console.log(2222222222, error);
    // throw new Error('Method not implemented.');
  }
}
