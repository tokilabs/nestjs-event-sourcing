import { ConcreteType, requireByFQN } from "@tokilabs/lang";
import { Exclude, plainToClass } from "class-transformer";

import { Constants } from "../symbols";
import { NesConfig } from "../config";
import { Identity, IIdentity, NanoGuidIdentity } from "./identity";
import { Apply } from "../helpers";
import { EventEnvelope, IEvent } from "../eventSourcing";
import { Entity } from "./entity";

const APPLY_CHANGE = Symbol("@cashfarm/plow:ESAggregate.APPLY_CHANGE");
const LOAD_FROM_EVENTS = Symbol("@cashfarm/plow:ESAggregate.LOAD_FROM_EVENTS");

export interface IAggregateRoot<TId extends IIdentity<any> = NanoGuidIdentity> {
	readonly id: TId;
	readonly version: number;
	readonly uncommittedChanges: IEvent[];
	markChangesAsCommitted(): void;
}

/**
 * Base implementation for an event sourced aggregate root.
 *
 * Extend this class and implement `[Apply(EvtClass)]()` methods for
 * each event of your aggregate.
 *
 * You can optionally set the config option `requireApplyForEachEvent` to false,
 * define a `defaultApplyFn` also in NES config and have your events automatically applied
 */
export class AggregateRoot<TId extends Identity<any> = NanoGuidIdentity>
	extends Entity<TId>
	implements IAggregateRoot<TId>
{
	// readonly id: TId;

	// TODO: Aggregate root must receive a reference to the Event Bus

	@Exclude()
	protected _events: IEvent[] = [];

	@Exclude()
	private _version: number = -1;

	public static load<T extends AggregateRoot<any>>(
		constructor: ConcreteType<T>,
		events: EventEnvelope[]
	): T {
		if (!events || events.length === 0) {
			throw new Error(
				`The events parameter must be an array with at least 1 event.\n
				${constructor.name}.create() received ${events}`
			);
		}

		const t = Object.create(constructor.prototype);

		t._version = -1;
		t._events = [];

		const mappedEvents = events.map((ee) => {
			// Get the event class
			const klass = requireByFQN(ee.eventType);

			// deserialize to a class instance
			return plainToClass(klass, ee.event);
		});

		t[LOAD_FROM_EVENTS](mappedEvents);

		return t;
	}

	get version(): number {
		return this._version;
	}

	get uncommittedChanges(): IEvent[] {
		return this._events;
	}

	public markChangesAsCommitted() {
		this._version += this._events.length;
		this._events.length = 0;
	}

	protected applyChange(event: IEvent) {
		this[APPLY_CHANGE](event, true);
	}

	/**
	 * Hidden method to apply an event
	 *
	 * @private
	 * @param {IEvent} event The event to be applied
	 * @param {boolean} isNew Whether the event is new or not
	 * @memberof ESAggregateRoot
	 */
	private [APPLY_CHANGE](event: IEvent, isNew: boolean) {
		if (!event) {
			throw new Error(
				"Error applying event to Aggregate Root. The event is null or undefined"
			);
		}

		const eventClass = Object.getPrototypeOf(event).constructor;

		if (!eventClass) {
			throw new Error(
				`Error applying event to Aggregate Root. The event to be applied has no constructor. Here's what we got: ${JSON.stringify(
					event,
					null,
					2
				)}`
			);
		}

		const evtName =
			Reflect.getMetadata(Constants.EventName, eventClass) || eventClass.name;

		let applyMethod = Apply(eventClass);

		if (this[applyMethod] instanceof Function) {
			this[applyMethod](event);
		} else {
			if (NesConfig.requireApplyForEachEvent) {
				const actualImpl =
					this[applyMethod] instanceof Function
						? `The aggregate ${
								this.constructor.name
						  } property [Apply(${evtName})] is a ${typeof this[applyMethod]}`
						: `The Aggregate ${this.constructor.name} has no apply method for ${evtName}`;

				throw new Error(
					`For each event, an aggregate MUST implement an apply method called either apply${evtName}
					or using a symbol generated by the Apply function, e.g. protected [Apply(${evtName})](evt: ${evtName}): void {}.
					
					${actualImpl}`
				);
			}

			NesConfig.defaultApplyFn(this, event);
		}

		if (isNew) {
			this._events.push(event);
		}
	}

	/**
	 * Hidden method to load an aggregate from it's events
	 *
	 * @private
	 * @param {IEvent[]} history The list of events to load
	 * @memberof ESAggregateRoot
	 */
	private [LOAD_FROM_EVENTS](history: IEvent[]) {
		history.forEach((event) => this[APPLY_CHANGE](event, false));
		this._version = history.length - 1;
	}
}
