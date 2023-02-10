import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import * as numeral from 'numeral';




export type ArrayLoopCallback = (value: any, index: number, array: any[]) => any;

export function map(array: any | any[], predicate: ArrayLoopCallback, arrayArg?: any): any[] {
    if (!Array.isArray(array)) {
        return [];
    }
    return array.map(predicate, arrayArg);
}

export function getCommonItem(arr1, arr2) {
    return arr1.filter(value => arr2.includes(value));
}


export function grabProperty($data: any, $path: any, $default?: any): any {
    if (typeof $data !== 'object') {
        return $default;
    }
    if (typeof $path !== 'string' && !Array.isArray($path)) {
        return $data;
    }
    if (typeof $path === 'string' && $data[$path]) {
        return $data[$path];
    }
    const $paths = getPath($path);
    for (const $segment of $paths) {
        if ((typeof $data === 'object' || typeof $data === 'function' && typeof $data[$segment] !== 'undefined')) {
            $data = $data[$segment];
        } else {
            return $default;
        }
    }
    return $data;
}

/**
 * Get array string path from string dot path
 * @example
 * // return ['path', 'to', 'dest']
 * getPath('path.to.dest')
 *
 * @param {string | string[]} $path
 * @returns {string[]}
 */
export function getPath($path: string | string[]): string[] {
    if (Array.isArray($path)) {
        return $path as string[];
    }
    if (!$path || typeof $path !== 'string') {
        return [];
    }
    // noinspection SingleCharAlternation
    return ($path as string).replace(/(\[|])/g, '.')
        .replace(/\.+/g, '.')
        .split('.')
        .filter(path => !!path);
}

export function removeEmptyProperty(data) {
    const result = Object.assign({}, data);
    for (const propName in result) {
        if (result[propName] === null || result[propName] === undefined || result[propName] === '') {
            delete result[propName];
        }
    }
    return result;
}

export function initMedia(feeds, path = 'media'): FormArray {
    return new FormArray(map(grabProperty(feeds, path, []), flight => {
        const group = new FormGroup({});
        for (const key in flight) {
            if (flight.hasOwnProperty(key)) {
                group.setControl(key, new FormControl(flight[key]));
            }
        }
        return group;
    }));
}

export function initItemMedia(data): FormGroup {
        const group = new FormGroup({});
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                group.setControl(key, new FormControl(data[key]));
            }
        }
        return group;
}

export function initSelectImage(image): FormArray {
    const result = new FormArray(map(grabProperty(image, '', []), flight => {
        const group = new FormGroup({});
        for (const key in flight) {
            if (flight.hasOwnProperty(key)) {
                group.setControl(key, new FormControl(flight[key]));
            }
        }
        return group;
    }));
    return result;
}



export function DayAndWeekOfMonth(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1 , date.getDate());
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return prefixes[Math.floor(newDate.getDate() / 7)] + ' ' + days[newDate.getDay()];
}


export function weekOfMonth(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1 , date.getDate());
    const prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return prefixes[Math.floor(newDate.getDate() / 7)];
}


export function subtractArray(arrSubtrahend, arrMinuend) {
    return arrSubtrahend.filter((x) => {
        return arrMinuend.indexOf(x) < 0;
    });
}

export function loopEveryNodeTree(o) {
    for (var i in o) {
        if (Array.isArray(o[i].children) && o[i].children.length) {
            console.log('C:', o[i]);
            loopEveryNodeTree(o[i].children);
        } else {
            console.log(i, o[i]);
        }
    }
}

export function findNodeInTree(list, nodeId): any {
  for (let i = 0; i < list.length; i++) {
    //   if (Array.isArray(list[i].children) && list[i].children.length) {
    //     findNodeInTree(list[i].children, nodeId);
    //   } else {
    //     if (list[i].data === nodeId ) {
    //         return list[i];
    //     }
    //   }
    if (list[i].data === nodeId ) {
        return list[i];
      }else if (Array.isArray(list[i].children) && list[i].children.length) {
        findNodeInTree(list[i].children, nodeId);
      }
  }
}

export function checkIsObject(data): boolean {
    return typeof data === 'object' && data !== null
}



