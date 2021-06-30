import { ValueObject } from "./valueObject";

class TestVO extends ValueObject<TestVO> {
	public readonly name: string;
	public readonly value: number;

	constructor(name: string, value: number) {
		super(TestVO, ["name", "value"]);
	}

	public setName(name: string) {
		return this.newInstanceWith({ name });
	}

	public setValue(value: number) {
		return this.newInstanceWith({ value });
	}
}

describe("ValueObject", () => {
	test("Updating a ValueObject property should return a new, modified, instance.", () => {
		const tvo = new TestVO("Some Name", 1);

		expect(tvo.setName("Another name")).not.toBe(tvo);
	});

	test("When updating a property other properties stay the same", () => {
		const tvo = new TestVO("Some Name", 1);
		const tvoNewName = new TestVO("Another Name", 1);
		const tvoNewVal = new TestVO("Some Name", 2);

		expect(tvo.setName("Another Name")).toEqual(tvoNewName);

		expect(tvo.setValue(2)).toEqual(tvoNewVal);

		expect(tvo).toEqual(new TestVO("Some Name", 1));
	});
});
