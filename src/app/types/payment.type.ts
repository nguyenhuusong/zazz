export interface Payment {
    id: number;
    bookingId: number;
    bookingCd: string;
    transNo: string;
    installNum: number;
    paymentAmt: number;
    cus_Name: string;
    transType: string;
    paymentStatus: number;
    statusName: string;
    note: string;
    saleId: string;
    paymentDt: string;
}
