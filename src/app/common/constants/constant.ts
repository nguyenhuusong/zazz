export const KEYBUTTON = {
    'XEMCHITIET': 'view',
    'THEMMOI': 'add',
    'XOATHONGTIN': 'remove',
}

// {label: '1. Sổ TD cấp GCN huấn luyện ATVSLĐ', url: '/bao-cao/so-theo-doi-cap-giay-chung-nhan-huan-luyen-atvs'},
// {label: '2. Sổ theo dõi cấp thẻ an toàn.', url: '/bao-cao/so-theo-doi-cap-the-an-toan'},
// {label: '3. Sổ TD nhóm 4 huấn luyện ATVSLĐ', url: '/bao-cao/so-theo-doi-nguoi-thuoc-nhom-4-duoc-huan-luyen-atvs'},
// {label: '4. Sổ TD huấn luyện an toàn hóa chất', url: '/bao-cao/so-theo-doi-huan-luyen-an-toan-hoa-chat'},
// {label: '5. Sổ TD huấn luyện PCCC & CNCH' , url: '/bao-cao/danh-sach-phong-chay-chua-chay-cuu-nan-cuu-ho'},
// {label: '6. Tổng TD huấn luyện các đối tượng', url: '/bao-cao/bao-cao-tong-danh-sach-huan-luyen-cac-doi-tuong'},
// {label: '7. DS học viên tham dự đào tạo', url: '/bao-cao/danh-sach-hoc-vien-tham-su-khoa-dao-tao'},
// {label: '8. DS khóa học thuê ngoài', url: '/bao-cao/danh-sach-khoa-hoc-thue-ngoai-theo-thoi-gian'},
// {label: '9. DS khóa học nội bộ', url: '/bao-cao/danh-sach-khoa-hoc-noi-bo-theo-thoi-gian'},
// {label: '10. Thống kê chương trình đào tạo', url: '/bao-cao/thong-ke-cac-chuong-trinh-dao-tao-theo-thoi-gian'},
// {label: '11. Tổng hợp QT đào tạo theo đối tượng', url: '/bao-cao/bao-cao-tong-hop-qua-trinh-dao-tao-theo-doi-tuong'},
// {label: '12.Lịch sử đào tạo theo nhân viên.', url: '/bao-cao/lich-su-dao-tao-theo-nhan-vien'},
// {label: '13. DS nhân viên chưa tham gia khóa ĐT', url: '/bao-cao/danh-sach-hoc-vien-chua-tham-gia-khoa-dao-tao'},
// {label: '14. DS khóa học hàng năm theo chức vụ', url: '/bao-cao/danh-sach-khoa-hoc-hang-nam-theo-to-chuc'},


export const KEYBAOCAO = {
    'BAO_CAO_SO_1': 'CourseBC1',
    'BAO_CAO_SO_2': 'CourseBC2',
    'BAO_CAO_SO_3': 'CourseBC3',
    'BAO_CAO_SO_4': 'CourseBC4',
    'BAO_CAO_SO_5': 'CourseBC5',
    'BAO_CAO_SO_6': 'CourseBC6',
    'BAO_CAO_SO_7': 'CourseBC7',
    'BAO_CAO_SO_8': 'Course',
    'BAO_CAO_SO_9': 'CourseBC9',
    'BAO_CAO_SO_10': 'TotalTrainingCourse',
    'BAO_CAO_SO_11': 'CourseBC11',
    'BAO_CAO_SO_12': 'CourseBC12',
    'BAO_CAO_SO_13': 'CourseBC13',
    'BAO_CAO_SO_14': 'CourseBC14',
}

export const KEYACTION = {
    'THEMMOI' : 'scope:api:set',
    'SUATHONGTIN' : 'scope:api:set',
    'XOATHONGTIN' : 'scope:api:delete',
    'TIENICH' : 'scope:api:set',
    'EXPORT' : 'scope:api:read',
    'READ' : 'scope:api:read',
    'BAOCAO1' : 'scope:api:report:1',
    'BAOCAO2' : 'scope:api:report:2',
    'BAOCAO3' : 'scope:api:report:3',
    'BAOCAO4' : 'scope:api:report:4',
    'BAOCAO5' : 'scope:api:report:5',
    'BAOCAO6' : 'scope:api:report:6',
    'BAOCAO7' : 'scope:api:report:7',
    'BAOCAO8' : 'scope:api:report:8',
    'BAOCAO9' : 'scope:api:report:9',
    'BAOCAO10' : 'scope:api:report:10',
    'BAOCAO11' : 'scope:api:report:11',
    'BAOCAO12' : 'scope:api:report:12',
    'BAOCAO13' : 'scope:api:report:13',
    'BAOCAO14' : 'scope:api:report:14',
}

