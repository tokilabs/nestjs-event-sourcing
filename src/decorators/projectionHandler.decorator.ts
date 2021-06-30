import { IEvent, Constants } from "../index";

/**
 * Decorator that marks a class as a projection handler. A projection handler
 * handles commands (actions) executed by your application code.
 *
 * The decorated class must implement the `IProjectionHandler` interface.
 *
 * @param event projection *type* to be handled by this handler.
 *
 * @see https://docs.nestjs.com/recipes/cqrs#commands
 */
export const ProjectionHandler = (...event: IEvent[]): ClassDecorator => {
	return (target: object) => {
		Reflect.defineMetadata(Constants.ProjectionsHandlerMetadata, event, target);
	};
};
