import * as moment from "moment";
import * as numeral from "numeral";

export function AgGridFn(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
        let row: any = null;
        if (value.isStatusLable) {
            row = {
                headerName: value.columnCaption,
                field: value.columnField,
                cellClass: value.cellClass,
                filter: value.isFilter ? 'agTextColumnFilter' : '',
                sortable: false,
                width: value.columnWidth,
                cellRenderer: (params: any) => {
                    return `${params.value}`
                },
                hide: value.isHide ? true : false,
                pinned: value.pinned,
                headerTooltip: value.columnCaption,
                tooltipField: value.columnField
            }
        } else {
            if (value.columnField === 'avatarUrl' || value.fieldType === 'image') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    // cellClass: value.cellClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: false,
                    width: value.columnWidth,
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    cellRenderer: "avatarRendererFull",
                    headerTooltip: value.columnCaption,
                    tooltipField: value.columnField,
                    cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
                    // valueFormatter: value.fieldType == 'decimal' ? ""
                }
            } else if (value.fieldType === 'check') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        return `<span class="custom-control custom-checkbox float-left" style="margin-top: 7%;">
                        <input type="checkbox" ${params.value ? 'checked' : ''} disabled class="custom-control-input"  >
                        <label class="custom-control-label"></label>
                      </span>`;
                    },
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    headerTooltip: value.columnCaption,
                    // tooltipField: value.columnField
                    // valueFormatter: value.fieldType == 'decimal' ? "x.toLocaleString()" : ""
                }
            } else if (value.fieldType === 'decimal') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass || [],
                    headerClass: value.headerClass,
                    cellStyle: value.cellStyle,
                    cellClassRules: value.conditionClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    editable: value.editable ? value.editable : false,
                    aggFunc: 'sum',
                    tooltipField: value.columnField,
                    headerTooltip: value.columnCaption,
                    valueFormatter: value.customFormat ? formatMargin : formatNumber2
                };
            } else if (value.columnField === 'errors') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass || [],
                    headerClass: value.headerClass,
                    cellStyle: value.cellStyle,
                    cellClassRules: value.conditionClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        return `<span class="status-cell text-center ${ params.value === 'Thành công' ? 'err-sus' : 'err-err'}">${params.value}</span>`
                    },
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    editable: value.editable ? value.editable : false,
                    aggFunc: 'sum',
                    tooltipField: value.columnField,
                    headerTooltip: value.columnCaption,
                    valueFormatter: value.customFormat ? formatMargin : formatNumber2
                };
            } else {
                row = {
                    // headerName: value.columnCaption,
                    // field: value.columnField,
                    // cellClass: value.cellClass,
                    // filter: value.isFilter ? 'agTextColumnFilter' : '',
                    // sortable: false,
                    // width: value.columnWidth,
                    // editable: value.editable ? value.editable : false,
                    // cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
                    // hide: value.isHide ? true : false,
                    // pinned: value.pinned,
                    // tooltipField: value.columnField,
                    // headerTooltip: value.

                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass,
                    filter: value.isFilter ? 'agSetColumnFilter' : '',
                    sortable: false,
                    editable: value.editable ? value.editable : false,
                    filterParams: {
                        caseSensitive: true,
                        textFormatter: (r) => TextFormatter(r),
                        cellRenderer: cellRendererSanPham,
                    },
                    cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    tooltipField: value.columnField,
                    headerTooltip: value.columnCaption
                }
            }
        }

        arrAgGrids.push(row);
    }
    return arrAgGrids
}

export function AgGridFnEdit(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
        let row: any = null;
        if (value.isStatusLable) {
            row = {
                headerName: value.columnCaption,
                field: value.columnField,
                cellClass: value.cellClass,
                filter: value.isFilter ? 'agTextColumnFilter' : '',
                sortable: true,
                width: value.columnWidth,
                cellRenderer: (params: any) => {
                    return `${params.value}`
                },
                hide: value.isHide ? true : false,
                pinned: value.pinned,
                headerTooltip: value.columnCaption,
                tooltipField: value.columnField
            }
        } else {
            if (value.columnField === 'avatarUrl' || value.fieldType === 'image') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    // cellClass: value.cellClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: true,
                    width: value.columnWidth,
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    cellRenderer: "avatarRendererFull",
                    headerTooltip: value.columnCaption,
                    tooltipField: value.columnField,
                    cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
                    // valueFormatter: value.fieldType == 'decimal' ? ""
                }
            } else if (value.fieldType === 'check') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass,
                    filter: value.isFilter ? 'agTextColumnFilter' : '',
                    sortable: true,
                    editable: true,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        return ` <span class="custom-control custom-checkbox float-left" style="margin-top: 7%;">
                        <input type="checkbox" ${params.value ? 'checked' : ''} disabled class="custom-control-input"  >
                        <label class="custom-control-label"></label>
                      </span>`;
                    },
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    headerTooltip: value.columnCaption,
                    // tooltipField: value.columnField
                    // valueFormatter: value.fieldType == 'decimal' ? "x.toLocaleString()" : ""
                }
            } else if (value.fieldType === 'decimal') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass || [],
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
                    filter: value.isFilter ? 'agSetColumnFilter' : '',
                    sortable: false,
                    editable: true,
                    filterParams: {
                      caseSensitive: true,
                      textFormatter:  (r) => TextFormatter(r),
                      cellRenderer:  cellRendererSanPham,
                    },
                    cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    tooltipField: value.columnField,
                    headerTooltip: value.columnCaption
                }
            }
        }

        arrAgGrids.push(row);
    }
    return arrAgGrids
}