export const MENUROLE = {
    'BO_PHAN_TO_CHUC' : {
        function: 'scope:function:list:organizer',
        api: 'resource:api:organizer'
    },
    'NHOM_DOI_TUONG_HOC_VIEN' : {
        function: 'scope:function:list:trainee',
        api: 'resource:api:trainee'
    },
    'KHOA_HOC' : {
        function: 'scope:function:list:course',
        api: 'resource:api:course'
    },
    'LOP_HOC' : {
        function: 'scope:function:list:class',
        api: 'resource:api:class'
    },
    'HINH_THUC_DAO_TAO' : {
        function: 'scope:function:list:type',
        api: 'resource:api:type'
    },
    'QUAN_LY_DAO_TAO' : {
        function: 'scope:function:training:class-student',
        api: 'resource:api:class-student'
    },
    'BAO_CAO_1' : {
        function: 'scope:function:report:1',
        api: KEYACTION.BAOCAO1
    },
    'BAO_CAO_2' : {
        function: 'scope:function:report:2',
        api: KEYACTION.BAOCAO2
    },
    'BAO_CAO_3' : {
        function: 'scope:function:report:3',
        api:  KEYACTION.BAOCAO3
    },
    'BAO_CAO_4' : {
        function: 'scope:function:report:4',
        api:  KEYACTION.BAOCAO4
    },
    'BAO_CAO_5' : {
        function: 'scope:function:report:5',
        api:  KEYACTION.BAOCAO5
    },
    'BAO_CAO_6' : {
        function: 'scope:function:report:6',
        api: KEYACTION.BAOCAO6
    },
    'BAO_CAO_7' : {
        function: 'scope:function:report:7',
        api: KEYACTION.BAOCAO7
    },
    'BAO_CAO_8' : {
        function: 'scope:function:report:8',
        api: KEYACTION.BAOCAO8
    },
    'BAO_CAO_9' : {
        function: 'scope:function:report:9',
        api: KEYACTION.BAOCAO9
    },
    'BAO_CAO_10' : {
        function: 'scope:function:report:10',
        api: KEYACTION.BAOCAO10
    },
    'BAO_CAO_11' : {
        function: 'scope:function:report:11',
        api: KEYACTION.BAOCAO11
    },
    'BAO_CAO_12' : {
        function: 'scope:function:report:12',
        api: KEYACTION.BAOCAO12
    },
    'BAO_CAO_13' : {
        function: 'scope:function:report:13',
        api:  KEYACTION.BAOCAO13
    },
    'BAO_CAO_14' : {
        function: 'scope:function:report:14',
        api: KEYACTION.BAOCAO14
    },
    'QUAN_LY_NGUOI_DUNG' : {
        function: 'scope:function:user:user-manage',
        api: 'resource:api:user'
    },
}


