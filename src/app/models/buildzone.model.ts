export class BuildZone {
    constructor(

        public buildZoneName: string,
        public buildCd: string
      ) { }

    // tslint:disable-next-line:member-ordering
    static createDefault() {
        return new BuildZone('','');
    }
}


