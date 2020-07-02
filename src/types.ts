export interface SimpleAction {
	type: string;
}

export interface SimpleActionGenerator {
	(): SimpleAction;
}

export interface Action<Payload> extends SimpleAction {
	payload: Payload;
}

export interface ActionGenerator<Payload> {
	(payload: Payload): Action<Payload>;
}
