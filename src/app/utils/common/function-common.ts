
export function datetostring(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // January is 0!

  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  const datestring = dd + '/' + mm + '/' + yyyy;
  return datestring;
}

import * as moment from 'moment';

export function momentFormatDate(date) {
  const datestring = moment(date).format('DD/MM/YYYY HH:mm:ss')
  return datestring;
}
export function momentFormatDateNotTime(date) {
  const datestring = moment(date).format('DD/MM/YYYY')
  return datestring;
}

export function formatNumber2(params) {
  const number = params.value;
  if (number && typeof (number) === 'number') {
    return numeral(number).format('0,0[.][000]')
  } else if (number && typeof (number) === 'string') {
    return number;
  }
  return null

}

export function formatCurrency(params) {
  if (params.value) {
    const number = params.value;
    return numeral(number).format('0,0')
  }
  return null;
}

export function formatMargin(params) {
  if (params.value) {
    const numb = +params.value;
    return (numb * 100).toFixed(2);
  }
  return null
}

export function dateFormatter(params) {
  if (!params.value) {
    return '';
  }
  const newDate = new Date(params.value);

  const dd = newDate.getDate();
  const mm = newDate.getMonth() + 1; // January is 0!
  let ddString = dd.toString();
  let mmString = mm.toString();
  const yyyy = newDate.getFullYear();
  if (dd < 10) {
    ddString = '0' + dd;
  }
  if (mm < 10) {
    mmString = '0' + mm;
  }

  const datestring = ddString + '/' + mmString + '/' + yyyy;
  return datestring;
}

export function currencyFormatter(params) {
  return params.value ? params.value.toLocaleString() : '';
}

export function stringtodate(datestring) {
  if (datestring) {
    const parts = datestring.split('/');
    const mydate = new Date(parts[2], parts[1] - 1, parts[0]);
    return mydate;
  } else {
    return new Date();
  }
}

export function formatMoney(money: number) {
  if (money) {
    return money.toLocaleString();
  }
}

export function FormatNumberCurrency(number) {
 return  numeral(number).format('0,0')

}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function addDays(days) {
  // const date = new Date(this.valueOf());
  // date.setDate(date.getDate() + days);
  // return date;
}

