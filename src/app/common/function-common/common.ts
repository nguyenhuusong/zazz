import * as moment from "moment";
import * as numeral from "numeral";
import { searchTree } from "./objects.helper";
import showdown from 'showdown';
export function AgGridFn(lists: Array<any>) {
    let arrAgGrids = [];
    for (let value of lists) {
        let row: any = null;
        if (value.isStatusLable) {
            row = {
                headerName: value.columnCaption,
                field: value.columnField,
                cellClass: value.cellClass,
                headerClass: 'BGE8E9ED',
                filter: value.isFilter,
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
                columnsMenuParams: {
                    suppressColumnFilter: true,
                  },
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
                    headerClass: 'BGE8E9ED',
                    cellClass: value.cellClass,
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
                    sortable: false,
                    width: value.columnWidth,
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    cellRenderer: "avatarRendererFull",
                    headerTooltip: value.columnCaption,
                    tooltipField: value.columnField,
                    // cellClass: ['text-center', 'text-right', 'border-right', 'd-flex', 'align-items-center', 'justify-content-center'],
                    // valueFormatter: value.fieldType == 'decimal' ? ""
                }
            } else if (value.fieldType === 'check') {
                row = {
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass,
                    headerClass: 'BGE8E9ED',
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        if(params.node.rowPinned !== 'bottom') {
                            return `<span class="custom-control custom-checkbox float-left" style="margin-top: 7%;">
                            <input type="checkbox" ${params.value ? 'checked' : ''} disabled class="custom-control-input"  >
                            <label class="custom-control-label"></label>
                          </span>`
                        }else {
                            return params.value
                        }
                        ;
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
                    headerClass: value.headerClass ? value.headerClass : 'BGE8E9ED',
                    cellStyle: value.cellStyle,
                    cellClassRules: value.conditionClass,
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
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
                    headerClass: value.headerClass ? value.headerClass : 'BGE8E9ED',
                    cellStyle: value.cellStyle,
                    cellClassRules: value.conditionClass,
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        return `<span class="status-cell text-center ${params.value === 'Thành công' ? 'err-sus' : 'err-err'}">${params.value}</span>`
                    },
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    editable: value.editable ? value.editable : false,
                    aggFunc: 'sum',
                    tooltipField: value.columnField,
                    headerTooltip: value.columnCaption,
                    valueFormatter: value.customFormat ? formatMargin : formatNumber2
                };
            } else if (value.columnField === 'error') {
                row = {
                    headerClass: 'BGE8E9ED',
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass,
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
                    sortable: false,
                    width: value.columnWidth,
                    cellRenderer: (params: any) => {
                        return `<span class="${(params.value.toLowerCase() === 'ok') ? '' : 'bg-red'}">${params.value}
                       </span>`;
                    },
                    hide: value.isHide ? true : false,
                    pinned: value.pinned,
                    headerTooltip: value.columnCaption,
                    // tooltipField: value.columnField
                    // valueFormatter: value.fieldType == 'decimal' ? "x.toLocaleString()" : ""
                }
            } else {
                row = {
                    // headerName: value.columnCaption,
                    // field: value.columnField,
                    // cellClass: value.cellClass,
                    // filter: value.isFilter ? 'agTextColumnFilter' : '',
                    // sortable: false,
                    width: value.columnWidth,
                    // editable: value.editable ? value.editable : false,
                    // cellRenderer: value.isMasterDetail ? 'agGroupCellRenderer' : '',
                    // hide: value.isHide ? true : false,
                    // pinned: value.pinned,
                    // tooltipField: value.columnField,
                    // headerTooltip: value.
                    headerName: value.columnCaption,
                    field: value.columnField,
                    cellClass: value.cellClass ? value.cellClass : ["border-right", "d-flex", "align-items-center"],
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
                    headerTooltip: value.columnCaption,
                    filter: value.isFilter,
                    menuTabs: ['filterMenuTab', 'generalMenuTab'],
                    columnsMenuParams: {
                        suppressColumnFilter: true,
                      },
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


export function getActionByPathMenu(pathParent, path, listActions) {
    const menusJson = localStorage.getItem('menuItems') ? localStorage.getItem('menuItems') : null;
    const menus = menusJson ? JSON.parse(menusJson) : []
    const menuItems = menus.filter(item => item.path === pathParent);
    if (menuItems.length > 0) {
        const a = searchTree(menuItems[0], path);
        const listMenus = a.actions.filter(element => listActions.includes(element.actionCd));
        return listMenus;
    } else {
        return [];
    }
}

export function CheckHideAction(path, action) {
    return false;
    // const menuItems = localStorage.hasOwnProperty('menuItems') ? JSON.parse(localStorage.getItem('menuItems')) : null;
    // if (menuItems && menuItems.length > 0) {
    //     let newArray = []
    //     menuItems.forEach(element => {
    //         newArray.push(element);
    //         if (element.submenus && element.submenus.length > 0) {
    //             element.submenus.forEach(element1 => {
    //                 newArray.push(element1);
    //             });
    //         }
    //     });
    //     if (newArray.length > 0) {
    //         const menus = newArray.find(m => m.path === path);
    //         if (menus && menus.actions.length > 0) {
    //             const arrAction = menus.actions.map(d => d.actionCd);
    //             if (arrAction.indexOf(action) > -1) {
    //                 return  false;
    //             } else {
    //                 return false;
    //             }
    //         }else {
    //             return false;
    //         }
    //     }else {
    //         return false;
    //     }

    // }else {
    //     return false;
    // }
}

export function checkUrlRole() {

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
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isWeekend(new Date(year, month - 1, i + 1))
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
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isSaturDay(new Date(year, month - 1, i + 1))
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
    var daysInMonth = monthDate.daysInMonth();
    console.log(daysInMonth)
    var arrDays = [];
    for (let i = 0; i < daysInMonth; i++) {
        const isdayWeek = isSunday(new Date(year, month - 1, i + 1))
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

export function parseAll(html: string, htmlTag: string, markdownEquivalent: string) {
    const regEx = new RegExp(`<\/?${htmlTag}>`, "g");
    return html.replace(regEx, markdownEquivalent);
}

//parseHtmlToMarkdown

export function parseHtmlToMarkdown(html: string): string {
    if (!html) {
        return "";
    }

    let markdown = html;

    markdown = markdown.replace(/<h1>/g, "# ").replace(/<\/h1>/g, "");
    markdown = markdown.replace(/<h2>/g, "## ").replace(/<\/h1>/g, "");
    markdown = markdown.replace(/<h3>/g, "### ").replace(/<\/h1>/g, "");
    markdown = markdown.replace(/<h4>/g, "#### ").replace(/<\/h1>/g, "");
    markdown = parseAll(markdown, "strong", "**");
    markdown = parseAll(markdown, "em", "__");
    markdown = parseAll(markdown, "s", "~~");
    markdown = markdown.replace(/<p><br><\/p>/g, "\n");
    markdown = markdown.replace(/<p>/g, "").replace(/<\/p>/g, "  \n");
    markdown = markdown
        .replace(/<blockquote>/g, "> ")
        .replace(/<\/blockquote>/g, "");

    markdown = parseList(markdown, "ol", "1.");
    markdown = parseList(markdown, "ul", "-");

    // todo: Umbrüche optimieren
    // todo: alle überflüssigen tags rausschmeißen
    // todo: links parsen
    // const allATags = markdown.match(/<a.+?<\/a>/g) || [];

    console.log(markdown);
    return markdown;
}


export function parseList(
    html: string,
    listType: "ol" | "ul",
    identifier: string
): string {
    let parsedHtml = html;

    const getNextListRegEx = new RegExp(`<${listType}>.+?<\/${listType}>`);

    while (parsedHtml.match(getNextListRegEx) !== null) {
        const matchedList = parsedHtml.match(getNextListRegEx);

        console.log("matchedList", matchedList);

        const elements = htmlToElements(matchedList);
        const listItems = [];

        elements[0].childNodes.forEach(listItem => {
            let parsedListItem = `${identifier} ${listItem.textContent}`;

            // get level of item to add spaces
            // @ts-ignore
            const className = listItem.className;
            if (className) {
                const splittedClassName = className.split("-");
                const numberOfLevel = parseInt(
                    splittedClassName[splittedClassName.length - 1] || 0
                );

                for (let i = 0; i < numberOfLevel; i++) {
                    parsedListItem = `   ${parsedListItem}`;
                }
            }

            listItems.push(parsedListItem);
        });

        parsedHtml = parsedHtml.replace(
            getNextListRegEx,
            listItems.join("\n") + "\n\n"
        );

        console.log("after parsing one list => ", parsedHtml);
    }

    return parsedHtml;
}

export function htmlToElements(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
}







export function setGroupFields(group_fields) {
    const converter = new showdown.Converter();
    group_fields.forEach(results => {
        results.fields.forEach(data => {
            if (data.columnType === 'datetime' && data.isVisiable) {
                if (data.columnValue) {
                    data.columnValue = typeof data.columnValue === 'string' ? data.columnValue : moment(data.columnValue).format('DD/MM/YYYY');
                } else {
                    data.columnValue = data.columnValue;
                }
            } else if (data.columnType === 'datefulltime' && data.isVisiable) {
                if (data.columnValue) {
                    data.columnValue = typeof data.columnValue === 'string' ? data.columnValue : moment(data.columnValue).format('DD/MM/YYYY HH:mm:ss');
                } else {
                    data.columnValue = data.columnValue;
                }
            } else if (data.columnType === 'timeonly') {
                data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : moment(data.columnValue).format('HH:mm');
                // data.columnValue = typeof data.columnValue === 'string' ? `${data.columnValue}:00` : null;
            } else if (data.columnType === 'selectTree') {
                data.columnValue = data.columnValue ? data.columnValue.orgId : null;
                delete data.options;
            } else if (data.columnType === 'autoCompletes') {
                data.columnValue = data.columnValue && data.columnValue.length > 0 ? data.columnValue.map(d => d.code).toString() : null;
                delete data.options;
            } else if (data.columnType === 'selectTrees') {
                console.log(" data.columnValue", data.columnValue);

                data.columnValue = data.columnValue && data.columnValue.length > 0 ? data.columnValue.map(d => d.orgDepId).toString() : null;
                delete data.options;
            } else if (data.columnType === 'currency') {
                data.columnValue = numeral(data.columnValue).value()
            } else if (data.columnType === 'members') {
                delete data.options;
            } else if (data.columnType === 'linkUrlDrag' || data.columnType === 'listMch') {
                data.columnValue = (data.columnValue && data.columnValue.length) > 0 ? data.columnValue.toString() : '';
            } else if ((data.columnType === 'select' || data.columnType === 'multiSelect' || data.columnType === 'dropdown' || data.columnType === 'checkboxList') && data.options) {
                if (data.columnType === 'multiSelect') {
                    if (data.columnValue && data.columnValue.length > 0) {
                        // data.columnValue = data.columnValue.map(d => d.code);
                        data.columnValue = data.columnValue.toString()
                    } else {
                        data.columnValue = null;
                    }
                    delete data.options;

                } else if (data.columnType === 'checkboxList') {
                    if (data.columnValue && data.columnValue.length > 0) {
                        data.columnValue = data.columnValue.toString();
                    }
                    delete data.options;
                } else {
                    data.columnValue = data.columnValue;
                    delete data.options;

                }
            } else if (data.columnType === 'chips') {
                data.columnValue = data.columnValue ? data.columnValue.toString() : '';
            } else if (data.columnType === 'onOff') {
                data.columnValue = data.columnValue ? "1" : "0"
            } else if (data.field_name === 'content_type') {
                group_fields.forEach(a => {
                    a.fields.forEach(b => {
                        if (b.field_name === 'content_markdown') {
                            if (data.columnValue == 2) {
                                b.columnValue = b.columnValue ? converter.makeHtml(b.columnValue) : '';
                            } else {
                                b.columnValue = b.columnValue;
                            }
                        }
                    });
                });
            } else if (data.field_name === 'content_email') {
                group_fields.forEach(a => {
                    a.fields.forEach(b => {
                        if (b.field_name === 'content_markdown') {
                            data.columnValue = b.columnValue ? converter.makeHtml(b.columnValue) : '';
                        }
                    });
                });
            } else {
                data.columnValue = data.columnValue;
                if (data.columnType === 'number' && data.data_type === 'int') {
                    data.columnValue = data.columnValue ? formatNumber(+data.columnValue) : 0;
                    data.columnValue = numeral(data.columnValue).value();
                }
            }

        })
    });

    return group_fields;
}

export function formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
}

  // end parseHtmlToMarkdown
  export function convesrtDate(value: string) {
    const cutString = value.split(' ');
    const stringDate = cutString[0].split('/');
    if(cutString.length > 1) {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]} ${cutString[1]}`
    }else {
      return `${stringDate[2]}-${stringDate[1]}-${stringDate[0]}`
    }
  }

  export function updateValueFilterFromUrl(groupFields, apiParam) {
    groupFields.forEach(group => {
      group.fields.forEach(field => {
        if(apiParam && apiParam.hasOwnProperty(field.field_name)){
          field.columnValue = apiParam[field.field_name]
        }
      });
    });
    return groupFields;
  }