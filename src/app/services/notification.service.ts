import { Injectable } from '@angular/core';
declare const $: any;
@Injectable()

export class NotificationService {
    showNotification(message, type = 1) {
        let color = '';
        let textColor = '';
        switch (type) {
            case 1:
            textColor = 'text-success';
            color = 'success';
            break;
            case 2:
                color = 'danger';
                textColor = 'text-danger';
                break;
            case 3:
                color = 'warning';
                break;
        }
        $.notify({
            message
        }, {
                delay: 3000,
                timer: 500,
                z_index: 7777799,
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
                placement: {
                    from: 'top',
                    align: 'right'
                },
                template: '<div data-notify="container" class="alert alert-' + color + ' alert-dismissible fade show d-inline-block fixed left bottom" role="alert" style="width: 350px;">' +
                    '<div style="line-height: 20px">' +
                    '<span class="pd-icon-check-circle ' + textColor + '" style="font-size:20px"></span> {2} ' +
                    '</div>' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close" style="line-height: 16px">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>'
            });
    }
}
