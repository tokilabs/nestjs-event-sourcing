import { AggregateRoot, NanoGuidIdentity } from "../../domain";
import { EventStoreDB } from "./eventStoreDB";
import { createConnection, createJsonEventData } from "node-eventstore-client";

jest.mock("node-eventstore-client", () => {
	return {
		createJsonEventData: jest.fn().mockImplementation(() => {
			return {
				some: () => {
					console.log("hasdjlk");
				},
			};
		}),
	};
});
describe("EventStoreDB", () => {
	class SampleAggregateRoot extends AggregateRoot {
		constructor() {
			super(new NanoGuidIdentity());
			this.applyChange({ id: this.id });
		}
	}

	describe("save()", () => {
		it("should call private method saveEvents", async () => {
			const subject = new EventStoreDB();
			const spy = jest
				.spyOn(EventStoreDB.prototype as any, "saveEvents")
				.mockImplementation(async () => {
					return await [{ nextExpectedVersion: 1 }];
				});
			// jest
			// 	.spyOn(EventStoreDB.prototype as any, "connect")

			const result = await subject.save(new SampleAggregateRoot());
			expect(spy).toBeCalledTimes(1);
			expect(result).toEqual(1);
		});
	});
});
