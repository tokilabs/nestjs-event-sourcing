import { IEvent } from "../eventSourcing";

export type IHandlerFunction = (type: string, evt: IEvent) => void;
