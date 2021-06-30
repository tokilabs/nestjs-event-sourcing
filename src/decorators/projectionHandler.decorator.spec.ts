import { ProjectionHandler } from ".";
import { IEvent } from "../eventSourcing";
import { Constants } from "../symbols";

describe("ProjectionHandler", () => {
	it("should have the correct metadata", () => {
		class SampleEvent implements IEvent {}

		class SampleClass {
			public test: string = "JustATest";
		}

		const decorator = ProjectionHandler(SampleEvent);
		decorator(SampleClass);

		expect(
			Reflect.hasMetadata(Constants.ProjectionsHandlerMetadata, SampleClass)
		).toBe(true);

		expect(
			Reflect.getMetadata(Constants.ProjectionsHandlerMetadata, SampleClass)[0]
		).toBe(SampleEvent);
	});
});
