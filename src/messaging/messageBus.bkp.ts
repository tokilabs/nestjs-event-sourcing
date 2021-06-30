import { Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { Constants } from "../symbols";
import {
	IMessage,
	IMessageBus,
	IMessageTransport,
	IHandlerFunction,
	IMessageHandler,
	MessageHandlerType,
} from ".";
import { plainToClass } from "class-transformer";
import { Handle } from "../helpers";

const debug = require("debug")("nes:messageBus");

/* 
	Need to get Nest Module ref so when it publishes a event it notifies all listeners
	The message bus needs to have a reference to the module so that it can get the reference 
	to the decorated handlers enabling then inversion of control 

	Opposed to NestJS, the responsibility of publishing the event was assigned to
	bus itself
*/
@Injectable()
export class MessageBus<MessageType> implements IMessageBus<MessageType> {
	private readonly moduleRef: ModuleRef;
	private readonly serviceName: string;
	public readonly transport: IMessageTransport;
	private handlers: any;

	constructor(
		serviceName: string,
		transport: IMessageTransport,
		moduleRef: ModuleRef
	) {
		this.moduleRef = moduleRef;
		this.serviceName = serviceName;
		this.transport = transport;
	}

	public subscribeToTopic(topic: string, handler: IHandlerFunction) {
		debug(
			`Registering handler for ${topic}:`,
			handler.constructor ? handler.constructor.name : handler.toString()
		);

		this.transport.subscribe(topic, (message: any) =>
			handler(message.type, message.data)
		);
	}

	register(handlers: MessageHandlerType[]) {
		// IMPLEMENT ME SENPAI!!
	}

	public subscribe(evtClass: IMessage & Type<{}>, handler: Object) {
		const evtName = evtClass.name;

		debug(
			`Registering handler for ${evtName}:`,
			handler.constructor ? handler.constructor.name : handler.toString()
		);

		if (typeof handler[Handle(evtClass)] !== "function") {
			throw new Error(
				`Can't subscribe ${handler.constructor.name} to ${evtClass.name} ` +
					`because it has not defined a method \`public [Handle(${evtClass.name})](evt: ${evtClass.name})`
			);
		}

		this.transport.subscribe(
			`${this.serviceName}.${evtName}`,
			(/* name: string,  */ event: any) => {
				console.log(plainToClass(evtClass, event.content.data));
				handler[Handle(evtClass)].apply(handler, [
					plainToClass(evtClass, event.content.data),
				]);
			}
		);
	}

	private registerHandler() {
		// IMPLEMENT ME SENPAI!!
		/* 
		const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const eventsNames = this.reflectEventsNames(handler);
    eventsNames.map((event) =>
      this.bind(instance as IEventHandler<EventBase>, event.name),
    );
		*/
	}

	async publish<T extends MessageType>(command: T): Promise<any> {
		await "IMPLEMENT ME SENPAI!!";
	}

	bind<T extends MessageType>(handler: IMessageHandler<T>, name: string) {
		this.handlers.set(name, handler);
	}

	// public publish(message: IMessage) {
	// 	const evtName = this.getMessageName(message);
	// 	debug(`Publishing event ${evtName}`);

	// 	this.transport.publish(`${this.serviceName}.${evtName}`, message);
	// }

	private getMessageName(message: IMessage) {
		// NestJs types this as "command: Function"
		return (
			Reflect.getMetadata(Constants.EventName, message.constructor) ||
			message.constructor.name
		);
	}

	onModuleDestroy() {
		// TODO: Unsubscribe
		// Subscriptions references are stored on moduleRef
		// this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}

	public unsubscribe(evtClass: IMessage & Type<{}>, handler: any) {
		throw new Error("Not implemented");
	}
}
