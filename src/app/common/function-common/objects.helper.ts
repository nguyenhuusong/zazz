import {FormArray, FormControl, FormGroup} from '@angular/forms';





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
      if (Array.isArray(list[i].children) && list[i].children.length) {
        findNodeInTree(list[i].children, nodeId);
      } else {
        if (list[i].data === nodeId ) {
            return list[i];
        }
      }
  }
}

export function checkIsObject(data): boolean {
    return typeof data === 'object' && data !== null
}