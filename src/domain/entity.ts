import { Guid, Expose, NanoGuid } from "@tokilabs/lang";

import { Identity } from "./identity";

export const IEntity = Symbol("IEntity");
export interface IEntity<TId> {
	readonly id: TId;
}

/**
 * Abstract Base Class for Entities
 *
 * @export
 * @abstract
 * @class Entity
 * @extends {IEntity<TId>}
 * @template TId The type of this entities identity.
 */
export abstract class Entity<TId extends Identity<Guid | NanoGuid>>
	implements IEntity<TId>
{
	@Expose({ name: "id" })
	private _id: TId;

	/**
	 * Persistent identity value for the Entity
	 *
	 * @readonly
	 * @type {TId}
	 */
	public get id(): TId {
		return this._id;
	}
	protected set id(value: TId) {
		this._id = value;
	}

	constructor(id?: TId) {
		this._id = id;
	}
}
