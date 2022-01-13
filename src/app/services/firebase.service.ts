import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import OrderByDirection = firebase.firestore.OrderByDirection;
import CollectionReference = firebase.firestore.CollectionReference;
import Query = firebase.firestore.Query;

@Injectable()
export class FeedBaseService {
    constructor(
    ) {
    }
    /**
     * Method used to used get all document in collection
     * @param collectionName: Name of collection want to get data
     * @return Promise<SnapshotChange>: List of document in collection
     */
    getAllDocument(collectionName) {
        return firebase.firestore().collection(collectionName).get();
    }

    getDocumentByRef(path) {
        return firebase.firestore().doc(path).get();
    }

    getCollectionByPath(path) {
        return firebase.firestore().collection(path).get();
    }

    getAllDocumentWithCondition(collectionName, fieldName, fieldValue, operator: WhereFilterOp = '==') {
        return firebase.firestore().collection(collectionName).where(fieldName, operator, fieldValue).get();
    }

    createDocumentAutoGenerateName(collectionName, data) {
        return firebase.firestore().collection(collectionName).add(data);
    }

}