export const CONSTANTS = {
    MESSAGE_ALERT : {
        ADD_SUCCESSFUL : 'Thêm mới thành công',
        ADD_FAIL : 'Thêm mới thất bại',
        ADD_CHILD_COLLECTION_FAIL : 'Thêm mới collection con thất bại',
        DELETE_SUCCESSFUL : 'Xóa thành công',
        DELETE_FAIL : 'Xóa thất bại',
        UPDATE_SUCCESSFUL : 'Cập nhật thành công',
        UPDATE_FAIL : 'Cập nhật thất bại',
        DUPPLICATE_ID: 'Dữ liệu bị trùng',
        FILL_OUT_REQUIRED_FIELD : 'Dữ liệu đang bị sai, Kiểm tra lại!',
        APPROVED_SUCCESSFUL : 'Đồng ý thành công',
        APPROVED_FAIL : 'Đồng ý thất bại',
        REJECT_SUCCESSFUL : 'Từ chối thành công',
        REJECT_FAIL : 'Từ chối thất bại',
        CREATE_NOTIFICATION_SUCCESSFUL : 'Tạo thông báo thành công',
        CREATE_NOTIFICATION_FAIL : 'Tạo thông báo thất bại',
        CREATE_FOLDER_SUCCESSFUL : 'Tạo thư mục thành công',
        CREATE_FILE_SUCCESSFUL : 'Thêm file thành công',
        CHANGE_STATUS_SUCCESSFUL : 'Thay đổi trạng thái thành công',
        ChANGE_STATUS_FAIL : 'Thay đổi trạng thái thất bại',
        CHOOSE_ROOM : 'Vui lòng chọn phòng',
        MISS_SETTING_INVESTMENT : 'Thiếu cài đặt đầu tư',
        MARK_NOTI_READED: 'Đánh dấu tin nhắn đã đọc thành công',
        ADD_COMMENT_SUCCESSFUL: 'Thêm bình luận thành công',
        CHOOSE_PROJECT: 'Chọn dự án',
        CANCEL_APRROCE_SUCCESSFUL: 'Hủy xác nhận thành công',
        CALCULATE_EXPECT_SUCCESSFUL: 'Tính dự thu thành công',
        NOTIFY_SUCCESSFUL: 'Thông báo thành công',
        REMIND_SUCCESSFUL: 'Nhắc nợ thành công',
        CHOOSE_ROW: 'Vui lòng chọn dòng',
        CREATE_BILL_SUCCESSFUL: 'Tạo hóa đơn thành công',
        CREATE_BILL_RECEIPT_SUCCESSFUL: 'Tạo biên nhận thành công',
        CREATE_REPORT_SUCCESSFUL: 'Tạo báo cáo thành công',
        DO_NOT_DATA_SEND: 'Không có dữ liệu để gửi',
        LOCK_CARD_SUCCESS: 'Khóa thẻ thành công',
        LOCK_CARD_FAIL: 'Khóa thẻ thất bại',
        OPEN_CARD_SUCCESS : 'Mở thẻ thành công',
        OPEN_CARD_FAIL : 'Mở thẻ thất bại',
        DELETE_CARD_SUCCESS: 'Xóa thẻ thành công',
        DELETE_CARD_VEHICLE_SUCCESS: 'Xóa thẻ xe thành công',
        APPROVE_CARD_SUCCESS: 'Xác nhận thẻ thành công',
        REJECT_CARD_SUCCESS: 'Từ chối thẻ thành công',
        CALCULATE_SUCCESS: 'Tính giá thành công',
        APPROVE_FAMILY_SUCCESS: 'Duyệt thành viên thành công',
        DELETE_MEMBER_SUCCESS: 'Xóa thành viên thành công',
        ADD_MEMBER_INFORMATION_SUCCESS: 'Thêm thông tin thành viên thành công',
        ADD_SERVICE_SUCCESSFUl: 'Thêm dịch vụ thành công',
        UPDATE_SERVICE_SUCCESSFUL: 'Sửa dịch vụ thành công',
        DELETE_SERVICE_SUCCESSFUL: 'Xóa dịch vụ thành công',
        CHANGE_ROOM_CODE_SUCCESSFUL: 'Đổi mã phòng thành công',
        SAVE_SUCCESS: 'Lưu lại thành công',
        SEND_NOTIFY_SUCCESS: 'Gửi thông báo thành công',
        SAVE_PUSH_LIST: 'Vui lòng lưu danh sách gửi',
        ADD_CARD_SUCCESSFUL: 'Thêm mới thẻ thành công',
        ADD_COMMENT: 'Vui lòng nhập bình luận',
        SELECT_APARTMENT: 'Vui lòng chọn căn hộ',
        REJECT_SUCCESS: 'Hủy bỏ thành công',
        REQUIRE_APPROVE: 'Cần phê duyệt',
        REFUND_SUCCESSFUL: 'Hoàn tiền thành công',
        REFUND_FAIL: 'Hoàn tiền thất bại',
        SEND_MAIL_SUCCESS: 'Gửi mail thành công',
        SEND_MAIL_FAIL: 'Gửi mail thất bại',
        SEND_SMS_SUCCESS: 'Gửi sms thành công',
        SEND_SMS_FAIL: 'Gửi sms thất bại'
    },
    MESSAGE_TYPE: {
        SUCCESSFUL : 1,
        FAILED : 2,
        WARNING : 3
    },
    PRIME_MESSAGE_TYPE: {
        SUCCESS : 'success',
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    },
    RESULT_STATUS: {
      SUCCESS: 'success',
      ERROR: 'error'
    },
    UPLOAD_IMAGE_ALERT : {
        UPLOAD_SUCCESSFUL : 'Upload ảnh thành công',
        UPLOAD_FAIL : 'Upload ảnh thất bại'
    },
    CONFIRM: {
        DELETE: 'Bạn có chắc chắn muốn xóa?',
        DELETE_FEEDS_CATEGORY : 'Bạn có chắc chắn muốn xóa danh mục này không?',
        DELETE_AGENCY : 'Bạn có chắc chắn muốn xóa đại lý này không?',
        DELETE_ROLE_GROUPS : 'Bạn có chắc chắn muốn xóa nhóm quyền này không?',
        DELETE_CONSULTANT_GROUPS : 'Bạn có chắc chắn muốn xóa nhóm này không?',
        CHANGE_STATUS : 'Bạn chắc chắn muốn thay đổi trạng thái',
        // Comment
        DELETE_COMMENT : 'Bạn chắc chắn muốn xóa comment này!',
        REJECT_COMMENT : 'Bạn chắc chắn muốn reject comment này!',
        LOCK_CARD: 'Bạn có muốn khóa thẻ?',
        APPROVE: 'Bạn có muốn xác nhận?',
        DELETE_CARD: 'Bạn có muốn xóa thẻ này không?',
        DELETE_MEMBER: 'Bạn có muốn xóa thành viên?',
        DELETE_SERVICE: 'Bạn có muốn xóa dịch vụ?'
    },
    ORDER_FILTER : {
        FEED_DATE_DESC : {id : 'FEED_DATE_DESC', value : {orderBy : 'date', orderType: 'desc'}, text: 'Ngày tin giảm dần'},
        FEED_DATE_ASC : {id : 'FEED_DATE_ASC', value : {orderBy : 'date', orderType: 'asc'}, text : 'Ngày tin tăng dần'},
        FEED_ORDER_DESC : {id : 'FEED_ORDER_DESC', value : {orderBy : 'order', orderType: 'desc'}, text : 'Sắp xếp giảm dần'},
        FEED_ORDER_ASC : {id : 'FEED_ORDER_ASC', value : {orderBy : 'order', orderType: 'asc'}, text : 'Sắp xếp tăng dần'},
        FEED_ORDER_PROJECT_DESC : {id : 'FEED_ORDER_PROJECT_DESC', value : {orderBy : 'feature_order', orderType: 'desc'},
            text : 'Sắp xếp dự án giảm dần'},
        FEED_ORDER_PROJECT_ASC : {id : 'FEED_ORDER_PROJECT_ASC', value : {orderBy : 'feature_order', orderType: 'asc'},
            text : 'Sắp xếp dự án tăng dần'}
    },
    SUPER_APP_GROUP_ID: 'super-app-group-id'
};

