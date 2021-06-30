import { IMessageBus } from "../messaging/messageBus.interface";
import { IEvent } from "./event.interface";

export interface IEventBus<EventBase extends IEvent = IEvent>
	extends IMessageBus<EventBase> {
	// publish<T extends EventBase>(event: T);
	// publishAll(events: EventBase[]);
}
