import { IEvent } from "./event.interface";
import { Injectable, Type } from "@nestjs/common";

import {
	AggregateRoot,
	Identity,
	IRepository,
	NanoGuidIdentity,
} from "../domain/";
import { EventBus, IEventStore } from "./";

const debug = require("debug")("nes:events:repository");

@Injectable()
export abstract class EventStoreRepository<
	TAggregate extends AggregateRoot<TId>,
	TId extends Identity<any> = NanoGuidIdentity
> implements IRepository<TAggregate, TId>
{
	public constructor(
		protected aggregateClass: Type<TAggregate>,
		protected readonly storage: IEventStore,
		protected readonly eventBus: EventBus
	) {}

	public save(aggregate: TAggregate): Promise<IEvent[]> {
		return this.storage.save(aggregate).then((nextVersion) => {
			const events = aggregate.uncommittedChanges.slice();

			if (this.eventBus) {
				events.map((e) => this.eventBus.publish(e));
			}

			aggregate.markChangesAsCommitted();

			return events;
		});
	}

	public async getById(id: TId): Promise<TAggregate> {
		debug(`Getting aggregate of ${this.aggregateClass.name} with id ${id}`);

		const events = await this.storage.getEventsByAggregate(
			this.aggregateClass,
			id
		);
		if (events.length === 0) return null;

		return AggregateRoot.load<TAggregate>(this.aggregateClass, events);
	}
}
