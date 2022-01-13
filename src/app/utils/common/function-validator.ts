const DEFAULT_INVALID_EMAIL = {
    Required: true,
    message: 'Please enter follow by format email'
};

const DEFAULT_INVALID_REQUIRED = {
    Required: true,
    message: 'Trường này là bắt buộc'
};

const DEFAULT_INVALID_REQUIREDLENTH10 = {
    Required: true,
    message: 'Nhập sai dữ liệu số điện thoại'
};

const DEFAULT_SALARY_REQUIRED_SPECIAL = {
    Required: true,
    message: 'Not Special'
};

const DEFAULT_SALARY_REQUIRED_LENGTH = {
    Required: true,
    message: 'Length > 10'
};

const DEFAULT_LENGTH_LOWER7 = {
    Required: true,
    message: 'Length < 7'
};
const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const NOT_SPECIAL_CHARACTERS_FOR_EMAIL = '^[a-zA-Z0-9-._ ]*$';
const HALF_SIZE_NUMBER = /[0-9]/;
export function ValidatorForm(element, datas) {
    if (element.field_name === 'email') {
        if ((!element.email || typeof element.email === 'string') && !element.email.trim() && element.isRequire) {
            return element.message = DEFAULT_INVALID_REQUIRED;
        } else if ((!element.email || typeof element.email === 'string') && !element.email.trim() && !element.isRequire) {
            datas.invalid = false;
            return element.message = null;
        } else {
            const str1 = element.email ? element.email.split('@')[0] : '';
            const pattern = new RegExp(EMAIL_PATTERN);
            const pattern2 = new RegExp(NOT_SPECIAL_CHARACTERS_FOR_EMAIL);
            if (pattern2.test(str1) === false) {
                datas.invalid = true;
                return element.message = DEFAULT_INVALID_EMAIL;
            }
            if (pattern.test(element.email) === false) {
                datas.invalid = true;
                return element.message = DEFAULT_INVALID_EMAIL;
            }
            datas.invalid = false;
            return element.message = null;
        }
    } else if (element.field_name === 'phone') {
        datas.invalid = false;
        // if ((!element[element.field_name] || typeof element[element.field_name] === 'string') && !element[element.field_name].trim() && element.isRequire) {
        //     return element.message = DEFAULT_INVALID_REQUIRED;
        // } else if ((!element[element.field_name] || typeof element[element.field_name] === 'string') && !element[element.field_name].trim() && !element.isRequire) {
        //     datas.invalid = false;
        //     return element.message = null;
        // } else {
        //     const patternNumber = new RegExp(HALF_SIZE_NUMBER);
        //     if (element[element.field_name]) {
        //         let string = element[element.field_name].toString().split('');
        //         console.log(isNaN(element[element.field_name]))
        //         if (string.length > 0 && string.indexOf('-') > -1) {
        //             datas.invalid = true;
        //             return element.message = DEFAULT_INVALID_REQUIREDLENTH10;
        //         }
        //         if (string.length > 0 && string.indexOf(' ') > -1) {
        //             datas.invalid = true;
        //             return element.message = DEFAULT_INVALID_REQUIREDLENTH10;
        //         }
        //         if (isNaN(element[element.field_name]) === true) {
        //             datas.invalid = true;
        //             return element.message = DEFAULT_INVALID_REQUIREDLENTH10;
        //         }
        //         if (element[element.field_name] && (element[element.field_name].length < 10)) {
        //             datas.invalid = true;
        //             return element.message = DEFAULT_INVALID_REQUIREDLENTH10;
        //         }
        //         if (element[element.field_name] && (element[element.field_name].length > 13)) {
        //             datas.invalid = true;
        //             return element.message = DEFAULT_INVALID_REQUIREDLENTH10;
        //         }
        //         datas.invalid = false;
        //         return element.message = null;
        //     }
        // }
    }else if(element.field_name === 'bar_code' || element.field_name === 'fax') {
        if ((!element[element.field_name] || typeof element[element.field_name] === 'string') && !element[element.field_name].trim() && element.isRequire) {
            return element.message = DEFAULT_INVALID_REQUIRED;
        } else if ((!element[element.field_name] || typeof element[element.field_name] === 'string') && !element[element.field_name].trim() && !element.isRequire) {
            datas.invalid = false;
            return element.message = null;
        } else {
            const patternNumber = new RegExp(HALF_SIZE_NUMBER);
            if (element[element.field_name]) {
                let string = element[element.field_name].toString().split('');
                console.log(isNaN(element[element.field_name]))
                if (string.length > 0 && string.indexOf(' ') > -1) {
                    datas.invalid = true;
                    return element.message = DEFAULT_INVALID_REQUIRED;
                }
                if (isNaN(element[element.field_name]) === true) {
                    datas.invalid = true;
                    return element.message = DEFAULT_INVALID_REQUIRED;
                }
                datas.invalid = false;
                return element.message = null;
            }
        }
    } else {
        if (element.isRequire) {
            if (!element[element.field_name]) {
                return element.message = DEFAULT_INVALID_REQUIRED;
            } else {
                if(datas) datas.invalid = false;
                return element.message = null
            }
        }
    }
}
