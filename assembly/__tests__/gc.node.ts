import { JSON } from "..";

const ev = `{"id":"d0a89skks8od8t4n6i3g","type":"pose","char":{"id":"c0n144ot874c2tqpubpg","name":"Accipiter","surname":"Nisus"},"sig":"E6uJ9MDxKuYAi81o"}`

@json
class Char {
	id: string = "";
	name: string = "";
	surname: string = "";
}

@json
class Event {
	id: string = "";
	type: string = "";
	sig: string = "";
	char: Char = new Char();
}

export function parseEvent(): void {
	JSON.parse<Event>(ev);
}
