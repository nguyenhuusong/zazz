export class IdentityCardResult {
    fullData: IdentityCard = new IdentityCard();
    backData: IdentityCard = new IdentityCard();
    frontData: IdentityCard = new IdentityCard();
    isFull: boolean = false;
    type: EChooseType = EChooseType.TWO_FACE;
}

export enum EChooseType {
    TWO_FACE, ONE_FACE
}

export class PreviewImage {
    FULL: string | ArrayBuffer = '';
    BACK: string | ArrayBuffer = '';
    FRONT: string | ArrayBuffer = '';
}

export enum ETypePreview {
    FULL, BACK, FRONT
}

export class IdentityCard {
    address = '';
    addressconf = '';
    birthday = '';
    birthdayconf = '';
    characteristics = '';
    characteristics_conf = '';
    class = '';
    copyright = '';
    country = '';
    district = '';
    document = '';
    ethnicity = '';
    expiry = '';
    hometown = '';
    hometownconf = '';
    id = '';
    id_check = '';
    id_logic = '';
    id_logic_message = '';
    id_type = '';
    idconf = '';
    issue_by = '';
    issue_by_conf = '';
    issue_date = '';
    issue_date_conf = '';
    name = '';
    nameconf = '';
    national = '';
    precinct = '';
    province = '';
    religion = '';
    result_code = '';
    server_name = '';
    server_ver = '';
    sex = '';
    street = '';
    street_name = '';
    typeOfPaper? = 2;

    // Business Licience
    date? = '';
}