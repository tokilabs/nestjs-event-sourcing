import {
	DynamicModule,
	Inject,
	Module,
	OnApplicationBootstrap,
	Type,
} from "@nestjs/common";
import { FQN } from "@tokilabs/lang";
import * as path from "path";

import { ExplorerService } from "./services/explorer.service";
import {
	IEvent,
	IEventStore,
	EventStoreDB,
	EventBus,
	MockStore,
} from "./eventSourcing";
import {
	IMessageTransport,
	RabbitMQTransport,
	MockTransport,
} from "./messaging";
import { Constants, EventStore } from "./symbols";
import { NesConfig } from "./config";

interface RegisterOptions {
	/**
	 * This MUST be an absolute path
	 */
	appRoot: string;
	appPackageName: string;
	/**
	 * By default the RabbitMq transport is used
	 */
	transport?: "RabbitMq" | "Mock" | Type<IMessageTransport>;
	/**
	 * By default the EventStoreDB transport is used
	 */
	eventStore?: "EventStoreDB" | "Mock" | Type<IEventStore>;
}

@Module({})
export class EventSourcingModule<EventBase extends IEvent = IEvent>
	implements OnApplicationBootstrap
{
	constructor(
		private readonly explorerService: ExplorerService<EventBase>,
		private readonly eventsBus: EventBus,
		@Inject(EventStore) private readonly eventStore: IEventStore
	) {}

	onApplicationBootstrap() {
		const { eventHandlers, projections } = this.explorerService.explore();
		this.eventsBus.register(eventHandlers, Constants.EventHandlerMetadata);
		this.eventsBus.register(projections, Constants.ProjectionsHandlerMetadata);
	}

	static register(options: RegisterOptions): DynamicModule {
		if (!path.isAbsolute(options.appRoot)) {
			new Error("Your appRoot MUST be an absolute path");
		}

		NesConfig.appPackageName = options.appPackageName;

		if (!options.transport) {
			options.transport = "RabbitMq";
		}

		if (!options.eventStore) {
			options.eventStore = "EventStoreDB";
		}

		FQN.registerPackagePath(options.appPackageName, options.appRoot);

		return {
			module: EventSourcingModule,
			providers: [
				{
					provide: Constants.MessageTransporter,
					useFactory: () => {
						switch (options.transport) {
							case "RabbitMq": {
								return new RabbitMQTransport();
							}
							case "Mock": {
								return new MockTransport();
							}
							default:
								return new options.transport();
						}
					},
				},

				{
					provide: EventStore,
					useFactory: () => {
						switch (options.eventStore) {
							case "EventStoreDB": {
								return new EventStoreDB();
							}
							case "Mock": {
								return new MockStore();
							}
							default:
								return new options.eventStore();
						}
					},
				},
				ExplorerService,
				EventBus,
			],
			exports: [EventBus, EventStore],
			global: true,
		};
	}
}
