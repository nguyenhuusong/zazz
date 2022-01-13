import { AbstractControl } from '@angular/forms';

const DEFAULT_INVALID_DIGITS = {
    Digits: true,
    message: 'Please enter number'
};

const DEFAULT_INVALID_LENGTH_NUMBER = {
    Lengthh: true,
    message: 'Max length is 16 and min length is 10'
};

const DEFAULT_INVALID_LENGTH_TEXT = {
    Lengthh: true,
    message: 'Max length is 50 and min length is 10'
};

const DEFAULT_INVALID_LENGTH_KTP_NPWP = {
    Lengthh: true,
    message: 'Max length is 17 and min length is 12'
};

const DEFAULT_INVALID_EMAIL = {
    Email: true,
    message: 'Please enter follow by format email'
};

const DEFAULT_INVALID_REQUIRED = {
    Required: true,
    message: 'Trường này là bắt buộc'
};

const DEFAULT_SALARY_REQUIRED = {
    Salary: true,
    message: 'Salary must bigger than 3500000'
};

const ERRORS_FILE = {
    Errors: true,
    message: 'Please insert file'
};

const INVALID_BIRTHDAY = {
    Birthday: true,
    message: 'Must bigger than 18 years old'
};

const DEFAULT_INVALID_SPECIAL_CHAR = {
    Special: true,
    message: 'Do not contain special characters'
};

const DEFAULT_INVALID_BANK_NAME = {
    Email: true,
    message: 'Please enter follow by format bank name'
};
const FULL_WIDTH_ACCOUNT = {
    fullWidth: true,
    message: 'Please enter follow by format bank name'
};
const HALF_WIDTH_ACCOUNT = {
    halfWidth: true,
    message: 'Please enter follow by format bank name'
};

const DEFAULT_SALARY_REQUIRED_SPECIAL = {
    SalarySpecial: true,
    message: 'Not Special'
};

const DEFAULT_SALARY_REQUIRED_LENGTH = {
    SalaryLength: true,
    message: 'Length > 10'
};
const DEFAULT_LENGTH_LOWER7 = {
    lengthlower7: true,
    message: 'Length < 7'
};
const HIRAGANA_ERROR = {
    Error1: true,
    message: 'が正しくありません。'
};
const JP_ERROR = {
    Error: true,
    message: 'が正しくありません。'
};
const HALFSIZE_NUMER = {
    Number: true,
    message: 'Please half size number'
};

const DIGITS_PATTERN = '^\\d+$';
const SALARY_PATTEN = '^[0-9, ]*$';
const NOT_SPECIAL_CHARACTERS_FOR_EMAIL = '^[a-zA-Z0-9-._ ]*$';
const NOT_SPECIAL_CHARACTERS = '^[a-zA-Z0-9 ]*$';
// /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/ /^[0-9,.]*$/
const NOT_SPECIAL_CHARACTERS_CONTAIN_DOT = '^[a-zA-Z0-9,./_ ]*$';
const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const HALF_PATTERN = /^[ｦ-ﾟ ､0-9a-zA-Z]*$/;
const FULL_SIZE_NUMBER = /([０-９])/;
const HALF_SIZE_NUMBER = /[0-9]/;
const FULL_WIDTH_PATTERN = /^[ァ-ン]+$/;
const HIRAGANA_REQUIRED = /[\u3040-\u309f]/;
const JP_REQUIRED = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

export function numberValidation(control: AbstractControl) {
    const pattern = new RegExp(HALF_SIZE_NUMBER);
    // if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
    //     return DEFAULT_INVALID_REQUIRED;
    // }
    if (control.value === '' || control.value === undefined) {
        return null;
    }
    if (pattern.test(control.value) === false) {
        return HALFSIZE_NUMER;
    }
    return;
}
export function errorInput(control: AbstractControl){
    const pattern = new RegExp(JP_REQUIRED);
    const patternNumber = new RegExp(FULL_SIZE_NUMBER);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (patternNumber.test(control.value)) {
        return JP_ERROR;
    }
    if (pattern.test(control.value) === false) {
        return JP_ERROR;
    }
    return;
}
export function hiraganaInput(control: AbstractControl){
    const pattern = new RegExp(HIRAGANA_REQUIRED);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (pattern.test(control.value) === false) {
        return HIRAGANA_ERROR;
    }
    return;
}
export function salaryInput1(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    let _pattern = new RegExp('-');
    const patternNumber = new RegExp(FULL_SIZE_NUMBER);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (control.value) {
        let string = control.value.toString().split('');
        if (string.length > 0 && string.indexOf('-') > -1) {
            return DEFAULT_SALARY_REQUIRED_SPECIAL;
        }else if (patternNumber.test(control.value)) {
            return JP_ERROR;
        }else if (pattern.test(control.value) === false && control.value !== '') {
            return DEFAULT_SALARY_REQUIRED;
        }else if (control.value && (control.value.length < 7)) {
            return DEFAULT_LENGTH_LOWER7;
        }
    }
    return null;
}

