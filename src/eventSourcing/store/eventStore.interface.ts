import { Guid, NanoGuid, Type } from "@tokilabs/lang";

import { AggregateRoot, Identity } from "../../domain";
import { EventEnvelope, IEvent } from "..";

export const IEventStore = Symbol("IEventStore");
export interface IEventStore {
	/**
	 * Returns the next expected version
	 *
	 * @param {AggregateRoot<any>} aggregate
	 * @returns {Promise<number>}
	 * @memberof IEventStore
	 */
	save(aggregate: AggregateRoot<any>): Promise<number>;
	getEventsByAggregate(
		aggregateType: Type,
		aggregateId: Identity<Guid | NanoGuid> | Guid | NanoGuid
	): Promise<EventEnvelope[]>;
}
