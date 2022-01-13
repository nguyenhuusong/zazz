import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as queryString from 'querystring'
import { ApiSmartService } from 'src/app/services/api-smart/apismart.service';
import { cloneDeep } from 'lodash';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridFn, checkboxEditor, formatMargin, FormatNumberCurrency, momentFormatDate, onProcessValue } from 'src/app/utils/common/function-common';
import { CustomTooltipComponent } from 'src/app/utils/common/customtooltip.component';
const MAX_SIZE = 100000000;
import { ButtonRendererComponent } from 'src/app/utils/common/button-renderer.component';
import { ButtonAgGridComponent } from 'src/app/common/ag-component/button-renderermutibuttons.component';
import { CheckboxEditorComponent } from 'src/app/utils/common/checkbox-editor.component';
import { forkJoin } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as numeral from 'numeral';
import { AutoComplete } from 'primeng/autocomplete';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { KEYBUTTON } from 'src/app/shared/constants';

@Component({
  selector: 'app-supplier-to-product',
  templateUrl: './supplier-to-product.component.html',
  styleUrls: ['./supplier-to-product.component.css']
})
export class SupplierToProductComponent implements OnInit, OnChanges {
  public modules: Module[] = AllModules;
  submited = false;
  listWarehouse = [];
  displayWarehouse = false;
  modelSupplierToProduct = {
    id: '',
    storeId: '',
    productId: '',
    supplierId: '',
    barcode: '',
    product_Name: '',
    unitId: '',
    active: 1,
    supplier_Name: '',
    buyPrice: 0,
    sellPrice: 0,
    is_consignment: false,
    min_safety_stock: 0,
    max_safety_stock: 0,
    specification: ''
  };
  displaySupplierToProduct = false
  @Input() store_id;
  @Input() quydoi = false;
  @Input() isSave = true;
  @Input() detailSupplierToProduct;
  @Input() detailRow;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiSmart: ApiSmartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef,
  ) {

    this.defaultColDef = {
      tooltipComponent: 'customTooltip',
      resizable: true,
    };
    this.getRowHeight = (params) => {
      if (params.node.master) {
        return 40;
      } else {
        return 400;
      }

    };
    this.getRowHeight2 = (params) => {
      return 40;
    }

    this.getRowHeight1 = (params) => {
      return 50;
    };
    this.frameworkComponents = {
      customTooltip: CustomTooltipComponent,
      buttonRenderer1: ButtonRendererComponent,
      buttonAgGridComponent: ButtonAgGridComponent,
      checkboxRenderer: CheckboxEditorComponent
    };
    this.itemDropdown = [{
      label: 'Theo sản phẩm',
      value: false
    },
    {
      label: 'Theo nhóm sản phẩm',
      value: true
    }];
    this.component = {
      checkboxEditor: checkboxEditor()
    };
    this.gridOptions = {
      getContextMenuItems: params => this.getContextMenuItems(params)
    };
    this.excelStyles = [
      {
        id: 'dateType',
        dataType: 'dateTime',
      },
      {
        id: 'numberType',
        dataType: 'number',
      },
      {
        id: 'stringType',
        dataType: 'string',
      }
    ]
  }
  getRowHeight2
  getRowHeight1
  component;
  itemDropdown
  excelStyles = [];
  gridOptions
  columnDefs
  modelStampPrint = {
    productId: '',
    storeName: '',
    productName: '',
    supplier_name: '',
    unitName: '',
    barCode: '',
    price: '',
    pageWidth: '',
    pageHeight: '',
    quantity: '',
    includeCurrency: false,
    includeUnit: false,
    isSupplier: false,
    border: true,
    isStore: false
  }
  stores = []
  loading = false
  urlPrint

  queryWarehouse = {
    filter: '',
    storeId: '',
    product_id: '',
    unit_id: '',
    barcode: '',
    from_date: null,
    to_date: null,
    offSet: 0,
    pageSize: 1000000
  };
  active;
  selectedRows;
  listStamps;
  listCatStamps;
  gridApi3
  pagingComponent
  modelHistoryProduct = {
    storeId: '',
    productId: '',
    unitId: '',
    barcode: '',
    product_name: '',
    supplier_name: '',
    filter: '',
    gridWidth: 1190,
    offSet: 0,
    pageSize: 1000,
    fromDate: null,
    toDate: null,
  }
  detailSupplierInfo;
  listBarcodes = [];
  detailUnitExchange;
  columnDefs2
  defaultColDef2;
  listSupplierUnitChange;
  displaySupplierInfo
  filter;
  units = []
  detailParent
  displaySupplierPricePlan = false;
  dataSupplicePrice = null;
  detailPromotion;
  displaydetailPromotion = null
  displayDowloadTem = false
  gridApi2;
  gridColumnApi2
  listSupplierProducts: any[] = [];
  detailRowHeight;
  defaultColDef;
  frameworkComponents;
  groupDefaultExpanded;
  detailCellRendererParams;
  gridApi: any;
  gridColumnApi: any;
  objectAction: any;
  gridflexs: any;
  getRowHeight;
  gridApi5
  gridColumnApi5
  cloneSuppliers: any[] = [];
  suppliers: any[] = [];
  public agGridFn = AgGridFn;
  public onProcessValue = onProcessValue;
  public formatMargin = formatMargin;
  formatNumberCurrency = FormatNumberCurrency;
  momentFormatDate = momentFormatDate;
  formGroup = new FormGroup({
    product: new FormControl({ value: {}, disabled: false }, Validators.required)
  });
  formCat = new FormGroup({
    catId: new FormControl({ value: {}, disabled: false }, Validators.required)
  });
  querySearch

  initPrintStamps(isCat: boolean) {
    if (isCat) {
      this.columnDefs3 = [
        {
          headerName: '',
          field: '',
          headerCheckboxSelection: true,
          maxWidth: 150,
          checkboxSelection: true
        },
        {
          headerName: 'Mã nhóm',
          field: 'code',
          maxWidth: 150,
        },
        {
          headerName: 'Tên nhóm',
          field: 'name',
          minWidth: 300,
        },
        // {
        //   headerName: 'Chức năng',
        //   field: 'button',
        //   cellRenderer: 'buttonRenderer1',
        //   cellRendererParams: params => {
        //     return {
        //       buttons: [
        //         {
        //           onClick: this.deleteCat.bind(this),
        //           label: 'Xóa',
        //           icon: 'pi pi-trash',
        //           class: 'btn-danger',
        //         },
        //       ]
        //     };
        //   },
        // }
      ];
    } else {
      this.columnDefs3 = [
        {
          headerName: '',
          field: '',
          headerCheckboxSelection: true,
          maxWidth: 150,
          checkboxSelection: true
        },
        {
          headerName: 'Mã vạch',
          field: 'bar_code',
          maxWidth: 150,
        },
        {
          headerName: 'Tên hàng hóa',
          field: 'productName',
          minWidth: 300,
        },
        {
          headerName: 'Đơn vị tính',
          field: 'unit',
          cellClass: ['border-right', 'text-right'],
        }
      ];
    }
    this.defaultColDef3 = {
      resizable: true,
      cellClass: ['border-right']
    };
  }
  defaultColDef3;
  columnDefs3
  setValue(data) {
    this.displaySupplierToProduct = true;
    this.modelSupplierToProduct.productId = data.id;
    this.modelSupplierToProduct.id = '';
    this.modelSupplierToProduct.product_Name = data.name;
    this.modelSupplierToProduct.supplierId = this.cloneSuppliers && this.cloneSuppliers.length > 0 ? this.cloneSuppliers[0].value : '';
    this.modelSupplierToProduct.storeId = this.store_id;
    this.modelSupplierToProduct.buyPrice = numeral(numeral(data.buy_price).format('0,0')).value();
    this.modelSupplierToProduct.barcode = data.code;
    this.modelSupplierToProduct.min_safety_stock = numeral(numeral(data.min_safety_stock).format('0,0')).value();
    this.modelSupplierToProduct.max_safety_stock = numeral(numeral(data.max_safety_stock).format('0,0')).value();
    this.modelSupplierToProduct.specification = data.modelSupplierToProduct;
  }

  getSuppliersByProductPage(product_id, storeId, data) {
    this.columnDefs = [];
    const opts = { params: new HttpParams({ fromString: `productId=${product_id}&gridWidth=1300&storeId=${storeId}&offSet=${0}&pageSize=${100000000}` }) };
    this.apiSmart.getSupplierPricePage(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        this.listSupplierProducts = results.data.dataList.data;
        this.cloneSuppliers = [...this.suppliers];
        this.onInitAgGridForm(results.data.gridflexs);
        this.setValue(data);
      }
    })
  }

  onInitAgGridForm(gridflexs) {

    this.columnDefs = [
      ...this.agGridFn(gridflexs),
      {
        headerName: '',
        field: 'button',
        filter: '',
        pinned: this.objectAction ? this.objectAction.pinned : 'right',
        width: this.objectAction ? this.objectAction.columnWidth : 60,
        cellRenderer: 'buttonAgGridComponent',
        cellClass: this.objectAction ? this.objectAction.cellClass : ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Sửa',
                icon: 'pi pi-pencil',
                class: 'btn-primary mr5',
                key: KEYBUTTON.XEMCHITIET,
                hide: this.isSave === false
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Xem chính sách NCC',
                icon: 'pi pi-eye',
                class: 'btn-primary',
                key: KEYBUTTON.XEM_CHINH_SACH_NHA_CUNG_CAP
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Xem chính sách khách hàng',
                icon: 'pi pi-eye',
                class: 'btn-primary',
                key: KEYBUTTON.XEM_CHINH_SACH_KHACH_HANG
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Xem chính sách giao dịch',
                icon: 'pi pi-clock',
                class: 'btn-primary',
                key: KEYBUTTON.XEM_CHINH_SACH_GIAO_DICH
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Quy đổi đơn vị tính',
                icon: 'pi pi-reply',
                class: 'btn-primary mr5',
                hide: this.urls === '/product/store-product-page',
                key: KEYBUTTON.QUY_DOI_DON_VI_TINH
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Kế hoạch giá',
                icon: 'pi pi-clock',
                class: 'btn-primary',
                hide: this.urls === '/product/store-product-page',
                key: KEYBUTTON.KE_HOACH_GIA
              },
              {
                onClick: this.OnClickRow.bind(this),
                label: 'Thông tin thẻ kho',
                icon: 'pi pi-eye',
                class: 'btn-primary',
                key: KEYBUTTON.THONG_TIN_THE_KHO
              },
            ]
          };
        },
      },
    ]

    this.defaultColDef = {
      resizable: true,
    };
  }


  OnClickRow(event) {
    // this.viewPromotion(e)
    if (event.event.item.key === KEYBUTTON.XEMCHITIET) {
      this.EditSupplierToProduct(event)
    } else if (event.event.item.key === KEYBUTTON.XEM_CHINH_SACH_NHA_CUNG_CAP) {
      this.showDetailPromotionNCC(event)
    } else if (event.event.item.key === KEYBUTTON.XEM_CHINH_SACH_KHACH_HANG) {
      this.showDetailPromotionCustomer(event);
    } else if (event.event.item.key === KEYBUTTON.XEM_CHINH_SACH_GIAO_DICH) {
      this.clickviewHistoryProducts(event);
    } else if (event.event.item.key === KEYBUTTON.QUY_DOI_DON_VI_TINH) {
      this.UnitExchange(event);
    } else if (event.event.item.key === KEYBUTTON.KE_HOACH_GIA) {
      this.clickSupplierPricePlan(event);
    } else {
      this.viewWarehouseCardInfo(event);
    }

  }



  changeType(event) {
    this.active = !event.value;
    this.selectedRows = [];
    this.listStamps = [];
    this.listCatStamps = [];
    this.initPrintStamps(event.value);
    this.gridApi3.setRowData([]);
  }
  urls = ''
  ngOnChanges(event) {
    this.getSuppliersByProductPage(this.detailSupplierToProduct.id, this.store_id, this.detailSupplierToProduct);
    const urls = this.router.url.split("?");
    this.urls = urls[0];
    const supplier_api = this.apiSmart.getSupplierPage({ params: new HttpParams({ fromString: `offSet=${0}&pageSize=${100000000}` }) }.params.toString());
    const unit_api = this.apiSmart.getUnitPage({ params: new HttpParams({ fromString: `offSet=${0}&pageSize=${100000000}` }) }.params.toString());
    forkJoin([supplier_api, unit_api])
      .subscribe(results => {
        this.suppliers = results[0].data.dataList.data.map(res => {
          return {
            label: `${res.name} [${res.code}]`,
            value: res.id
          }
        });
        this.units = results[1].data.dataList.data.map(res => {
          return {
            label: res.name,
            value: res.id
          }
        });
        this.modelSupplierToProduct.unitId = this.modelSupplierToProduct.unitId ? this.modelSupplierToProduct.unitId : this.units[0].value
      })

    this.getStoresPage();
    this.initPrintStamps(false);
  }
  ngOnInit() {

  }

  getSupplierPage() {
    const opts = { params: new HttpParams({ fromString: `offSet=${0}&pageSize=${100000000}` }) };
    this.apiSmart.getSupplierPage(opts.params.toString()).subscribe(results => {
      this.suppliers = results.data.dataList.data.map(res => {
        return {
          label: `${res.name} [${res.code}]`,
          value: res.id
        }
      });
      this.getSuppliersByProductPage(this.detailSupplierToProduct.id, this.store_id, this.detailSupplierToProduct);
    })
  }


  getStoresPage() {
    const opts = { params: new HttpParams({ fromString: `offSet=${0}&pageSize=${100000000}` }) };
    this.apiSmart.getStoresByUser(opts.params.toString()).subscribe(results => {
      this.stores = results.data.map(res => {
        return {
          label: `(${res.code}) - ${res.name}`,
          value: res.id
        };
      });
      if (localStorage.getItem('storeId') === null || localStorage.getItem('storeId') === 'undefined' || !localStorage.getItem('storeId')) {
        localStorage.setItem('storeId', this.stores[0].value);
      }
      this.store_id = localStorage.getItem('storeId');
      // linked
      this.route.queryParams.subscribe(res => {
        if (res && res.exchange) {
          if (localStorage.getItem('filterExchange')) {
            const filterExchange = JSON.parse(localStorage.getItem('filterExchange'));
            this.modelHistoryProduct.storeId = filterExchange.storeId;
            this.modelHistoryProduct.productId = filterExchange.productId;
            this.modelHistoryProduct.fromDate = new Date(filterExchange.fromDate);
            this.modelHistoryProduct.toDate = new Date(filterExchange.toDate);
            this.modelHistoryProduct.product_name = filterExchange.product_name;
            this.displayHistoryProducts = true;
          }
        } else if (res && res.warehouse) {
          if (localStorage.getItem('filterWarehouse')) {
            const filterWarehouse = JSON.parse(localStorage.getItem('filterWarehouse'));
            this.initWarehouse();
            this.queryWarehouse.from_date = new Date(filterWarehouse.from_date);
            this.queryWarehouse.to_date = new Date(filterWarehouse.to_date);
            this.queryWarehouse.barcode = filterWarehouse.barcode;
            this.queryWarehouse.product_id = filterWarehouse.product_id;
            this.queryWarehouse.unit_id = filterWarehouse.unit_id;
            this.queryWarehouse.storeId = filterWarehouse.storeId;
            this.modelSupplierToProduct.product_Name = filterWarehouse.product_Name;
            // this.queryWarehouse = filterWarehouse.product_name;
            this.getReportStockTag();
          }
        }
      });
    });
  }
  //viewWarehouseCardInfo
  viewWarehouseCardInfo(event) {
    this.initWarehouse();
    this.queryWarehouse.from_date = moment(Date.now()).add(-1, 'M').startOf('month').toDate();
    this.queryWarehouse.to_date = new Date();
    this.queryWarehouse.barcode = event.rowData.bar_code;
    this.queryWarehouse.product_id = event.rowData.product_id;
    this.queryWarehouse.unit_id = event.rowData.unit_id;
    this.queryWarehouse.storeId = this.store_id;
    const querySt = { ...this.queryWarehouse, product_Name: this.modelSupplierToProduct.product_Name };
    localStorage.setItem('filterWarehouse', JSON.stringify(querySt));
    this.getReportStockTag();
  }

  onGridWarehouseReady(params): void {
    this.gridApi5 = params.api;
    this.gridColumnApi5 = params.columnApi;
  }

  onHideWarehouse(): void {
    if (localStorage.getItem('filterWarehouse')) {
      this.router.navigate(['/product/store-product-page']);
    }
    localStorage.removeItem('filterWarehouse');
  }

  //viewWarehouseCardInfo
  onValidateCurrency(event) {
    const regex = new RegExp('^[0-9]+$');
    if (event.type === 'keypress') {
      const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    } else {
      const keyPaste = event.clipboardData.getData('Text');
      if (!regex.test(keyPaste)) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
  }

  getReportStockTag(): void {
    const params = { ...this.queryWarehouse };
    params.from_date = moment(params.from_date).format('YYYY-MM-DD');
    params.to_date = moment(params.to_date).format('YYYY-MM-DD');
    const queryParams = queryString.stringify(params);
    this.apiSmart.getReportStockTag(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listWarehouse = results.data;
        setTimeout(() => {
          if (this.gridApi5) {
            this.gridApi5.sizeColumnsToFit();
          }
        }, 200);
        this.displayWarehouse = true;
      }
    });
  }

  cellClicked(event): void {

    if (event.colDef.field === 'stock_no') {
      if (event.data.stock_no.indexOf('TL') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(2));
        localStorage.setItem('pathPurchase', '/exchange/purchase-back-page');
      } else if (event.data.stock_no.indexOf('NC') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(1));
        localStorage.setItem('pathPurchase', '/exchange/purchase-order-page');
      } else if (event.data.stock_no.indexOf('TP') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(3));
        localStorage.setItem('pathPurchase', '/exchange/import-warehouse-page');
      } else if (event.data.stock_no.indexOf('NG') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(5));
        localStorage.setItem('pathPurchase', '/exchange/import-consignment');
      } else if (event.data.stock_no.indexOf('HH') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(12));
        localStorage.setItem('pathPurchase', '/exchange/export-cancel-product-page');
      } else if (event.data.stock_no.indexOf('XC') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(13));
        localStorage.setItem('pathPurchase', '/exchange/export-product-to-supplier-page');
      } else if (event.data.stock_no.indexOf('XB') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(14));
        localStorage.setItem('pathPurchase', '/exchange/export-kitchen-page');
      } else if (event.data.stock_no.indexOf('XT') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(15));
        localStorage.setItem('pathPurchase', '/exchange/export-product-separate-page');
      } else if (event.data.stock_no.indexOf('XG') > -1) {
        localStorage.setItem('reasonPurchase', JSON.stringify(17));
        localStorage.setItem('pathPurchase', '/exchange/export-consignment');
      }

      if (event.data.stock_no.indexOf('BH') === -1) {
        setTimeout(() => {
          this.router.navigate(['/purchase-order/create-purchase-order'], {
            queryParams: {
              storeId: this.queryWarehouse.storeId, id: event.data.id, linkedWarehouse: true
            }
          });
        });
      } else {
        localStorage.setItem('reasonPurchase', JSON.stringify(11)); // Hóa đơn
        localStorage.setItem('pathPurchase', '/exchange/bill-page');
        setTimeout(() => {
          this.router.navigate(['/exchange/bill-page'], {
            queryParams: {
              code: event.data.stock_no, linkedWarehouse: true
            }
          });
        });
      }
    }
  }
  columnDefWarehouse = []
  initWarehouse(): void {
    this.columnDefWarehouse = [
      {
        headerName: 'Tên HH',
        field: 'product_name',
        width: 400,
        tooltipField: 'product_name',
        cellClass: ['border-right']
      },
      {
        headerName: 'Mã hàng',
        field: 'bar_code',
        tooltipField: 'bar_code',
        cellClass: ['border-right']
      },
      // {
      //   headerName: 'ĐV',
      //   field: 'unit_name',
      //   tooltipField: 'unit_name',
      //   cellClass: ['border-right']
      // },
      {
        headerName: 'Số hóa đơn',
        field: 'stock_no',
        minWidth: 160,
        tooltipField: 'stock_no',
        cellClass: ['border-right', 'text-link', 'cursor-pointer']
      },
      {
        headerName: 'Ngày nhập,xuất hàng',
        field: 'stock_date',
        tooltipField: 'stock_date',
        cellClass: ['border-right']
      },
      {
        headerName: 'SL tồn kho',
        field: 'last_balance',
        headerClass: ['cld7de5b'],
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'last_balance',
        cellClass: ['border-right']
      },
      {
        headerName: 'SL nhập',
        field: 'import_quantity',
        headerClass: ['cl6dabe8'],
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'import_quantity',
        cellClass: ['border-right']
      },
      {
        headerName: 'Đ/giá nhập',
        field: 'import_price',
        headerClass: ['cl6dabe8'],
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'import_price',
        cellClass: ['border-right']
      },
      // {
      //   headerName: 'TT nhập',
      //   field: 'import_amount',
      //   valueFormatter: params => this.formatNumberCurrency(params.value),
      //   cellStyle: {
      //     'font-weight': '500',
      //     textAlign: 'right',
      //   },
      //   tooltipField: 'import_amount',
      //   cellClass: ['border-right']
      // },
      {
        headerName: 'SL xuất',
        field: 'export_quantity',
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        headerClass: ['cl8bd46a'],
        tooltipField: 'export_quantity',
        cellClass: ['border-right']
      },
      {
        headerName: 'Đ/giá xuất',
        field: 'export_price',
        headerClass: ['cl8bd46a'],
        valueFormatter: params => this.formatNumberCurrency(params.value),
        cellStyle: {
          'font-weight': '500',
          textAlign: 'right',
        },
        tooltipField: 'export_price',
        cellClass: ['border-right']
      },
      // {
      //   headerName: 'TT xuất',
      //   field: 'export_amount',
      //   valueFormatter: params => this.formatNumberCurrency(params.value),
      //   cellStyle: {
      //     'font-weight': '500',
      //     textAlign: 'right',
      //   },
      //   tooltipField: 'export_amount',
      //   cellClass: ['border-right']
      // },
    ]
  }

  onSelectProduct(event) {
    const model = {
      product_id: event.id,
      unit_id: event.unit_id,
      bar_code: event.code,
      productName: event.name,
      unit: event.unit_name
    };

    if (this.listStamps.find(l => l.barcode === model.bar_code)) {

    } else {
      this.listStamps.push(model);
    }
    this.formGroup.controls.product.setValue({ ...this.formGroup.controls.product.value, name: this.querySearch });
    this.gridApi3.setRowData(this.listStamps);
  }

  onBlurEvent(event, autoComplete: AutoComplete) {
    // autoComplete.focusInput();
  }
  productStamps
  deleteStamp(e) {
    const index = this.listStamps.findIndex(l => l.bar_code === e.rowData.bar_code);
    this.listStamps.splice(index, 1);
    this.gridApi3.setRowData(this.listStamps);
  }
  printLists() {
    this.productStamps.storeName = this.stores.find(s => s.value === this.store_id).label;
    this.productStamps.store_id = this.store_id;
    if (this.listStamps.length > 0) {

      this.productStamps.products = this.listStamps.map(l => ({
        product_id: l.product_id,
        unit_id: l.unit_id,
        bar_code: l.bar_code
      }));

      this.apiSmart.stampsPrint(this.productStamps)
        .subscribe(result => {
          if (result.status === 'success') {
            window.open(result.data, '_blank');
            // this.printStamps = false;
          }
        });
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  emitEvent(): void {
    this.active = !this.active;
    this.initPrintStamps(!this.active)
  }


  processCell(params) {
    if (params.column.colId === 'updated' || params.column.colId === 'created') {
      return params.value && params.value.split(' ')[0]
    }
    if (params.column.colId === 'active') {
      return params.value && params.value ? 'Đã kích hoạt' : 'Chưa kích hoạt'
    }
    return params.value || null
  }

  exportDataAsExcel(params) {
    var paramsExcel = {
      sheetName: 'export',
      exportMode: 'xlsx',
      suppressTextAsCDATA: null,
      rowHeight: 20,
      headerRowHeight: undefined,
      processCellCallback: params => this.processCell(params)
    };
    this.gridApi.exportDataAsExcel(paramsExcel)
  }

  exportDataAsCsv(params) {
    var paramsCsv = {
      sheetName: 'export',
      exportMode: 'xls',
      suppressTextAsCDATA: null,
      rowHeight: 20,
      headerRowHeight: undefined,
      processCellCallback: params => this.processCell(params)
    };
    this.gridApi.exportDataAsCsv(paramsCsv)
  }

  getContextMenuItems(params) {
    const result = [
      'copy',
      {
        name: 'Excel Export (.xlsx)',
        action: () => this.exportDataAsExcel(params),
        icon: '<i class="pi pi-download"></i>'
      },
      {
        name: 'CSV Export (v2007 <i class="fa fa-arrow-down"></i>)',
        action: () => this.exportDataAsCsv(params),
        icon: '<i class="pi pi-download"></i>'
      }
    ]
    return result;
  }
  columnDefs4
  init4() {
    this.columnDefs4 = [
      ...this.agGridFn(this.cols4)
    ];
  }

  handleChange(e): void {
    this.activeIndex = e.index;
  }
  activeIndex = 0
  displayHistoryProducts
  fromDate;
  toDate
  clickviewHistoryProducts(e) {
    this.modelHistoryProduct.productId = e.rowData.unit_id ? e.rowData.product_id : e.rowData.id;
    this.modelHistoryProduct.product_name = e.rowData.unit_id ? e.rowData.product_name : e.rowData.name;
    this.modelHistoryProduct.supplier_name = e.rowData.unit_id ? e.rowData.supplier_name : '';
    this.modelHistoryProduct.fromDate = new Date(moment().add(-1, 'month').format())
    this.modelHistoryProduct.toDate = new Date()
    this.modelHistoryProduct.storeId = this.store_id;
    this.modelHistoryProduct.unitId = e.rowData.unit_id ? e.rowData.unit_id : '';
    this.modelHistoryProduct.barcode = e.rowData.bar_code ? e.rowData.bar_code : '';
    this.modelHistoryProduct.offSet = 0;
    this.modelHistoryProduct.pageSize = 1000000000;
    this.fromDate = null;
    this.toDate = null;
    localStorage.setItem('filterExchange', JSON.stringify(this.modelHistoryProduct));
    this.displayHistoryProducts = true;
  }
  cols4;
  noRowsTemplate
  listHistoryProducts = [];
  objectAction4
  paginateHistoryProduct;
  countRecord: any = { totalRecord: 0, currentRecordStart: 0, currentRecordEnd: 0 };
  getProductHistoryPage() {
    let params = { ...this.modelHistoryProduct };
    delete params.product_name;
    params.fromDate = params.fromDate ? moment(params.fromDate).format() : null;
    params.toDate = params.toDate ? moment(params.toDate).format() : null;
    const queryParams = queryString.stringify(params);
    this.apiSmart.getProductHistoryPage(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listHistoryProducts = results.data.dataList.data;
        if (this.listHistoryProducts.length > 0) {
          this.noRowsTemplate = ''
        } else {
          this.noRowsTemplate = `<h4>Hàng hóa ${this.modelHistoryProduct.product_name} chưa có giao dịch nào </h4>`
        }
        if (this.modelHistoryProduct.offSet === 0) {
          this.cols4 = results.data.gridflexs;
          this.cols4.forEach(column => {
            if (column.columnField === 'actions') {
              this.objectAction4 = column;
            }
          });
        }
        this.init4();
        this.paginateHistoryProduct.total = results.data.dataList.recordsTotal;
        this.countRecord.totalRecord = results.data.dataList.recordsTotal;
 if(this.modelHistoryProduct.pageSize === MAX_SIZE) {
            this.modelHistoryProduct.pageSize =this.countRecord.totalRecord;
 }
        this.countRecord.currentRecordStart = this.modelHistoryProduct.offSet + 1;
        if ((results.data.dataList.recordsTotal - this.modelHistoryProduct.offSet) > this.modelHistoryProduct.pageSize) {
          this.countRecord.currentRecordEnd = this.modelHistoryProduct.offSet + Number(this.modelHistoryProduct.pageSize);
        } else {
          this.countRecord.currentRecordEnd = results.data.dataList.recordsTotal;
        }
        this.loading = false;
      }

    })
  }

  getProductCategoryById(id) {
    const opts = { params: new HttpParams({ fromString: `id=${id}` }) };
    this.apiSmart.getProductCategoryById(id ? opts.params.toString() : null).subscribe(results => {
      if (results.status === 'success') {
        this.detailParent = [results.data];
      }
    });
  }
  //plan
  clickSupplierPricePlan(event) {
    this.dataSupplicePrice = event.rowData;
    this.displaySupplierPricePlan = true;
  }

  backpagePricePlan() {
    this.displaySupplierPricePlan = false;
    this.dataSupplicePrice = null;
  }
  // end plan

  showDetailPromotionNCC(e) {
    const opts = { params: new HttpParams({ fromString: `store_id=${this.store_id}&supplier_id=${e.rowData.supplier_id}&product_id=${e.rowData.product_id}&barcode=${e.rowData.bar_code}&unit_id=${e.rowData.unit_id}` }) };
    this.apiSmart.getPolicy(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        this.detailPromotion = results.data;
        if (this.detailPromotion?.policy_on_product.length === 0 && this.detailPromotion?.policy_on_bill.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Thông báo', detail: `Hàng hóa chưa được áp dụng chính sách` });
        } else {
          this.displaydetailPromotion = true;
          this.detailPromotion?.policy_on_product.forEach(element => {
            element?.promotion_details?.forEach(element1 => {
              element1.promotion_by_quantities = [...element1.promotion_by_quantities, ...element1.promotion_by_prices]
            });
          });
          this.detailPromotion.policy_on_product = [...this.detailPromotion.policy_on_product]
        }
      } else {
        // this.message = { severity: 'error', summary: 'Thông báo', detail: results ? results.message : '' };
      }
    })
  }

  showDetailPromotionCustomer(e) {
    const opts = { params: new HttpParams({ fromString: `store_id=${this.store_id}&product_id=${e.rowData.product_id}&barcode=${e.rowData.bar_code}&unit_id=${e.rowData.unit_id}` }) };
    this.apiSmart.getPlolicyForCustomer(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        this.detailPromotion = results.data;
        if (this.detailPromotion?.policy_on_product.length === 0 && this.detailPromotion?.policy_on_bill.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Thông báo', detail: `Hàng hóa chưa được áp dụng chính sách` });
        } else {
          this.displaydetailPromotion = true;
          this.detailPromotion?.policy_on_product.forEach(element => {
            element?.promotion_details?.forEach(element1 => {
              element1.promotion_by_quantities = [...element1.promotion_by_quantities, ...element1.promotion_by_prices]
            });
          });
          this.detailPromotion.policy_on_product = [...this.detailPromotion.policy_on_product]
        }
      } else {
        // this.message = { severity: 'error', summary: 'Thông báo', detail: results ? results.message : '' };
      }
    })
  }

  //dowload tem

  DowloadTem(e) {
    this.modelStampPrint.productId = e.rowData.product_id;
    this.modelStampPrint.border = false;
    this.modelStampPrint.includeUnit = false;
    this.modelStampPrint.includeCurrency = false;
    this.modelStampPrint.isStore = false;
    this.modelStampPrint.productName = e.rowData.product_name;
    this.modelStampPrint.barCode = e.rowData.bar_code;
    this.modelStampPrint.price = this.formatNumber(e.rowData.sell_price);
    this.modelStampPrint.unitName = e.rowData.unit_name;
    this.modelStampPrint.supplier_name = e.rowData.supplier_Name;
    this.displayDowloadTem = true;
    this.apiDowloadTem();
  }

  apiDowloadTem() {
    this.loading = true;
    this.modelStampPrint.quantity = this.modelStampPrint.quantity ? this.modelStampPrint.quantity : '1';
    const opts = {
      params: new HttpParams(
        {
          fromString:
            `productId=${this.modelStampPrint.productId}&storeId=${this.store_id}&storeName=${this.modelStampPrint.isStore ? this.stores.filter(d => d.value === this.store_id)[0].label : ''}&barCode=${this.modelStampPrint.barCode}&pageWidth=60&pageHeight=38&stampWidth=60&stampHeight=38&quantity=${this.modelStampPrint.quantity}&border=${this.modelStampPrint.border}&includeCurrency=${this.modelStampPrint.includeCurrency}&includeUnit=${this.modelStampPrint.includeUnit}`
        })
    };

    this.apiSmart.stampPrint(opts.params.toString()).subscribe(results => {
      this.urlPrint = results.data;
      setTimeout(() => {
        this.loading = false;
      }, 100);
      //  location.href = this.urlPrint;
    }, error => {
      this.loading = false;
    });
  }


  //edit Supplier

  getUnitPage() {
    const opts = { params: new HttpParams({ fromString: `offSet=${0}&pageSize=${100000000}` }) };
    this.apiSmart.getUnitPage(opts.params.toString()).subscribe(results => {
      this.units = results.data.dataList.data.map(res => {
        return {
          label: res.name,
          value: res.id
        }
      });
      this.modelSupplierToProduct.unitId = this.modelSupplierToProduct.unitId ? this.modelSupplierToProduct.unitId : this.units[0].value
    })
  }

  clickRowSupplier(e) {
    if (e.colDef.field != 'button') {
      this.setValueSupplier(e.data);
    }
  }

  EditSupplierToProduct(e) {
    this.setValueSupplier(e.rowData);
  }

  getCode = (e) => {
    e = e || window.event;
    return e.key;
  };
  onValidateCurrency1 = (e) => {
    const key = this.getCode(e);
    console.log(key)
    if (isFinite(key) || key === '.') {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  };

  setValueSupplier(data) {
    this.displaySupplierToProduct = true;
    this.modelSupplierToProduct.productId = data.product_id;
    this.modelSupplierToProduct.id = data.id;
    this.modelSupplierToProduct.product_Name = data.product_name;
    this.modelSupplierToProduct.supplierId = data.supplier_id;
    this.modelSupplierToProduct.storeId = data.store_id;
    this.modelSupplierToProduct.storeId = data.store_id;
    this.modelSupplierToProduct.barcode = data.bar_code;
    this.modelSupplierToProduct.unitId = data.unit_id;
    this.modelSupplierToProduct.active = data.active;
    this.modelSupplierToProduct.is_consignment = data.is_consignment;
    this.modelSupplierToProduct.specification = data.specification;
    this.modelSupplierToProduct.buyPrice = numeral(numeral(data.buy_price).format('0,0[.]00')).value();
    this.modelSupplierToProduct.sellPrice = numeral(numeral(data.sell_price).format('0,0[.]00')).value();
    this.modelSupplierToProduct.min_safety_stock = numeral(numeral(data.min_safety_stock).format('0,0[.]00')).value();
    this.modelSupplierToProduct.max_safety_stock = numeral(numeral(data.max_safety_stock).format('0,0[.]00')).value();
  }

  cancelEditSupplierProduct() {
    this.modelSupplierToProduct.id = '';
    this.modelSupplierToProduct.supplierId = this.cloneSuppliers[0].value;
    this.modelSupplierToProduct.buyPrice = numeral(numeral(this.detailSupplierToProduct.buy_price).format('0,0')).value();
    this.modelSupplierToProduct.barcode = '';
    this.modelSupplierToProduct.sellPrice = 0;
    this.modelSupplierToProduct.is_consignment = false;
    this.modelSupplierToProduct.unitId = this.units[0].value;
    this.modelSupplierToProduct.active = 1;
    this.modelSupplierToProduct.min_safety_stock = 0;
    this.modelSupplierToProduct.max_safety_stock = 0;
    this.modelSupplierToProduct.specification = '';
  }


  saveSupplierToProduct() {
    this.submited = true;
    if (!this.modelSupplierToProduct.buyPrice) {
      return
    }
    const params = {
      id: this.modelSupplierToProduct.id,
      storeId: this.modelSupplierToProduct.storeId,
      productId: this.modelSupplierToProduct.productId,
      supplierId: this.modelSupplierToProduct.supplierId,
      barcode: this.modelSupplierToProduct.barcode,
      unitId: this.modelSupplierToProduct.unitId,
      is_consignment: this.modelSupplierToProduct.is_consignment,
      buyPrice: numeral(this.modelSupplierToProduct.buyPrice).value(),
      sellPrice: numeral(this.modelSupplierToProduct.sellPrice).value(),
      min_safety_stock: numeral(this.modelSupplierToProduct.min_safety_stock).value(),
      max_safety_stock: numeral(this.modelSupplierToProduct.max_safety_stock).value(),
      specification: this.modelSupplierToProduct.specification,
      active: this.modelSupplierToProduct.active,

    }
    this.apiSmart.setSupplierPriceInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.getSuppliersByProductPage(this.modelSupplierToProduct.productId, this.modelSupplierToProduct.storeId, this.detailSupplierToProduct);
        this.cancelEditSupplierProduct();
        this.submited = false;
      } else {
        this.submited = false;
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
      }
    })
  }

  //end Supplier


  formatNumber(value) {
    return numeral(value).format('0,0[.][00]');
  }

  //saveUnitExchange

  getUnitExchangePage(data) {
    const opts = { params: new HttpParams({ fromString: `filter=${this.filter}&id=${data.id}&storeId=${this.store_id}&productId=${this.detailRow.id}&unitId=${data.unit_id}&barCode=${data.bar_code}&gridWidth=${1300}&offSet=${0}&pageSize=${100000}` }) };
    this.apiSmart.getUnitExchangePage(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        this.listSupplierUnitChange = results.data.dataList.data;
        this.onInitAgGridUnitChange(results.data.gridflexs);
      }
    })
  }

  EditUnitExchange(e) {
    this.getUnitExchangeInfo(e.rowData.id, this.detailRow.id, e.rowData);
    this.displaySupplierInfo = true;

  }

  onInitAgGridUnitChange(gridflexs) {
    this.columnDefs2 = [
      ...this.agGridFn(gridflexs),
      {
        headerName: 'Chức năng',
        field: 'button',
        filter: '',
        pinned: this.objectAction ? this.objectAction.pinned : 'right',
        width: this.objectAction ? this.objectAction.columnWidth : 120,
        cellRenderer: 'buttonRenderer1',
        cellClass: this.objectAction ? this.objectAction.cellClass : ['border-right'],
        cellRendererParams: params => {
          return {
            buttons: [
              {
                onClick: this.EditUnitExchange.bind(this),
                label: 'Sửa',
                icon: 'pi pi-pencil',
                class: 'btn-primary mr5',
              },
              {
                onClick: this.DeleteUnitexchange.bind(this),
                label: 'Xóa',
                icon: 'pi pi-trash',
                class: 'btn-danger',
              },
            ]
          };
        },
      },
    ]
    this.defaultColDef2 = {
      resizable: true,
    };
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  sizeToFit() {
    if (this.gridApi) {
      let allColumnIds: any = [];
      this.gridColumnApi.getAllColumns()
        .forEach((column: any) => {
          if (column.colDef.cellClass.indexOf('no-auto') < 0) {
            allColumnIds.push(column)
          } else {
            column.colDef.suppressSizeToFit = true;
            allColumnIds.push(column)
          }
        });
      this.gridApi.sizeColumnsToFit(allColumnIds);
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    let allColumnIds: any = [];
    this.gridColumnApi.getAllColumns()
      .forEach((column: any) => {
        if (column.colDef.cellClass.indexOf('no-auto') < 0) {
          allColumnIds.push(column)
        } else {
          column.colDef.resizable = false;
        }
      });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }


  handleScroll(e) {
    let allColumnIds: any = [];
    this.gridColumnApi.getAllColumns()
      .forEach((column: any) => {
        if (column.colDef.cellClass.indexOf('no-auto') < 0) {
          allColumnIds.push(column)
        } else {
          column.colDef.resizable = false;
        }
      });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    const grid = document.getElementById('myGrid');
    if (grid) {
      const gridBody = grid.querySelector('.ag-body-viewport') as any;
      this.autoSizeAll();
    }
  }

  autoSizeAll() {
    if (this.gridColumnApi) {
      if (this.gridColumnApi.columnModel.bodyWidth + this.gridColumnApi.columnModel.rightWidth < this.gridColumnApi.columnModel.scrollWidth) {
        this.sizeToFit();
      } else {
        let allColumnIds: any = [];
        this.gridColumnApi.getAllColumns()
          .forEach((column: any) => {
            if (column.colDef.cellClass.indexOf('no-auto') < 0) {
              allColumnIds.push(column)
            } else {
              column.colDef.resizable = false;
            }
          });
        this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      }
    }
  }

  DeleteUnitexchange(e) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      accept: () => {
        const opts = { params: new HttpParams({ fromString: `id=${e.rowData.id}` }) };
        this.apiSmart.deleteUnitexchange(opts.params.toString()).subscribe(results => {
          if (results.status === 'success') {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
            this.getUnitExchangePage(this.detailUnitExchange);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results ? results.message : null });
          }
        });
      }
    });
  }

  saveUnitExchange(data) {
    this.loading = true;
    let params = {
      ...this.detailSupplierInfo,
      store_id: this.store_id,
      group_fields: data.forEach(dataParent => {
        dataParent.fields.forEach(data2 => {
          if (data2.field_name === 'to_bar_code') {
            const item = this.listBarcodes.filter(d => d.id === data2.columnValue);
            data2.columnValue = item[0].bar_code;
          }
        });
      })
    };

    this.apiSmart.setUnitExchangeInfo(params).subscribe((results: any) => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.message });
        this.getUnitExchangePage(this.detailUnitExchange);
        // this.displaySupplierInfo = false;
        this.getUnitExchangeInfo('', this.detailRow.id, this.detailUnitExchange);
        this.loading = false;
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results ? results.message : 'Lỗi hệ thống'
        });
        this.getUnitExchangeInfo('', this.detailRow.id, this.detailUnitExchange);
        this.loading = false;
      }
    }), error => {
      this.loading = false;
    };
  }

  UnitExchange(e) {
    this.detailUnitExchange = e.rowData;
    this.displaySupplierInfo = true;
    this.getUnitExchangePage(e.rowData)
    this.getUnitExchangeInfo('', this.detailRow.id, e.rowData);
    const barcodes = [];
    this.listBarcodes = this.listSupplierProducts.filter(b => b.supplier_id === e.rowData.supplier_id);
    for (let item of this.listBarcodes) {
      item.label = `${item.supplier_name} - [${item.bar_code}] - [${item.unit_name}]`;
      item.value = item.id
      if ((item.bar_code === e.rowData.bar_code) && (item.unit_id === e.rowData.unit_id)) {
      } else {
        barcodes.push(item);
      }
    }
    this.listBarcodes = barcodes;
    this.displaySupplierInfo = true;
  }
  optionsButon = [
    { label: 'Hủy', value: 'View' },
    { label: 'Lưu lại', value: 'Update' }
  ];
  listViews = [];
  getUnitExchangeInfo(id, productId, dataSupplier) {
    const opts = { params: new HttpParams({ fromString: `id=${id}&productId=${productId}` }) };
    this.apiSmart.getUnitExchangeInfo(opts.params.toString()).subscribe(results => {
      if (results.status === 'success') {
        const listViews = [...results.data.group_fields]
        listViews.forEach(groupChildren => {
          groupChildren.fields.forEach(d => {
            if (d.field_name === 'from_bar_code') {
              d.columnValue = d.columnValue ? d.columnValue : this.detailUnitExchange.bar_code
              d[d.field_name] = d.columnValue;
            } else if (d.field_name === 'from_unit_id') {
              d.options = this.units.filter(d => d.value === this.detailUnitExchange.unit_id);
              d.columnValue = d.columnValue ? d.columnValue : d.options[0].value;
              d[d.field_name] = d.columnValue;
            } else if (d.field_name === 'to_bar_code') {
              if (id) {
                const item = this.listBarcodes.filter(g => g.bar_code === d.columnValue);
                d.columnValue = item[0].id;
              }
            } else if (d.field_name === 'value') {
              d.columnLabel = 'Số lượng quy đổi'; // add temp
            }
          })
        });
        this.listViews = cloneDeep(listViews);
        this.detailSupplierInfo = results.data;

      }
    });
  }

  handleDateChange(e) { }
  backpageUnitExchange() { }
  onHide() { }

  // end saveUnitExchange


}