export function salaryInput(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_SALARY_REQUIRED;
    }
    return null;
}

// export function salaryInputCurrency(control: AbstractControl) {
//     let pattern = new RegExp(DIGITS_PATTERN);
//     var numeral = require('numeral');
//     var myNumeral2 = numeral(control.value);
//     if (control.value == 0) {
//         return DEFAULT_INVALID_REQUIRED;
//     }
//     control = myNumeral2.value();
//     if (!control || typeof control === 'string') {
//         return DEFAULT_INVALID_REQUIRED;
//     }
//     if (pattern.test(control.toString()) == false && control != null) {
//         return DEFAULT_SALARY_REQUIRED;
//     }
//     return null;
// }

export function notRequiredButDigits(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_INVALID_DIGITS;
    }
    if (control.value.length > 0) {
        if ((control.value.length < 10 || control.value.length > 15)) {
            return DEFAULT_INVALID_LENGTH_NUMBER;
        }
    } else { return null; }
    return null;
}

export function notContainSpecialCharacters(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    const pattern = new RegExp(NOT_SPECIAL_CHARACTERS);
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_INVALID_SPECIAL_CHAR;
    }
    return null;
}

export function validateForPassWord(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }

    const pattern = new RegExp(NOT_SPECIAL_CHARACTERS);
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_INVALID_SPECIAL_CHAR;
    }
    if ((control.value.length < 8 || control.value.length > 20)) {
        return {
            Lengthh: true,
            message: 'Max length is 20 and min length is 8'
        };
    }
    return null;
}

export function notContainSpecialCharactersForName(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if ((control.value.length < 3 || control.value.length > 50)) {
        return {
            Lengthh: true,
            message: 'Max length is 50 and min length is 3'
        };
    }

    const pattern2 = new RegExp(DIGITS_PATTERN);
    if (pattern2.test(control.value) === true && control.value !== '') {
        return {
            Special: true,
            message: 'Must contain alphabet'
        };
    }
    const pattern = new RegExp(NOT_SPECIAL_CHARACTERS_CONTAIN_DOT);
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_INVALID_SPECIAL_CHAR;
    }

    return null;
}

export function onlyDigit(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (pattern.test(control.value) === false) {
        return DEFAULT_INVALID_DIGITS;
    }
    return null;
}

export function validateForMonthlySalary(control: AbstractControl) {
    const pattern = new RegExp(SALARY_PATTEN);
    if (pattern.test(control.value) === false) {
        return DEFAULT_INVALID_DIGITS;
    }
    return null;
}

export function emailValidation(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    const str1 = control.value.split('@')[0];
    const pattern = new RegExp(EMAIL_PATTERN);
    const pattern2 = new RegExp(NOT_SPECIAL_CHARACTERS_FOR_EMAIL);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (pattern2.test(str1) === false) {
        return DEFAULT_INVALID_EMAIL;
    }
    if (pattern.test(control.value.trim()) === false) {
        return DEFAULT_INVALID_EMAIL;
    }
    return;
}
export function emailValidationButNotRequired(control: AbstractControl) {
    if (control.value === '' || control.value === undefined) {
        return null;
    } else {
        const str1 = control.value.split('@')[0];
        const pattern = new RegExp(EMAIL_PATTERN);
        const pattern2 = new RegExp(NOT_SPECIAL_CHARACTERS_FOR_EMAIL);
        if (pattern2.test(str1) === false) {
            return DEFAULT_INVALID_EMAIL;
        }
        if (pattern.test(control.value) === false) {
            return DEFAULT_INVALID_EMAIL;
        }
        return;
    }
}

export function validationPhoneNumber(control: AbstractControl) {
    if (control.value === '' || control.value === undefined) {
        return null;
    }
    if (control.value) {
        let string = control.value.toString().split('');
        if (string.length > 0 &&  string.indexOf('-') > -1) {
            return DEFAULT_SALARY_REQUIRED_SPECIAL;
        }
        if (string.length > 0 &&  string.indexOf(' ') > -1) {
            return DEFAULT_SALARY_REQUIRED;
        }
        if (isNaN(control.value) === true && control.value !== '') {
            return DEFAULT_SALARY_REQUIRED;
        }
        if (control.value && (control.value.length < 10)) {
            return DEFAULT_SALARY_REQUIRED_LENGTH;
        }

    }
    return null;
}

