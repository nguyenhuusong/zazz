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

export function cellRendererSanPham(params){
    console.log(params)
    let rowData = [];
    if (!params.value || params.value === '(Select All)') {
      return params.value;
    }
    params.api.forEachNodeAfterFilter(node => {
        rowData.push(node.data)
      } );
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
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    const totalHeight = c.clientHeight + d.clientHeight + e.clientHeight + 24;
    const main: any = document.querySelector(".main");
    main.className = main.className + ' grid-fixed';
    return window.innerHeight - totalHeight
}

export function HideFullScreen() {
    const main: any = document.querySelector(".main");
    main.className = 'main';
    const a: any = document.querySelector(".header");
    const b: any = document.querySelector(".sidebarBody");
    const c: any = document.querySelector(".breadcrumb");
    const d: any = document.querySelector(".filterInput");
    const e: any = document.querySelector(".paginator");
    const totalHeight = a.clientHeight + b.clientHeight + c.clientHeight + d.clientHeight + e.clientHeight + 45;
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

export function SumArray(mang){
    let sum = 0;
    let i = 0;
    while (i < mang.length){
        sum += mang[i];
        i++;
    }
    return sum;
}

export function TextFormatter(r){
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