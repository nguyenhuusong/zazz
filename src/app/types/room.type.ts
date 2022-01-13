export interface Room {
  roomCd: string;
  roomCode: string;
  floorNo: string;
  statusId: number;
  statusName: string;
  useLandAMT: number;
  typeName: string;
  styleName: string;
  lookOutName: string;
  mainDoorName: string;
  kitchenName: string;
  balconyName: string;
  positionName: string;
  projectName: string;
  buildingName: string;
  mapName: string;
  categoryCd: string;
  categoryCode: string;
  intOrder: number;
  typeId: number;
  styleId: number;
  lookOutId: number;
  mainDoorId: number;
  kitchenId: number;
  balconyId: number;
  positionId: number;
  wallArea: number;
  waterwayArea: number;
  categoryName: string;
  imgMapUrl: string;
  imgIncenseUrl: string;
  projectCd: string;
  buildingCd: string;
  roadId: number;
  buildingMapId: number;
  restRoom: number;
  categoryImages: CategoryImage[];
}

export interface CategoryImage {
  categoryImageId: number;
  categoryCd: string;
  imageType: number;
  imageUrl: string;
  note: string;
}
