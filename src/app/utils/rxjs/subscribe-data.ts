import { BehaviorSubject } from "rxjs";

const dataSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('promotionTypes')));
export const PromotionType = {
  get getPromotionTypes() {return dataSubject.value},
  addToRxStore,
  removeFromRxStore,
  currentPromotionTypes: dataSubject.asObservable(),
}

function addToRxStore(data) {
  sessionStorage.setItem('promotionTypes', JSON.stringify(data));
  return dataSubject.next(data);
}

function removeFromRxStore() {
  sessionStorage.removeItem('promotionTypes');
  return dataSubject.next(null);
}
