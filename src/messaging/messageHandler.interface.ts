import { IMessage, IMessageResponse } from "./message";

export interface IMessageHandler<
	MessageType extends IMessage = IMessage,
	ResponseType extends IMessageResponse = IMessageResponse
> {
	handle(message: MessageType): Promise<ResponseType | null>;
}
