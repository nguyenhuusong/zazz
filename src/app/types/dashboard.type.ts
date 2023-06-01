export interface DashboardEmployee {
    empoyees: DBEmpoyees[];
    empWorking: DBEmpWorking[];
    empPositionType: DBEmpPositionType[];
    empPosition: DBEmpPosition[];
    empContractType: DBEmpContractType[];
    empProcessing: DBEmpoyees[];
    emp_female: string;
    emp_male: string;
    emp_total: string;
}

export interface DashboardTimekeeping {
    emp_total: number;
    emp_male: number;
    emp_female: number;
    overview: DBOverview[];
    leaveReasons: DBEmpPositionType[];
    topTimeworks: DBTopLeaves[];
    topLeaves: DBTopLeaves[];
    topEatings: DBTopLeaves[];
    agvleaveDays: DBOverview[];
    agvLeaveMonths: DBOverview[];
    
}

export interface DBOverview {
    typeid: number;
    name: string;
    emp_num: number;
    perc: number;
}
export interface DBTopLeaves {
    avatar_url: string;
    code: string;
    fullname: string;
    num: number;
}
export interface DBTopTimeworks {
    avatar_url: string;
    code: string;
    fullname: string;
    num: number;
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
    status?: number
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