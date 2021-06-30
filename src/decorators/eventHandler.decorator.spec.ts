import { IEvent } from "../eventSourcing";
import { Constants } from "../symbols";
import { EventHandler } from "./eventHandler.decorator";

describe("EventHandler", () => {
	it("should have the correct metadata", () => {
		class SampleEvent implements IEvent {}

		class SampleClass {
			public test: string = "JustATest";
		}

		const decorator = EventHandler(SampleEvent);
		decorator(SampleClass);

		expect(
			Reflect.hasMetadata(Constants.EventHandlerMetadata, SampleClass)
		).toBe(true);

		expect(
			Reflect.getMetadata(Constants.EventHandlerMetadata, SampleClass)[0]
		).toBe(SampleEvent);
	});
});