export const FEED_CATEGORY_TYPE = [
    'post',
    'lottery',
    'module',
    'magazine'
];

export const COLLECTION_NAME = {
    FEEDS : 'feeds',
    FEED_CATEGORIES : 'feed_categories',
    PROJECTS : 'projects',
    PROJECT_CATEGORIES : 'project_categories',
    LIBRARY__MEDIA : 'library_media',
    FEED_COMMENT : 'feed_comment',
    AGENCY: 'agency',
    SELLING: 'sellings',
    ROOMSHEET: 'roomSheets',
    CONSULTANT: 'consultants',
    FEED_TOPIC: 'feed_topic',
    FEED_COVERS: 'feed_covers',
    CUSTOMERS: 'customers',
    APPS: 'apps',
    ROLES: 'roles',
    USERS: 'users',
    USER_ROLES: 'user_roles',
    ROLE_USERS: 'role_users',
    DEPARTMENT: 'department',
    PROJECT_TYPE : 'project_type',
    PROJECT_PRICE_RANGE : 'project_price_range',
    PROJECT_LOCATION : 'project_location',
    HOUSE_BOOKING : 'hou_bookings',
    HOUSE_OPENING : 'hou_openings',
    ROLE_GROUPS : 'role_groups',
    HOU_ORDER : 'hou_orders',
    SALE_PROFILE : 'sale_profile',
    HOU_TRANSACTIONS : 'hou_transactions',
    LOTTERY : 'lottery',
    PROJECT_ROOM_TYPE : 'project_room_type',
    INVESTMENT_PROJECT : 'investment_projects',
    LOTTERY_DUMMY_USERS : 'lottery_dummy_users',
    HOU_ORDERS : 'hou_orders',
    CONSULTANT_GROUP: 'consultant_group',
    NOTIFICATIONS : 'notifications',
    NOTIFICATIONS_QUEUE : 'notifications_queue',
    SUPPORTING_CUSTOMERS : 'supporting_customers',
    MENU_WEBMANAGER : 'menu_webmanager',
    MENU_ACTIONS : 'menu_actions',
    AGENCY_POLICY : 'agency_policy',
    RENTING : 'renting',
    INVESTMENT_OWNER : 'investment_owner',
    INVESTMENT_OPENINGS : 'investment_openings'
}

