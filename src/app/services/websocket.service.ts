import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService2 {
  constructor() {}
  myWebSocket: WebSocketSubject<any>;
  public messages$ : Observable<any>;

  public connect(url) {
    this.myWebSocket = webSocket({
      url,
      openObserver: {
        next: (val: any) => {
          console.log('opened');
        }
      },
      deserializer: ({data}) => data
    });
    this.messages$ = this.myWebSocket.asObservable();

  }

  public emit(eventName: string, data: any) {
    this.myWebSocket.next({[eventName]: data});
  }

  public send(data: any) {
    this.myWebSocket.next(data);
  }

  public closeConnection() {
    this.myWebSocket.unsubscribe();
  }
}