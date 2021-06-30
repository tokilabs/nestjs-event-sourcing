import { ConcreteType } from "@tokilabs/lang";

import { Constants } from "../symbols";
import { NesConfig } from "../config";

/**
 * IDomain event symbol
 *
 * Should be used for binding domain events to inversion of control containers
 */
export const IDomainEvent = Symbol("IDomainEvent");

// tslint:disable-next-line:no-empty-interface
export interface IDomainEvent {}

/**
 * Registers the class as a Domain Event
 * @param name The name of the event
 */
export function DomainEvent(
	fqn: string,
	eventName?: string
): (target: ConcreteType<IDomainEvent>) => void {
	if (fqn.indexOf(":") < 0) {
		fqn = `${NesConfig.appPackageName}:${fqn}`;
	}
	return (target: ConcreteType<IDomainEvent>) => {
		Reflect.defineMetadata(Constants.EventFQN, fqn, target);

		if (eventName)
			Reflect.defineMetadata(Constants.EventName, eventName, target);
	};
}
