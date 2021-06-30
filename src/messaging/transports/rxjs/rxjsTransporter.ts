import { IMessageTransport } from "./../iMessageTransport";
export class RxJSTransporter implements IMessageTransport {
	listen(topic: string, handler: (msg: any) => void): void {}

	send(topic: string, message: any): void {}

	subscribe(topic: string, handler: (type: string, msg: any) => void): void {}

	publish(topic: string, message: any): void {}
}
