export interface Order {
  id: string,
  store_id: string,
  order_date: any,
  supplier_id: string,
  reason: number,
  deliver_date: any,
  order_type: number,
  staff_id: string,
  orderDetails: any[],
  discount: number,
  discount_amount: number,
  total_amount_on_product?: number,
  total_remain_amount?: number,
  total_before_vat_amount?: number,
  total_discount_on_product?: number,
  amount: number,
  promotion_id?: string,
  promotion_code?: string,
  total_vat_5?,
  total_vat_10?
  order_no?
}

export interface Promotion {
  id: string,
  theme: string,
  promotion_type: number,
  promotion_kind_id: string,
  start_date: any,
  end_date: any,
  supplier_id: string,
  details: any[],
  active: boolean,
  storeId?
  discount?
  promotion_id?
  promotion_on_bill_id?
  promotion_type_curency?
  stores?
}

export interface PromotionTotalOnBill {
  id: string,
  theme: string,
  promotion_type: number,
  promotion_detail_type: number,
  start_date: any,
  end_date: any,
  supplier_id: string,
  bill_total: number,
  discount: number,
  max_value: number,
  voucher_no: string,
  voucher_value: number,
  trademark: any,
  product_category_list: any,
  active: boolean,
  details: any,
  store_id?: any,
  stores: any
}

export interface orderDetails {
  id: string,
  order_id: string,
  product_id: string,
  product_name: string,
  unit_id: string,
  unit_name: string,
  bar_code: string,
  quantity: number,
  price: number,
  discount: number,
  discount_on_bill?: number,
  discount_on_bill_amount: number,
  discount_amount: number,
  amount: number,
  remain_amount: number,
  description: string
  supplier_quantity?: number,
  tax_rate?: number,
  promotion_id?: string,
  promotion_code?: string,
  internal_code?: string,
  gift?: number
  specification?: string
  tax_amount?: number;
  price_after_vat?: number;
  before_vat_amount?: number;
  stock_quantity: number,
  stock_internal_quantity: number,
  previous_month_quantity: number,
  open_discount: number,
  open_discount_amount: number,
  previous_month_internal_quantity: number,
  parent_product_id: string;
}