export function requiredInput(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    return null;
}

export function requiredInput2(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    return null;
}

export function fullWidthRequired(control: AbstractControl) {
    if (control.value) {
        const actual_len = control.value.length;
        const pattern =  new RegExp(FULL_WIDTH_PATTERN);
        if ( control.value.match(pattern)) {
          }else {
              return FULL_WIDTH_ACCOUNT;
          }
    }
}
export function halfWidthRequired(control: AbstractControl) {
    const pattern = new RegExp(HALF_PATTERN);
    if (control.value) {
        if ( control.value.match(pattern)) {
          }else {
              return HALF_WIDTH_ACCOUNT;
          }
    }
}
export function countLength(str) {
    let r = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            r += 1;
        } else {
            r += 2;
        }
    }
    return r;

}

export function salaryRequired(control: AbstractControl, ) {
    const pattern = new RegExp(SALARY_PATTEN);
    if (pattern.test(control.value) === false) {
        return DEFAULT_INVALID_DIGITS;
    }
    const controlValue = control.value.toString();
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    else if ((parseFloat(controlValue.replace(/,/g, '')) < 3500000 || parseFloat(controlValue.replace(/,/g, '')) > 100000000) && control.value !== '') {
        return {
            Salary: true,
            message: 'Salary must bigger than 3500000 and lower than 100,000,000'
        };
    }
    return null;
}

export function allErrorsFile(control: AbstractControl) {
    return ERRORS_FILE;
}

export function Null(control: AbstractControl) {
    return null;
}

export function validateBirthDay(control: AbstractControl) {
    let birthDay: Date;
    const now = new Date();
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (control.value !== '' || control.value === undefined) {
        birthDay = control.value;
        if (birthDay.getFullYear() < 1930) {
            return {
                Birthday: true,
                message: 'Min year of birth is 1930'
            };
        }
        if ((now.getFullYear() - birthDay.getFullYear()) < 18) {
            return INVALID_BIRTHDAY;
        }
    }
    return null;
}

// export function validLength(control : AbstractControl) {

// }


export function validLength(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if (pattern.test(control.value) === true) {
        if ((control.value.length < 10 || control.value.length > 15)) {
            return DEFAULT_INVALID_LENGTH_NUMBER;
        }
    }
    return null;
}

export function validLengthForText(control: AbstractControl) {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    const pattern = new RegExp(NOT_SPECIAL_CHARACTERS);
    if (pattern.test(control.value) === false && control.value !== '') {
        return DEFAULT_INVALID_SPECIAL_CHAR;
    }
    if ((control.value.length < 10 || control.value.length > 50)) {
        return DEFAULT_INVALID_LENGTH_TEXT;
    }

    return null;
}

export function validateLengthForNpwp(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (pattern.test(control.value) === false) {
        return {
            Digits: true,
            message: 'Please enter number (Do not contain space)'
        };
    }
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if ((control.value.length !== 15)) {
        return {
            Lengthh: true,
            message: 'Length is 15'
        };
    } else {
        return null;
    }
}

export function validateLengthForKTP(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (pattern.test(control.value) === false) {
        return {
            Digits: true,
            message: 'Please enter number (Do not contain space)'
        };
    }
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if ((control.value.length !== 16)) {
        return {
            Lengthh: true,
            message: 'Length is 16'
        };
    } else {
        return null;
    }
}

export function validateLengthPayrollBank(control: AbstractControl) {
    const pattern = new RegExp(DIGITS_PATTERN);
    if (pattern.test(control.value) === false) {
        return DEFAULT_INVALID_DIGITS;
    }
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
        return DEFAULT_INVALID_REQUIRED;
    }
    if ((control.value.length < 10 || control.value.length > 18)) {
        return {
            Lengthh: true,
            message: 'Max length is 18 and min length is 10'
        };
    } else {
        return null;
    }
}
// export function minLength(length: number) {
//     return (control: AbstractControl) => {
//       if (!control.value || typeof control.value === 'string' && control.value.trim().length < length) {
//         return {
//           minlength: true
//         };
//       }

//       return null;
//     };
//   }

//   export function maxLength(length: number) {
//     return (control: AbstractControl) => {
//       if (control.value && typeof control.value === 'string' && control.value.trim().length > length) {
//         return {
//           maxlength: true
//         };
//       }

//       return null;
//     };
//   }
// export function validateByRegex(string: string, patterns: string) {
//     let pattern = new RegExp(patterns);
//     return pattern.test(string);
//   }
