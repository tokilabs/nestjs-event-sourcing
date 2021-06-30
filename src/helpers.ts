import { Type } from "@nestjs/common";
import { IAggregateRoot } from "./domain/aggregateRoot";
import { IEvent } from "./eventSourcing";

/**
 * Returns a symbol used to created methods that handle events
 *
 * @export
 * @param {(DomainEvent & Type)} e
 * @returns {symbol}
 */
export function Handle(e: IEvent & Type): symbol {
	return Symbol.for(e.prototype.constructor.name);
}

/**
 * Returns a symbol used to created methods that apply events to aggregates
 *
 * @export
 * @param {(DomainEvent & Type)} e
 * @returns {symbol}
 */
export function Apply(e: IEvent & Type): symbol {
	return Symbol.for(e.prototype.constructor.name);
}

/**
 * Copies all string-indexed properties except `id` mapping prop `a` to `_a`
 *
 * This function DOES NOT copy properties whose name is a Symbol
 *
 * @param aggregate The aggregate root
 * @param event The event
 */
export function CopyPropsToUnderscoreProp(
	aggregate: IAggregateRoot<any>,
	event: IEvent
): void {
	Reflect.ownKeys(event).forEach((k) => {
		if (typeof k === "symbol") {
			return;
		}
		aggregate[`_${k}`] = event[k];
	});
}

/**
 * Copies all string-indexed properties except `id`
 *
 * This function DOES NOT copy properties whose name is a Symbol
 *
 * @param aggregate The aggregate root
 * @param event The event
 */
export function CopyProps(aggregate: IAggregateRoot<any>, event: IEvent): void {
	Reflect.ownKeys(event).forEach((k) => {
		if (typeof k === "symbol") {
			return;
		}
		aggregate[k] = event[k];
	});
}
