export class ElevatorFloor {
    constructor(
        public id : number,
        public projectCd : string,
        public projectName: string,
        public buildCd : string,
        public buildZone : string,
        public floorName: string,
        public floorType : string,
        public floorNumber : number,
        public sysDate? : Date,
      ) { }

    // tslint:disable-next-line:member-ordering
    static createDefault() {
        return new ElevatorFloor(0,'','','','','','',null, new Date());
    }
}


export class SetElevatorFloor {
    constructor(
        public id : number,
        public hardwareId : string,
        public floorNumber: string,
        public floorName : string,
        public elevatorBank : string,
        public elevatorShaftName: string,
        public elevatorShaftNumber : number,
        public projectCd : string,
        public buildZone : string,
        public isActived : boolean,
        public sysDate : Date,
      ) { }

    // tslint:disable-next-line:member-ordering
    static createDefault() {
        return new SetElevatorFloor(0,'','','','','',0,'', '', true, new Date());
    }
}



