export const Constants = {
	EventName: Symbol.for("@cashfarm/plow:Symbols.EventName"),
	EventFQN: Symbol.for("@cashfarm/plow:Symbols.EventFQN"),
	ProjectionEvents: Symbol.for("@cashfarm/plow:Symbols.ProjectionEvents"),

	// Config
	MessageTransporter: Symbol.for("MESSAGE_TRANSPORTER"),

	// CommandHandlers
	EventsDefinitionMetadata: Symbol.for("EVENT_DEFINITION"),
	EventHandlerMetadata: Symbol.for("EVENT_HANDLER"),
	ProjectionsHandlerMetadata: Symbol.for("PROJECTION_HANDLER"),
};

export const EventStore = Symbol.for("EVENT_STORE");
