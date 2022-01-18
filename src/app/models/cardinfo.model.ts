export class SearchInfo {
  constructor(
    public cardCode: string,
    public phoneNumber: string,
    public hardwareId: string
  ) { }
}

export class CardInfo {
  constructor(
    public id: number,
    public cardId: number,
    public fullName: string,
    public cardRole: number,
    public cardType: string,
    public hardwareId: string,
    public elevatorBank: string,
    public elevatorShaftNumber: string,
    public elevatorShaftName: string,
    public issueDate: string,
    public expireDate: string,
    public projectName: string,
    public buildName: string,
    public floorName: string,
    public cardNumber: string,
    public roleId: string,
    public roleName: string,
    public cardTypeName: string,
    public note: string,
    public projectCd: string,
    public buildCd: null,
    public floorNumber: null,
    public filter: string
  ) { }
}
export class TypeCard {
  constructor(

    public imageUrl: string,
    public cardTypeId: 0,
    public cardTypeName: string
  ) { }

  // tslint:disable-next-line:member-ordering
  static createDefault() {
    return new TypeCard('', 0, '');
  }
}

export class Project {
  constructor(

    public projectCd: string,
    public projectName: string
  ) { }

  // tslint:disable-next-line:member-ordering
  static createDefault() {
    return new Project('', '');
  }
}




