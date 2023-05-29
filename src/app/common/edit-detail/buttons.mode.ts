export interface BButton {
    label?: string;
    value?: string;
    icon?: string;
    class?: string;
    disabled?: boolean;
}

export interface BBreadcrumb {
    label?: string;
    routerLink?: string
}

export interface GGridflexs {
    cellClass?: Array<string>;
    columnCaption?: string;
    columnField?: string;
    columnWidth?: number;
    fieldType?: string;
    isFilter?: boolean;
    isHide?: boolean;
    isMasterDetail?: boolean;
    isStatusLable?: boolean;
    pinned?: string;
}

export interface LListViews {
    group_cd?: string;
    group_column?: string;
    group_key?: string;
    group_name?: string;
    fields?: Array<FFields>
}

export interface FFields {
    columnClass?: string;
    columnDisplay?: string;
    columnLabel?: string;
    columnObject?: string;
    columnTooltip?: string;
    columnType?: string;
    columnValue?: string;
    data_type?: string;
    field_name: string;
    group_cd?: string;
    isDisable?: boolean;
    isEmpty?: boolean;
    isIgnore?: boolean;
    isRequire?: boolean;
    isSpecial?: boolean;
    isVisiable?: boolean;
}

