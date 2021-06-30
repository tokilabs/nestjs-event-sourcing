import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import {
	IMessageBus,
	IMessageTransport,
	IMessageHandler,
	MessageHandlerType,
} from "./";

const debug = require("debug")("nes:messageBus");

/**
 * The Message bus is mainly responsible for two things:
 *
 * 1 - Register and manage handlers
 *
 * 2 - Publish messages to transporter (E.G: RabbitMQ)
 */
@Injectable()
export class MessageBus<MessageType> implements IMessageBus<MessageType> {
	private readonly serviceName: string; // The service name is the reference used by the transporter
	public readonly transport: IMessageTransport;
	private handlers = new Map<string, IMessageHandler<MessageType>>();

	constructor(
		serviceName: string,
		transport: IMessageTransport,
		private readonly moduleRef: ModuleRef
	) {
		this.serviceName = serviceName;
		this.transport = transport;
	}

	async publish<T extends MessageType>(message: T): Promise<any> {
		const evtName = this.getMessageName(message);
		debug(`Publishing event ${evtName}`);

		this.transport.publish(`${this.serviceName}.${evtName}`, message);
	}

	/**
	 * This method is serves as the entry point of the handlers to the bus
	 *
	 * Register handler of message Type to message bus.
	 * @param handlers
	 */
	register(handlers: MessageHandlerType[], metadata: Symbol): void {
		handlers.forEach((handler) => this.registerHandler(handler, metadata));
		// TODO: Understand the need to make the register handler protected
	}

	/**
	 * This method is used by the register to link a SINGLE handlers
	 * to the bus
	 *
	 * Register handler of message Type to message bus.
	 * @param handlers
	 */
	private registerHandler(handler: MessageHandlerType, metadata: Symbol): void {
		// Checking if there is any reference of this handler in the core module,
		// this is needed for IOC
		const instanceOfHandler = this.moduleRef.get(handler, { strict: false });
		if (!instanceOfHandler) return;

		// Check metadata for handled event name
		const eventNames: FunctionConstructor[] = Reflect.getMetadata(
			metadata,
			handler
		);
		if (!eventNames) {
			throw new Error("Invalid Command Handler");
		}

		eventNames.forEach((event) => {
			this.transport.subscribe(`${this.serviceName}.${event.name}`, (event) =>
				instanceOfHandler.handle(event)
			);
		});
	}

	/**
	 * Used by execute method to find the correct message handler
	 * @param message
	 * @returns
	 */
	private getMessageName(message: MessageType): string {
		// TODO: Check if getMessageName method is correct
		const { constructor } = Object.getPrototypeOf(message);
		return constructor.name as string;
	}
}
