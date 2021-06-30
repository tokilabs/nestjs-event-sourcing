import { IMessageHandler } from "./../messaging/messageHandler.interface";
import { IEvent } from "./event.interface";

export interface IEventHandler<T extends IEvent = IEvent>
	extends IMessageHandler {}
