import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {


  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  showSuccess(message: string) {
    this.toastr.success(message, '', { timeOut: 3000});
  }

  showError(message: string) {
    this.toastr.error(message, '', { timeOut: 3000});
  }

  showWarning(message: string) {
    this.toastr.warning(message, '', { timeOut: 3000});
  }

  showInfo(message: string) {
    this.toastr.info(message, '', { timeOut: 3000});
  }
}