const ConstructorParams = Symbol.for(
	"nestjs-eventsourcing:ValueObject.ConstructorParams"
);
const Constructor = Symbol.for("nestjs-eventsourcing:ValueObject.Constructor");

/**
 * Base class for implementing Value Objects
 *
 * Value Object is a Domain Driven Design concept for an object
 * whose identity is determined by it's properties values.
 *
 * Value objects MUST:
 * - Be immutable
 * - Be compared by value-equality
 *
 * @export
 * @class ValueObject
 */
export class ValueObject<TObject> {
	/**
	 * @param construct Your value object's constructor
	 * @param constructParams Name of the properties to pass to constructor IN ORDER
	 */
	constructor(
		private construct: new (...args: any[]) => TObject,
		constructParams: (keyof TObject)[]
	) {
		this[Constructor] = construct;
		this[ConstructorParams] = constructParams;
	}

	public equals(other: ValueObject<TObject>): boolean {
		return !Object.keys(this).some((prop) => {
			// return true if prop is different
			if (typeof this[prop].equals === "function") {
				return !this[prop].equals(other[prop]);
			}

			return this[prop] !== other[prop];
		});
	}

	protected newInstanceWith(updatedProps: Partial<TObject>): TObject {
		return new this[Constructor](
			...(<any[]>this[ConstructorParams]).map((p) =>
				updatedProps.hasOwnProperty(p) ? updatedProps[p] : (<any>this)[p]
			)
		);
	}
}