export function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function AgGridFn(lists = []) {
  const arrAgGrids = [];
  for (const value of lists) {
    let row = {};
    if (value.isStatusLable) {
      row = {
        headerName: value.columnCaption,
        field: value.columnField,
        cellClass: value.cellClass,
        headerClass: value.headerClass,
        filter: value.isFilter ? 'agTextColumnFilter' : '',
        sortable: true,
        width: value.columnWidth,
        cellRenderer: params => {
          const a = document.createElement('div');
          a.innerHTML = params.value;
          return a;
        },
        cellClassRules: value.conditionClass,
        cellStyle: value.cellStyle,
        hide: value.isHide ? true : false,
        pinned: value.pinned,
        headerTooltip: value.columnCaption,
        tooltipField: value.columnField
      };
    } else {
      if (value.fieldType === 'image') {
        row = {
          headerName: value.columnCaption,
          field: value.columnField,
          headerClass: value.headerClass,
          cellClass: value.cellClass,
          cellClassRules: value.conditionClass,
          filter: value.isFilter ? 'agTextColumnFilter' : '',
          sortable: true,
          cellStyle: value.cellStyle,
          width: value.columnWidth,
          hide: value.isHide ? true : false,
          pinned: value.pinned,
          cellRenderer: 'avatarRendererFull',
          headerTooltip: value.columnCaption,
          tooltipField: value.columnField,
          // valueFormatter: value.fieldType == 'decimal' ? ""
        };
      } else if (value.fieldType === 'check') {
        row = {
          headerName: value.columnCaption,
          field: value.columnField,
          cellClass: value.cellClass,
          headerClass: value.headerClass,
          cellClassRules: value.conditionClass,
          cellStyle: value.cellStyle,
          filter: value.isFilter ? 'agTextColumnFilter' : '',
          sortable: true,
          width: value.columnWidth,
          cellRenderer: params => {
            return ` <span class="custom-control custom-checkbox float-left" style="margin-top: 7%;">
                        <input type="checkbox" ${params.value ? 'checked' : ''} ${params.value ? '' : 'disabled'} class="custom-control-input"  >
                        <label class="custom-control-label"></label>
                      </span>`;
          },
          hide: value.isHide ? true : false,
          pinned: value.pinned,
          headerTooltip: value.columnCaption,
          // tooltipField: value.columnField
          // valueFormatter: value.fieldType == 'decimal' ? ""
        };
      } else if (value.fieldType === 'decimal') {
        row = {
          headerName: value.columnCaption,
          field: value.columnField,
          cellClass: value.cellClass,
          headerClass: value.headerClass,
          cellStyle: value.cellStyle,
          cellClassRules: value.conditionClass,
          filter: value.isFilter ? 'agTextColumnFilter' : '',
          sortable: true,
          width: value.columnWidth,
          cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
          hide: value.isHide ? true : false,
          pinned: value.pinned,
          tooltipField: value.columnField,
          headerTooltip: value.columnCaption,
          valueFormatter: value.customFormat ? formatMargin : formatNumber2
        };
      } else {
        row = {
          headerName: value.columnCaption,
          field: value.columnField,
          cellClass: value.cellClass,
          cellStyle: value.cellStyle,
          headerClass: value.headerClass,
          cellClassRules: value.conditionClass,
          filter: value.isFilter ? 'agTextColumnFilter' : '',
          sortable: true,
          width: value.columnWidth,
          cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
          editable: value.editable ? value.editable : false,
          cellEditor: value.editor ? value.editor : 'agLargeTextCellEditor',
          hide: value.isHide ? true : false,
          pinned: value.pinned,
          tooltipField: value.columnField,
          headerTooltip: value.columnCaption,
          valueFormatter: ''
        };
      }
    }
    if (row['field'] != 'actions') {
      arrAgGrids.push(row);
    }
  }
  return arrAgGrids;
}

export function formatNumber(params) {
  const number = params.value
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function getNumericCellEditor() {
  function isCharNumeric(charStr) {
    return !!/\d/.test(charStr);
  }
  function isKeyPressedNumeric(event) {
    var charCode = getCharCodeFromEvent(event);
    var charStr = String.fromCharCode(charCode);
    return isCharNumeric(charStr);
  }
  function getCharCodeFromEvent(event) {
    event = event || window.event;
    return typeof event.which === 'undefined' ? event.keyCode : event.which;
  }
  function NumericCellEditor() { }
  NumericCellEditor.prototype.init = function (params) {
    this.focusAfterAttached = params.cellStartedEdit;
    this.eInput = document.createElement('input');
    this.eInput.type = 'number';
    this.eInput.name = params.colDef.field;
    this.eInput.id = params.rowIndex;
    this.eInput.className = 'w-100';
    this.eInput.value = isCharNumeric(params.charPress)
      ? params.charPress
      : params.value;
    var that = this;
    this.eInput.addEventListener('keypress', function (event) {
      if (!isKeyPressedNumeric(event)) {
        that.eInput.focus();
        if (event.preventDefault) event.preventDefault();
      }
    });
  };
  NumericCellEditor.prototype.getGui = function () {
    return this.eInput;
  };
  NumericCellEditor.prototype.afterGuiAttached = function () {
    if (this.focusAfterAttached) {
      this.eInput.focus();
      this.eInput.select();
    }
  };
  NumericCellEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
  };
  NumericCellEditor.prototype.isCancelAfterEnd = function () { };
  NumericCellEditor.prototype.getValue = function () {
    return this.eInput.value;
  };
  NumericCellEditor.prototype.focusIn = function () {
    var eInput = this.getGui();
    eInput.focus();
    eInput.select();
    console.log('NumericCellEditor.focusIn()');
  };
  NumericCellEditor.prototype.focusOut = function () {
    console.log('NumericCellEditor.focusOut()');
  };
  return NumericCellEditor;
}



