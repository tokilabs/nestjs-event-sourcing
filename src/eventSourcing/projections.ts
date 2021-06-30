// TOKI Todo Api DDD-ES-CQRS branch
/* 


import { inject, injectable } from "inversify";

import { Type } from "@nestjs/common";
import { Symbols } from "../symbols";

// Decorator
export function Projection(...events: Type<any>[]) {
	// TODO: Check if there is a method to handle each of the events and throw an error if none is found
	return (target: Type<any>) => {
		if (!target[Symbols.ProjectionEvents]) {
			container.bind(target).to(target);
			container.bind(Projections).to(target);
			target[Symbols.ProjectionEvents] = events;
		} else {
			events.map((e) => {
				if (target[Symbols.ProjectionEvents].indexOf(e) < 0)
					target[Symbols.ProjectionEvents].push(e);
			});
		}
	};
}

import { hydrate } from "@tokilabs/lang";

import * as events from "../domain/events";
import { TodoStore, TodoDto } from "../data/todoStore";
import { IEventBus } from "./interfaces";
import { Handle } from "../helpers";

const debug = require("debug")("todo:projections");

// This decorator will register the projection in the event bus

@injectable()
@Projection(events.TodoCreated)
export class TodoProjections {
	constructor(
		@inject(TodoStore) private todos: TodoStore,
		@inject(IEventBus) bus: IEventBus
	) {
		// bus.subscribe(events.TodoCreated, this);
	}

	public [Handle(events.TodoCreated)](event: events.TodoCreated): void {
		debug("Running projection for TodoCreated", event);

		const todo = new TodoDto();

		hydrate(todo, event);

		this.todos.save(todo);
	}
}
 */