export const CHILD_COLLECTION_NAME = {
    FEED_ITEMS : 'feed_items',
    BUILDINGS : 'buildings',
    FEED_TOPIC : 'feed_topic',
    PROJECT_CATEGORY : 'project_category',
    ROOM_SHEET : 'room_sheets',
    PROJECT_GALLERY : 'project_gallery',
    HOU_PAYMENT_PLANS : 'hou_payment_plans',
    LOTTERY_PRIZES : 'prizes',
    LOTTERY_PROJECT : 'target-projects',
    VIDEO_COVERS : 'video_covers',
    LISTSELLING : 'listselling',
    PROJECT_DOCUMENT : 'project_documents',
    PROJECT_MATERIAL : 'project_material',
    PROJECT_UTILITIES : 'project_utilities'
}


export const GRAND_CHILD_COLLECTION_NAME = {
    ROOM_CATEGORY : 'room_category',
    FLOORS : 'floors',
    PROJECT_DOCUMENT_ITEMS : 'project_document_items'
}

export const GRAND_GRAND_CHILD_COLLECTION_NAME = {
    ROOMS : 'rooms',
    SETS: 'sets'
}

export const DEV_MEDIA = {
    PATH : 'dev_media',
}
export const LIBRARY_MEDIA = {
    PATH : 'library_media',
    PATH_S_HOUSING : 'library_media_s_housing',
};
export const CONSULTANT_CONSTANTS = {
    MESSAGE_ALERT : {
        ADD_SUCCESSFUL : 'Thêm mới thành công',
        ADD_FAIL : 'Thêm mới thất bại',
        ADD_CHILD_COLLECTION_FAIL : 'Thêm mới collection con thất bại',
        DELETE_SUCCESSFUL : 'Xóa thành công',
        DELETE_FAIL : 'Xóa thất bại',
        UPDATE_SUCCESSFUL : 'Cập nhật thành công',
        UPDATE_FAIL : 'Cập nhật thất bại'
    },
    MESSAGE_TYPE: {
        SUCCESSFUL : 1,
        FAILED : 2,
        WARNING : 3
    },
    CONFIRM: {
        DELETE_CONSULTANT : 'Bạn có chắc chắn muốn xóa danh mục này không?',
        CONSULT_BY_MANAGER : 'Đã có dữ liệu nhân viên phụ trách! Không được xóa'
    }
}

export const HOU_TRANSACTION = {
    ORDER : {
        ORDER_STATUS : {
            PENDING : 'pending',
            PROCESSING : 'processing',
            CLOSED : 'closed',
            CANCELED : 'canceled'
        },
        TYPE : {
            BOOKING : 'booking',
            ORDERED : 'ordered'
        }
    },
   PAYMENT_METHOD : {
        CODE : {
            COD : 'COD',
            SUNSHINE_PAY : 'SUNSHINE_PAY',
            NAPAS : 'NAPAS',
            VN_PAY : 'VN_PAY'
        },
       STATUS : {
           PENDING : 'pending',
           RECEIVED : 'received',
           CANCELED : 'canceled'
       }
   }
}

export const SHARE_DATA_CONST = {
    KEYS: {
        SELECT_MENU: 'select menu',
        EDIT_MENU_ACTION : 'edit menu action',
        ADD_MENU_ACTION : 'add menu action',
        DELETE_MENU_ACTION : 'delete menu action',
        RELOAD_DATA : 'reload data',
        ADD_DEPARTMENT : 'add department',
        EDIT_DEPARTMENT : 'edit department',
        ADD_UTILITIES_CATEGORY : 'add utilities category',
        ADD_MATERIAL_CATEGORY : 'add material category',
        EDIT_UTILITIES_CATEGORY : 'edit utilities category',
        EDIT_MATERIAL_CATEGORY : 'edit material category',
        ADD_MATERIAL : 'add material',
        ADD_UTILITIES : 'add utilities',
        EDIT_UTILITIES : 'edit utilities',
        EDIT_MATERIAL : 'edit material',
        CLOSE_UTILITIES_CATEGORY : 'close utilities category',
        CLOSE_UTILITIES_MATERIAL : 'close utilities material',
        EDIT_CARD_APARTMENT_DETAIL : 'edit card apartment detail',
        EDIT_MEMBER_CARD_DETAIL : 'edit member card detail'
    },
    ACTIONS: {
        REFRESH: 'refresh',
        COMPLETED: 'completed',
        ADD: 'add',
        SHOW: 'show',
        UPDATE: 'update',
        CALL_BACK: 'callback',
        RESET: 'reset',
        DOWNLOAD: 'download',
        ERROR: 'error',
        CANCEL: 'cancel',
    }
};