export function quantityEditor() {
  function isDecimal(charStr) {
    return /^\d*\.?\d{1,3}$/.test(charStr);
  }
  function isKeyPressedDecimal(event) {
    const value = event.target.value;
    return isDecimal(value);
  }
  function TextEditor() { }
  TextEditor.prototype.init = function (params) {
    this.focusAfterAttached = params.cellStartedEdit;
    this.eInput = document.createElement('input');
    this.eInput.type = 'number';
    this.eInput.name = params.colDef.field;
    this.eInput.id = params.rowIndex;
    this.eInput.className = 'w-100';
    this.eInput.value = isDecimal(params.charPress)
      ? params.charPress
      : params.value;
    const that = this;
    this.eInput.addEventListener('keypress', function (event) {
      if (!isKeyPressedDecimal(event)) {
        that.eInput.focus();
        if (event.target.value.indexOf('.') === event.target.value.length - 1) {
        } else {
          event.target.value = parseFloat(event.target.value).toFixed(3);
        }
      }
    });

  };
  TextEditor.prototype.getGui = function () {
    return this.eInput;
  };
  TextEditor.prototype.afterGuiAttached = function () {
    if (this.focusAfterAttached) {
      this.eInput.focus();
      // this.eInput.select();
    }
  };
  TextEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
  };
  TextEditor.prototype.isCancelAfterEnd = function () { };
  TextEditor.prototype.getValue = function () {
    return this.eInput.value;
  };

  // TextEditor.prototype.afterGuiAttached = function () {
  //   this.eInput.focus();
  // };

  TextEditor.prototype.focusIn = function () {
    var eInput = this.getGui();
    eInput.focus();
    eInput.select();
  };

  TextEditor.prototype.destroy = function () {
    return 0;
    // but this example is simple, no cleanup, we could  even leave this method out as it's optional
  };

  TextEditor.prototype.isPopup = function () {
    // and we could leave this method out also, false is the default
    return false;
  };

  TextEditor.prototype.getValue = function () {
    return this.eInput.value;
  };

  TextEditor.prototype.focusOut = function () {
    console.log('TextEditor.focusOut()');
  };
  return TextEditor;
}

export function checkboxEditor() {
  function ChecboxEditor() { }
  ChecboxEditor.prototype.init = function (params) {
    this.focusAfterAttached = params.cellStartedEdit;
    this.eInput = document.createElement('input');
    this.eInput.type = 'checkbox';
    this.eInput.name = params.colDef.field;
    this.eInput.id = params.rowIndex;
    this.eInput.checked = params.value;
    this.eInput.className = 'w-100 h-50';
    this.eInput.value = params.value;

  };
  ChecboxEditor.prototype.getGui = function () {
    return this.eInput;
  };
  ChecboxEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
    this.eInput.select();
  };
  ChecboxEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
  };
  ChecboxEditor.prototype.isCancelAfterEnd = function () { };
  ChecboxEditor.prototype.getValue = function () {
    return this.eInput.checked;
  };
  ChecboxEditor.prototype.focusIn = function () {
    var eInput = this.getGui();
    eInput.focus();
    eInput.select();
    console.log('ChecboxEditor.focusIn()');
  };
  ChecboxEditor.prototype.focusOut = function () {
    console.log('ChecboxEditor.focusOut()');
  };
  return ChecboxEditor;
}


export function CheckColorColumn(param, condition, value) {
  if (condition === '==') {
    return param === value;
  } else if (condition === '<') {
    return param < value;
  } else if (condition === '>') {
    return param > value;
  } else if (condition === '<=') {
    return param <= value;
  } else if (condition === '>=') {
    return param >= value;
  } else if (condition === '!=') {
    return param !== value;
  }
  return false;
}

