export interface DashboardEmployee {
    empoyees: DBEmpoyees[];
    empWorking: DBEmpWorking[];
    empPositionType: DBEmpPositionType[];
    empPosition: DBEmpPosition[];
    empContractType: DBEmpContractType[];
    empProcessing: DBEmpoyees[];
}

export interface DBEmpoyees {
    id: number;
    name: string;
    emp_num: number;
}

export interface DBEmpWorking {
    cd: string;
    name: string;
    emp_num: number;
    status: number
}

export interface DBEmpPositionType {
    cd: string;
    name: string;
    emp_num: number;
    status: number;
}

export interface DBEmpPosition {
    gd: string;
    name: string;
    emp_num: number;
}

export interface DBEmpContractType {
    gd: string;
    name: string;
    emp_num: number;
}