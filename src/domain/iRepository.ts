import { IEntity } from "./entity";
import { IAggregateRoot } from "./aggregateRoot";

export const IRepositoryOf = Symbol("IRepositoryOf");

export interface IRepositoryOf<TAggregate extends IEntity<TId>, TId> {
	getById(id: TId): Promise<TAggregate>;
	save(aggregate: TAggregate): void;
}

export const IRepository = Symbol("IRepository");

export interface IRepository<TAggregate extends IAggregateRoot, TId> {
	getById(id: TId): Promise<TAggregate>;
	save(aggregate: TAggregate): void;
}
