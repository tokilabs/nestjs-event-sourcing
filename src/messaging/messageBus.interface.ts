import { Type } from "@nestjs/common";

import { IMessage, IMessageHandler, IMessageTransport } from "./";

// export const IEventBus = Symbol.for("cashfarm.plow.IEventBus");
export type MessageHandlerType<MessageBase extends IMessage = IMessage> = Type<
	IMessageHandler<MessageBase>
>;

export interface IMessageBus<MessageType> {
	transport: IMessageTransport;
	publish<T extends MessageType>(message: T): Promise<any>;
	register(handlers: MessageHandlerType[], constant: Symbol): void;
}
