import { IAggregateRoot } from "./domain/aggregateRoot";
import { IEvent } from "./eventSourcing";
import { CopyProps, CopyPropsToUnderscoreProp } from "./helpers";

/**
 * NestJS Event Sourcing configuration options
 *
 * @export
 * @interface INesConfig
 */
export interface INesConfig {
	/**
	 * The name of your application package
	 *
	 * This is used as default when FQNs don't specify a package
	 */
	appPackageName?: string;

	/**
	 * Options for messaging (Events and Commands)
	 */
	messaging: {
		/**
		 * Which transport to use for sending commands and publishing events
		 *
		 * @type {('rabbitmq' | 'inmemory')}
		 */
		transport: "rabbitmq" | "inmemory";
	};

	/**
	 * Whether or not Plow should require an explicit Apply method for each event
	 * the Aggregate Root is to handle
	 */
	requireApplyForEachEvent: boolean;

	defaultApplyFn(aggregate: IAggregateRoot<any>, event: IEvent): void;
}

const _config = {
	requireApplyForEachEvent: false,
	defaultApplyFn: CopyProps /* ToUnderscoreProp */,
};

const NES_CONFIG = Symbol.for("cashfarm.plow.config");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

const globalSymbols = Object.getOwnPropertySymbols(global);

if (!(globalSymbols.indexOf(NES_CONFIG) > -1)) {
	global[NES_CONFIG] = _config;
}

// define the singleton API
// ------------------------

const singleton: {
	instance: INesConfig;
} = <any>{};

Object.defineProperty(singleton, "instance", {
	get: () => {
		return global[NES_CONFIG];
	},
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

export const NesConfig = singleton.instance;
