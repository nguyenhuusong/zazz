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


export class EmployeeCardList {
  constructor(
  public cardId: 0,
  public cardCd: string,
  public fullName: string,
  public  phone: string,
  public  email: string,
  public  position: string,
  public   status: 0,
  public  statusName: string,
  public  isClose: boolean,
  public  closeDate: string,
  public  isVihecle: boolean,
  public  departmentName: string
  ) {}

  static createDefault() {
      return new EmployeeCardList(0, '', '', '', '', '', 0, '', false, '', false, '');
  }


}



export class Vehicle {
  constructor(

      public assignDate: string,
      public vehicleTypeName: string,
      public serviceName: string,
      public  statusName: string,
      public isLock: boolean,
      public cardVehicleId: 0,
      public  cardCd: string,
      public  vehicleTypeId: 0,
      public vehicleNo: string,
      public  vehicleName: string,
      public  isVehicleNone: boolean,
      public  serviceId: 0,
      public  startTime: string,
      public  endTime: string,
      public  status: 0,
      public   reason: string,
      public  cardName: string,
      public  fullName: string,
      public   departmentName: string,
      public   cardImage: string
    ) { }

  // tslint:disable-next-line:member-ordering
  static createDefault() {
      return new Vehicle('', '', '', '', false, 0, '', 0, '', '', false, 0, '', '', 0, '', '', '', '', '' );
  }
}


export class VehicleType {
  constructor(

      public vehicleTypeId: string,
      public vehicleTypeName: string
    ) { }

  // tslint:disable-next-line:member-ordering
  static createDefault() {
      return new VehicleType('', '');
  }
}














