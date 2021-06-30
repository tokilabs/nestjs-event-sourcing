import { Injectable, Type } from "@nestjs/common";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { Module } from "@nestjs/core/injector/module";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";

import { IEventHandler, IEvent } from "../eventSourcing";

import { Constants } from "../symbols";

interface EventSourcingOptions {
	eventHandlers?: Type<IEventHandler>[];
	projections?: Type<IEventHandler>[];
}
@Injectable()
export class ExplorerService<EventBase extends IEvent = IEvent> {
	constructor(private readonly modulesContainer: ModulesContainer) {}

	explore(): EventSourcingOptions {
		const modules = [...this.modulesContainer.values()];

		const eventHandlers = this.flatMap<IEventHandler<EventBase>>(
			modules,
			(instance) =>
				this.filterProvider(instance, Constants.EventHandlerMetadata)
		);

		const projections = this.flatMap<IEventHandler<EventBase>>(
			modules,
			(instance) =>
				this.filterProvider(instance, Constants.ProjectionsHandlerMetadata)
		);

		return { eventHandlers, projections };
	}

	flatMap<T>(
		modules: Module[],
		callback: (instance: InstanceWrapper) => Type<any> | undefined
	): Type<T>[] {
		const items = modules
			.map((module) => [...module.providers.values()].map(callback))
			.reduce((a, b) => a.concat(b), []);
		return items.filter((element) => !!element) as Type<T>[];
	}

	filterProvider(
		wrapper: InstanceWrapper,
		metadataKey: Symbol
	): Type<any> | undefined {
		const { instance } = wrapper;
		if (!instance) {
			return undefined;
		}
		return this.extractMetadata(instance, metadataKey);
	}

	extractMetadata(
		instance: Record<string, any>,
		metadataKey: Symbol
	): Type<any> {
		if (!instance.constructor) {
			return;
		}
		const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
		return metadata ? (instance.constructor as Type<any>) : undefined;
	}
}
