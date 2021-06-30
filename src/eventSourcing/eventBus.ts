import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { IMessageTransport, MessageBus } from "../messaging";
import { Constants } from "../symbols";
import { IEvent, IEventBus } from ".";

@Injectable()
export class EventBus extends MessageBus<IEvent> implements IEventBus {
	constructor(
		@Inject(Constants.MessageTransporter) transport: IMessageTransport,
		moduleRef: ModuleRef
	) {
		super("EventBus", transport, moduleRef);
	}
}
