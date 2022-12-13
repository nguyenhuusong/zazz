const Error = {
    ERROR_REQUIRE : 'Trường bắt buộc nhập',
    ERROR_PHONE: 'Dữ liệu không hợp lệ',
    ERROR_EMAIL: 'Dữ liệu không hợp lệ'
}

export function ValidationPhoneNumber(value) {
    const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(value === "" || value === undefined) {
        return {
            error : true,
            message: Error.ERROR_REQUIRE
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_PHONE
        }
    }
    return {
        error : false,
        message: ''
    }
}

export function ValidationPhoneNumberEmpty(value) {
    const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(value === "" || value === undefined) {
        return {
            error : false,
            message: ''
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_PHONE
        }
    }
    return {
        error : false,
        message: ''
    }
}

export function ValidationEmail(value) {
    const regex = /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i;
    if(value === "" || value === undefined) {
        return {
            error : true,
            message: Error.ERROR_REQUIRE
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_EMAIL
        }
    }
    return {
        error : false,
        message: ''
    }
}

export function ValidationEmailEmpty(value) {
    const regex = /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i;
    if(value === "" || value === undefined) {
        return {
            error : false,
            message: ''
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_EMAIL
        }
    }
    return {
        error : false,
        message: ''
    }
}


export function ValidationTaiKhoanNganHang(value) {
    const regex = /^[A-Z0-9 ]+$/;
    if(value === "" || value === undefined) {
        return {
            error : true,
            message: Error.ERROR_REQUIRE
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_EMAIL
        }
    }
    return {
        error : false,
        message: ''
    }
}

export function ValidationTaiKhoanNganHangEmpty(value) {
    const regex = /^[A-Z0-9 ]+$/;
    if(value === "" || value === undefined) {
        return {
            error : false,
            message: ''
        }
    };
    if (!regex.test(value)) {
        return {
            error : true,
            message: Error.ERROR_EMAIL
        }
    }
    return {
        error : false,
        message: ''
    }
}