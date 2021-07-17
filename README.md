# NestJS Event Sourcing (NES)

Event sourcing module for NestJS

## How to use NES:

- In your AppModule or BootstrapModule, import the EventSourcingModule from `@tokilabs/nestjs-eventsourcing` and configure the module:

  - Parameters:

    - `appPackageName`: Your package name (The same as your package.json). This is used as default when FQNs don't specify a package

    - `appRoot`: The appRoot parameter is needed for FQN names. Fqn names are required by the aggregate root and eventStoreRepository for hydrating saved classes.

    - `transport?`: You can choose to use our provided transporter (we current only provide RabbitMQ as a transporter) or pass any class that implement the IMessageTransport interface. It will then be instantiated and passed to the EventBus. If empty it's assumed as `RabbitMQ`

    - `eventStore?`: You can choose to use our provided Event Store Client (we current only provide RabbitMQ as a transporter) or pass any class that implement the IEventStore interface. It will then be instantiated and passed to the EventStoreRepository. If empty it's assumed as `EventStoreDB`

    - `requireApplyForEachEvent?`: boolean. If true your Aggregate will have to explicitly implement a method that sets its own properties based on the given event. Assumed as `False`

    - `defaultApplyFn?`: If apply is not required for each event the defaultApplyFn is used to populate the Aggregate Root. It can be overridden if desired. The default implementation just copies the event props

```typescript
import { Module } from "@nestjs/common";
import { EventSourcingModule } from "@tokilabs/nestjs-eventsourcing";
import * as path from "path";

@Module({
	imports: [
		EventSourcingModule.register({
			appPackageName: "nes-todo-api",

			appRoot: path.resolve(__dirname),
		}),
	],
})
export class BootstrapModule {}
```

- Extend the AggregateRoot class and implement methods for each event of your aggregate.

```typescript
class Todo extends AggregateRoot {
	constructor(private readonly title: string) {
		super();
	}
	updateTitle(title: string) {
		this.apply(new updateTitleEvent(title));
	}
}
```

- Create a EventRepository for your Aggregate:

```typescript
import { Inject, Injectable } from "@nestjs/common";
import {
	EventBus,
	EventStoreRepository,
	EventStore,
	IEventStore,
} from "@tokilabs/nestjs-eventsourcing/";

import { Todo } from "../todo.entity";

@Injectable()
export class TodoEventStoreRepository extends EventStoreRepository<Todo> {
	constructor(
		@Inject(EventStore) protected storage: IEventStore,
		protected readonly eventBus: EventBus
	) {
		super(Todo, storage, eventBus);
	}
}
```

- Events Definitions:
  - To create a event first create a class that implements the `IEvent` and decorate it with `@DomainEvent()`, passing as a argument to the decorator the class FQN
  - The syntax for a FQN is as follows: `PackageName:NameSpace(Optional).Class`. As we already set the PackageName while bootstrapping we can safely omit it now.

```typescript
// src/todo/events/definition/todoDescriptionUpdated.event.ts
import {
	IDomainEvent,
	NanoGuidIdentity,
	DomainEvent,
} from "@tokilabs/nestjs-eventsourcing/";

@DomainEvent("todo.events.DescriptionUpdatedEvent")
export class DescriptionUpdatedEvent implements IEvent {
	constructor(
		public readonly id: NanoGuidIdentity,
		public readonly description: string
	) {}
}
```

- FQN: is used to require the event class when getting it from the EventStore. In order to have it available to us at runtime the event definition must be exported using ES5 module.exports

```typescript
// src/todo/events/index.ts
export * from "./definition";
```

```typescript
// src/todo/index.ts
import * as events from "./events";

module.exports = { events };
```

```typescript
// src/index.ts
import * as todo from "./todo";

module.exports = { todo };
```

- Events Handlers:

Similar to event definitions, to create a event handler you must create a class that implements the correct interface. In this case it must implement `IEventHandler` which requires the generic types of the handled class. Then decorate it as a EventHandler passing as a argument the event to be handled!.
Analogous to the `@nest/cqrs` module, the event handler class must implement a handle event.

```typescript
import { EventHandler, IEventHandler } from "@tokilabs/nestjs-eventsourcing";
import { DescriptionUpdatedEvent } from "./../definition/";

@EventHandler(DescriptionUpdatedEvent)
export class TodoDescriptionUpdatedHandler
	implements IEventHandler<DescriptionUpdatedEvent>
{
	handle(event: DescriptionUpdatedEvent) {
		console.log("Todo Description Updated Event", event);
		return null;
	}
}
```

- Projections

Projections in NES are handled just like event handlers.

```typescript
import {
	ProjectionHandler,
	IEventHandler,
} from "@tokilabs/nestjs-eventsourcing";

import { TodoCreatedEvent } from "../../events/definition";

@ProjectionHandler(TodoCreatedEvent)
export class TodoWasCreatedProjection
	implements IEventHandler<TodoCreatedEvent>
{
	async handle(event: TodoCreatedEvent) {
		console.log("Event Projection Handled", event);
		return null;
	}
}
```

## Example:

You can find the full example used in the Nes-Todo-Api repository

## Changelog

v 0.0.4:

- Fixes incomplete Aggregate root generic typing in EventStoreRepository

v 0.0.3:

- Adds missing type declaration

v 0.0.2:

- Fixes event handler decorator

v 0.0.1:

- Initial Version

## What does the future holds for NES?

For the version 1.0.0 of NES, I would like to:

- Provide a higher test coverage
- Provide other EventStore options such as Redis and MongoDB
- Provide other Transport options such as RxJS, MQTT...
