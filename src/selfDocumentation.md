# NES

- Why do command and query busses have and execute methods while the event bus has only a publish one

- Does it make sense to have a command and query bus?

- Should the message bus, the base class for all other busses, have a

## Message Bus

### Responsibilities

- Connect with transporter
- Subscribe handlers to transport
- Publish messages to the transport
- Listen for messages by the transporter
- Dispatch handler on subscription arrival

### Remarks

- Module Ref doc excerpt:
  To dynamically instantiate a class that wasn't previously registered as a provider, use the module reference's create() method.
  Example:

```typescript
async onModuleInit() {
  this.catsFactory = await this.moduleRef.create(CatsFactory);
}
```

This technique enables you to conditionally instantiate
different classes outside of the framework container.

- Plow calls the register method Subscribe and has a method called subscribe to topic

- Nest JS event bus bind implementation:

```typescript
const stream$ = name ? this.ofEventName(name) : this.subject$;
const subscription = stream$.subscribe((event) => handler.handle(event));
this.subscriptions.push(subscription);
```

## Message Store

### Responsibilities

The message store is responsible to persist events and return events by aggregate type

### Remarks

-

## Aggregate Root

### Responsibilities

### Remarks

-

## Repository

### Responsibilities

- Abstraction layer between read db and core layer

### Remarks
