import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService2 {
  constructor() {}
  myWebSocket: WebSocketSubject<any>;

  public connect(url) {
    this.myWebSocket = webSocket({
      url,
      deserializer: ({data}) => data
    });
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