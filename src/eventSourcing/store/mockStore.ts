import { Injectable } from "@nestjs/common";
import { EventEnvelope } from "../eventEnvelope";
import { IEventStore } from "./eventStore.interface";

@Injectable()
export class MockStore implements IEventStore {
	public async save(aggregate): Promise<number> {
		return aggregate.version + 1;
	}

	public async getEventsByAggregate(aggregateType, aggregateId) {
		console.log("aggregateType:", aggregateType);
		console.log("aggregateId:", aggregateId);
		return EventEnvelope[1];
	}

	register(): void {}
}
