import { DomainEvent } from "./domainEvent.decorator";

describe("DomainEvent Decorator", () => {
	describe("When FQN is specified", () => {
		it("should Store FQN and Event name for later use", () => {
			// Call DomainEvent as function and pass another function as argument
			const decorate = DomainEvent("domain.test.sample", "EvtName");
		});
	});
});
