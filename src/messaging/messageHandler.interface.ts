import { IMessage } from "./";
import { IMessageResponse } from "./messageResponse.interface";

export interface IMessageHandler<
	MessageType extends IMessage = IMessage,
	ResponseType extends IMessageResponse = IMessageResponse
> {
	handle(message: MessageType): Promise<ResponseType | null>;
}
