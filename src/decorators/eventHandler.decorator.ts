import { IEvent, Constants } from "../index";

/**
 * Decorator that marks a class as a Nest event handler. An event handler
 * handles events executed by your application code.
 *
 * The decorated class must implement the `IEventHandler` interface.
 *
 * @param events one or more event *types* to be handled by this handler.
 *
 * @see https://docs.nestjs.com/recipes/cqrs#events
 */
export const EventHandler(...events: IEvent[]): ClassDecorator {
	return (target: object) => {
		Reflect.defineMetadata(Constants.EventHandlerMetadata, events, target);
	};
}
