import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private router: Router,
        private errorService: ErrorService,
        private messageService: MessageService,
        private spinner: NgxSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let handled: boolean = false;
        request = request.clone({
            setHeaders: {'X-Role-Token': localStorage.hasOwnProperty('md5') && localStorage.getItem('md5') ? localStorage.getItem('md5') : ''}
         });
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((returnedError) => {
                    let errorMessage = null;
                    this.errorService.setStocks(returnedError);

                    if (returnedError.error instanceof ErrorEvent) {
                        this.errorService.setStocks(returnedError.error.message);
                        errorMessage = `Error: ${returnedError.error.message}`;
                        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Error: ${returnedError.error.message}` });
                    } else if (returnedError instanceof HttpErrorResponse) {
                        //   errorMessage = `Error Status ${returnedError.status}: ${returnedError.error.error} - ${returnedError.error.message}`;
                        handled = this.handleServerSideError(returnedError);
                    }
                    console.error(errorMessage ? errorMessage : returnedError);

                    if (!handled) {
                        if (errorMessage) {
                            return throwError(errorMessage);
                        } else {
                            return throwError("Unexpected problem occurred");
                        }
                    } else {
                        return of(returnedError);
                    }
                })
            )
    }

    private handleServerSideError(error: HttpErrorResponse): boolean {
        let handled: boolean = false;
        this.errorService.setStocks(error.status);
        switch (error.status) {
            case 401:
                // this.auth.signout();
                if (this.auth.isExpired()) {
                    location.reload();
                }
                localStorage.removeItem('md5');
                this.spinner.hide();
                handled = true;
                break;
            case 403:
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Error: Quyền truy cập bị từ chối. Vui lòng liên hệ đến Quản trị viên!` });
                this.spinner.hide();
                handled = true;
                break;
            case 500:
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Error: Lỗi Server !` });
                this.spinner.hide();
                handled = true;
                break;
            case 404:
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Error: Lỗi đường dẫn !` });
                this.spinner.hide();
                handled = true;
                break;
            case 0:
                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: `Error: Lỗi Server !` });
                this.spinner.hide();
                handled = true;
                break;
        }

        return handled;
    }
}