export function cellRendererSanPham(params) {
    console.log(params)
    let rowData = [];
    if (!params.value || params.value === '(Select All)') {
        return params.value;
    }
    params.api.forEachNodeAfterFilter(node => {
        rowData.push(node.data)
    });
    return params.value;
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

export function formatNumber2(params) {
    const number = params.value;
    return numeral(number).format('0,0[.][000]')
}

export function formatMargin(params) {
    const numb = +params.value;
    return (numb * 100).toFixed(2);
}

export function ShowFullScreen() {
    const c: any = document.querySelector(".bread-filter");
    // const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    let eHeight = 0;
    if (e) {
        eHeight = e.clientHeight
    }
    const totalHeight = c.clientHeight + eHeight + 24;
    const main: any = document.querySelector(".main");
    main.className = main.className + ' grid-fixed';
    return window.innerHeight - totalHeight
}

export function HideFullScreen() {
    const main: any = document.querySelector(".main");
    main.className = 'main';
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".bread-filter");
    // const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    let eHeight = 0;
    if (e) {
        eHeight = e.clientHeight
    }
    const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + eHeight + 45;
    return window.innerHeight - totalHeight
}

export function CheckHideAction(path, action) {
    const accountAPI = localStorage.hasOwnProperty('account') ? JSON.parse(localStorage.getItem('account')) : null;
    if (accountAPI) {
        if (accountAPI.roles.indexOf('admin') > -1) {
            return false
        } else {
            const dsMenu = accountAPI.permissions.filter(p => p.rsname === path);
            if (path && dsMenu.length > 0) {
                const items = dsMenu;
                if (items.length > 0) {
                    if (items[0].scopes.indexOf(action) > -1) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            } else {
                return true;
            }
        }
    } else {
        return true;
    }
}

export function SumArray(mang) {
    let sum = 0;
    let i = 0;
    while (i < mang.length) {
        sum += mang[i];
        i++;
    }
    return sum;
}

export function TextFormatter(r) {
    if (r == null) return null;
    return r
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/æ/g, 'ae')
        .replace(/ç/g, 'c')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/ñ/g, 'n')
        .replace(/[òóôõö]/g, 'o')
        .replace(/œ/g, 'oe')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y');
}

export function getDaysOfMonth(year, month) {
    var monthDate = moment(year + '-' + month, 'YYYY-MM');
    var daysInMonth = monthDate.daysInMonth();
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        arrDays.push({
            label: convertNumberToStringDay(moment(new Date(year, month - 1, i + 1)).day()),
            value: moment(new Date(year, month - 1, i + 1)).format('DD-MM'),
            id_date: moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
        })
    }

    // while(daysInMonth) { 
    //   var current = moment().date(daysInMonth);
    //   arrDays.push(current.format('MM-DD-YYYY'));
    //   daysInMonth--;
    // }

    return arrDays;
};


export function convertNumberToStringDay(day) {
    let stringDay = ''
    switch (day) {
        case 0:
            stringDay = 'Chủ nhật'
            break;
        case 1:
            stringDay = 'Thứ 2'
            break;
        case 2:
            stringDay = 'Thứ 3'
            break;
        case 3:
            stringDay = 'Thứ 4'
            break;
        case 4:
            stringDay = 'Thứ 5'
            break;
        case 5:
            stringDay = 'Thứ 6'
            break;
        case 6:
            stringDay = 'Thứ 7'
            break;
        default:
            break;
    }
    return stringDay
}


export function getDaysOfEndWeek(year, month) {
    var monthDate = moment(year + '-' + month, 'YYYY-MM');
    console.log(monthDate)
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isWeekend(new Date(year, month - 1, i + 1))
        console.log(isdayWeek)
        if (isdayWeek) {
            arrDays.push({
                label: moment(new Date(year, month - 1, i + 1)).day() === 6 ? 'Thứ 7' : 'Chủ nhật',
                value: moment(new Date(year, month - 1, i + 1)).format('DD-MM'),
                id_date: moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
            });
        }
    }
    return arrDays;
};

export function getDaysOfSaturDay(year, month) {
    var monthDate = moment(year + '-' + month, 'YYYY-MM');
    console.log(monthDate)
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isSaturDay(new Date(year, month - 1, i + 1))
        console.log(isdayWeek)
        if (isdayWeek) {
            arrDays.push({
                label: 'Thứ 7',
                value: moment(new Date(year, month - 1, i + 1)).format('DD-MM'),
                id_date: moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
            });
        }
    }
    return arrDays;
};

export function getDaysOfSunday(year, month) {
    var monthDate = moment(year + '-' + month, 'YYYY-MM');
    console.log(monthDate)
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isSunday(new Date(year, month - 1, i + 1))
        console.log(isdayWeek)
        if (isdayWeek) {
            arrDays.push({
                label: 'Chủ nhật',
                value: moment(new Date(year, month - 1, i + 1)).format('DD-MM'),
                id_date: moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
            });
        }
    }
    return arrDays;
};

export function isWeekend(date = new Date()) {
    return date.getDay() === 6 || date.getDay() === 0;
}

export function isSaturDay(date = new Date()) {
    return date.getDay() === 6;
}

export function isSunday(date = new Date()) {
    return date.getDay() === 0;
}