export function setMembers(element1, datas) {
    element1.options = [...datas];
    // element1.options.forEach(member => {
    //   member.isCheck = false;
    //   member.child.forEach(user => {
    //     user.isCheck = false;
    //   })
    // })
  }

  export function setSelectTreeValue(element1, datas) {
    element1.options = datas;
    if (element1.columnType === 'selectTrees') {
      const ids = element1.columnValue ? element1.columnValue.split(',') : []
      const results = [];
      findNodeInTree1(element1.options, ids, element1, results);
      element1.columnValue = results;
    } else {
      if (!element1.columnValue || element1.columnValue === null || element1.columnValue === 'all') {
        element1.columnValue = null;
      } else {
        findNodeInTree2(element1.options, element1.columnValue, element1);
        element1.columnValue = typeof element1.columnValue === 'string' ? null : element1.columnValue;
      }
    }
  }

  export function findNodeInTree2(list, nodeId, element1): any {
    for (let i = 0; i < list.length; i++) {
      if (list[i].orgId === nodeId ) {
         element1.columnValue = list[i];
        }else if (Array.isArray(list[i].children) && list[i].children.length) {
          findNodeInTree2(list[i].children, nodeId, element1);
        }
    }
  }

  export function findNodeInTree1(list, ids, element1, results): any {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children && list[i].children.length) {
        findNodeInTree1(list[i].children, ids, element1, results);
      }
      if (ids.includes(list[i].orgId)) {
        results.push(list[i]);
      }
    }
  }

  export function setMultiSelectValue(element1, datas) {
    element1.options = []
    element1.options = cloneDeep(datas);
    if (element1.columnValue) {
      let newarray = [];
      element1.options.forEach(element => {
        if (element1.columnValue && element1.columnValue.split(",").indexOf(element.value) > -1) {
          newarray.push(element.value.toString());
        }
      });
      
      element1.columnValue = newarray;
    }else {
      element1.columnValue = []
    }
  }

  export function setCheckboxradiolistValue(element1, results) {
    element1.options = cloneDeep(results);
    element1.columnValue = element1.columnValue ? element1.columnValue : '';
    let newarray = []
    element1.options.forEach(element => {
      if (typeof element1.columnValue === 'string' && element1.columnValue.split(",").indexOf(element.value) > -1) {
        newarray.push(element);
      }
    });
    element1.columnValue = newarray.map(d => d.value);
  }

  export function setValueAndOptions(element1, results) {
    element1.options = cloneDeep(results);
    element1.columnValue = element1.columnValue ? element1.columnValue : ''
  }

  export function setValueAndOptionsAutocomplete(element1, results) {
    element1.options = results
    element1.columnValue = element1.columnValue ? element1.options[0] : ''
  }

  export function getParamString(lists) {
    const params: any = {};
    lists.forEach(results => {
      results.fields.forEach(data => {
        if (data.columnType === 'datetime' && data.isVisiable) {
          params[data.field_name]= data.columnValue ? moment(data.columnValue, 'DD/MM/YYYY').format('DD/MM/YYYY') : null
        } else if (data.columnType === 'datefulltime' && data.isVisiable) {
          params[data.field_name]= data.columnValue ? moment(data.columnValue).format('DD/MM/YYYY HH:mm:ss') : null
        } else if (data.columnType === 'timeonly') {
          params[data.field_name]= data.columnValue ?  `${data.columnValue}:00` : null

        } else if (data.columnType === 'selectTree') {
          params[data.field_name]= data.columnValue ? data.columnValue.orgId : null;
          delete data.options;
        } else if (data.columnType === 'currency') {
          params[data.field_name]= data.columnValue ? numeral(data.columnValue).value() : null
        }else if ((data.columnType === 'select') || (data.columnType === 'dropdown')) {
          params[data.field_name]= data.columnValue ? isNaN(data.columnValue) ? data.columnValue : parseInt(data.columnValue) : null;
          delete data.options;
        }else if ((data.columnType === 'multiSelect')) {
          params[data.field_name]= data.columnValue ? data.columnValue.map(d => d.code).toString() : null;
          delete data.options;
        }else if ((data.columnType === 'checkboxList')) {
          params[data.field_name]= data.columnValue ? data.columnValue.toString() : null;
          delete data.options;
        }else if ((data.columnType === 'autocomplete')) {
          params[data.field_name]= data.columnValue ? data.columnValue.code : null;
          delete data.options;
        }else if ((data.columnType === 'number')) {
          data.columnValue = data.columnValue ? formatNumber(+data.columnValue) : 0;
          params[data.field_name]= numeral(data.columnValue).value();
        }else if ((data.columnType === 'input')) {
          params[data.field_name]= data.columnValue ? data.columnValue : '';
        }
      })
    });
    
    return params;
  }

  function formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  export function searchTree(element, matchingTitle){
    if(element.path == matchingTitle){
         return element;
    }else if (element.submenus != null){
         var i;
         var result = null;
         for(i=0; result == null && i < element.submenus.length; i++){
              result = searchTree(element.submenus[i], matchingTitle);
         }
         return result;
    }
    return null;
}