export const ACTIONS = {
    ADD : 'them_moi',
    EDIT : 'sua_thong_tin',
    VIEW : 'xem_chi_tiet',
    DELETE : 'xoa_thong_tin',
    TAI_KHOAN : 'tai_khoan',
    NGHI_VIEC : 'nghi_viec',
    HOAT_DONG : 'hoat_dong',
    XAC_NHAN_NHAN_VIEN : 'xac_nhan_nhan_vien',
    TAO_THE_NHAN_VIEN : 'tao_the_nhan_vien',
    KHOA : 'action_khoa',
    MO_KHOA : 'mo_khoa',
    PHE_DUYET : 'phe_duyet',
    THIET_BI_THANG_MAY : 'thiet_bi_thang_may',
    TANG_THANG_MAY : 'tang_thang_may',
    TAI_VE : 'tai_ve',
    EXPORT: 'export',
}

export const MessageErrorAction = {
    ERROR_ADD : 'Bạn không có quyền thêm mới !',
    ERROR_EDIT: 'Bạn không có quyền sửa !',
    ERROR_DELETE: 'Bạn không có quyền xóa !',
    ERROR_VIEW: 'Bạn không có quyền xem chi tiết !',
    ERROR_TAI_KHOAN: 'Bạn không có quyền xem tài khoản !',
    ERROR_NGHI_VIEC: 'Bạn không có quyền chức năng nghỉ việc !',
    ERROR_HOAT_DONG: 'Bạn không có quyền chức năng hoạt động !',
    ERROR_XAC_NHAN_NHAN_VIEN: 'Bạn không có quyền chức năng xác nhận nhân viên !',
    ERROR_TAO_THE_NHAN_VIEN: 'Bạn không có quyền chức năng tạo thẻ nhân viên !',
    ERROR_KHOA: 'Bạn không có quyền khóa !',
    ERROR_MO_KHOA: 'Bạn không có quyền Mở khóa !',
    ERROR_PHE_DUYET: 'Bạn không có quyền Phê duyệt !',
    ERROR_THIET_BI_THANG_MAY: 'Bạn không có quyền vào chức năng thiết bị thang máy !',
    ERROR_TANG_THANG_MAY: 'Bạn không có quyền vào chức năng tầng thang máy !',
    ERROR_TAI_VE : 'Bạn không có quyền tải về',
    ERROR_EXPORT: 'Bạn không có quyền export',
}

export const TYPE_OF_DOCUMENT  = {
    IDENTITY_CARD: 1, // Chứng minh nhân dân
    NEW_IDENTITY_CARD: 2, // Căn cước công dân
    PASSPORT: 3, // Hộ chiếu
    ENTERPRISE_REGISTRATION_CERTIFICATE: 4 // Giấy phép kinh doanh

}

export const API_PROFILE  = {
    THONG_TIN_CA_NHAN: "GetEmployeeByPersonal",
    CONG_VIEC: "GetEmployeeByJob",
    QUAN_HE_LAO_DONG: "GetEmployeeByContract",
    NGUOI_QUAN_LY: "GetEmployeeByReportTo",
    LIEN_HE: "GetEmployeeByContact",
    THUE_BAO_HIEM: "GetEmployeeByInsurance",
    TIEN_LUONG: "GetEmployeeBySalary",
    CHUYEN_MON: "GetEmployeeByQualification",
    TIEN_ICH: "GetEmployeeByUtility",
    NGUOI_DUNG: "GetEmployeeByUser",
    CHUYEN_CONG_TAC: "GetEmployeeChangeInfo",
    QUAN_LY_TAI_KHOAN: "quanLyTaiKhoan",
  }


  export const MENUACTIONROLEAPI = {
    'GetCandidatePage': {
        'name': 'Danh sách tuyển dụng',
        'api': '0eed6cc8-55f4-4285-9f8e-bfc0ba572253',
        'menu': '',
        'url': 'tuyen-dung'
    },
  }