const isEqual = function (value, other) {

  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) { return false; }

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) { return false; }

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) { return false; }

  // Compare two items
  const compare = function (item1, item2) {

    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) { return false; }
    }

    // Otherwise, do a simple comparison
    else {

      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) { return false; }

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) { return false; }
      } else {
        if (item1 !== item2) { return false; }
      }

    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) { return false; }
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) { return false; }
      }
    }
  }

  // If nothing failed, return true
  return true;

};

import { flatten } from 'lodash';
import * as numeral from 'numeral';
export function CheckAction(path, action) {
  const menuItems = localStorage.hasOwnProperty('menuItems') ? JSON.parse(localStorage.getItem('menuItems')) : null;
  let status = false;
  if (menuItems) {
    let newMenuItem = [];
    for (let items of menuItems) {
      if (items.submenus.length > 0) {
        newMenuItem = [...newMenuItem, items.submenus];
        newMenuItem = flatten(newMenuItem)
      }
    }
    const menus = newMenuItem.find(m => m.path === path);
    if (menus) {
      if (menus.actions.map(d => d.actionCd).indexOf(action) > -1) {
        status = true;
      } else {
        status = false;
      }
    }
  }
  return status;
}

export function onValidateNumeric(event) {
  const regex = /^[0-9]+/;
  if (event.type === 'keypress') {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      // event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  else if (event.type === 'keyup') {
    event.target.value = event.target.value.trimStart();
  } else {
    const regexFirst = /^\s+/g;
    const value = event.clipboardData.getData('Text');
    if (regexFirst.test(value)) {
      event.preventDefault();
      event.target.value = value.trim();
    }
    if (!regex.test(value)) {
      event.preventDefault();
    }
  }
}

export function onProcessValue(event, allowNonWord?: boolean) {
  const regex = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+/;
  const regexNonWord = /^[a-zA-Z0-9-'",.ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+/;
  if (event.type === 'keypress') {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (allowNonWord) {
      if (!regexNonWord.test(key)) {
        // event.preventDefault();
        return false;
      } else {
        return true;
      }
    } else {
      if (!regex.test(key)) {
        // event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
  }
  else if (event.type === 'keyup') {
    event.target.value = event.target.value.trimStart();
  } else {
    const regexFirst = /^\s+/g;
    const value = event.clipboardData.getData('Text');
    if (regexFirst.test(value)) {
      event.target.value = event.target.value.trimStart();
    }
    if (!regex.test(value)) {
      event.preventDefault();
    }
  }
}

export function autoCompleteValueValidate(event, allowNonWord?: boolean) {
  const regex = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+/;
  const regexNonWord = /^[a-zA-Z0-9-'",.ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]+/;
  if (event.type === 'keyup') {
    event.target.value = event.target.value.trimStart();
    if(allowNonWord) {
      if (!regexNonWord.test(event.target.value)) {

      }
    } else {
      event.target.value = event.target.value.replaceAll(/[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#'"]/g, '');
    }
  } else {
    const regexFirst = /^\s+/g;
    const value = event.clipboardData.getData('Text');
    if (regexFirst.test(value)) {
      event.target.value = event.target.value.trimStart();
    }
    if (!regex.test(value)) {
      event.preventDefault();
    }
  }
}

export function getFieldValueAggrid(form, fieldName, fieldValue = ''): any {
  let result = '';
  form.group_fields.forEach(results => {
    results.fields.forEach(data => {
      if (data.field_name === fieldName) {
        result = data[fieldValue || 'columnValue'];
      }
    });
  });
  return result;
}

// gán tổ chức khi thêm mới từ tổ chức đang được chọn
export function setOrganizeId(groupFields, field_name, organId) {
  let datas: any = groupFields
  if(datas && datas.length>0 ) {
    datas.forEach( group => {
      group.fields.forEach(field => {
          if(field.field_name === field_name) {
            field.columnValue = field.columnValue ? field.columnValue : organId;
          }
      });
    });
  }
  return datas;
}

export function getValueOfField(datas, field_name) {
  let value = ''
  datas.forEach( group => {
    group.fields.forEach(field => {
      if(field.field_name === field_name) {
        value = field.columnValue;
      }
    });
  }); 
  return value;
}
