import { JSON } from ".";


@json
class Person {
  id: string | null = null;
  firstName: string = "";
  lastName: string = "";
}


@json
class PeopleData {
  people: Person[] = [];
}


@json
export class Response<T> {
  // errors: ErrorResult[] | null = null;
  data: T | null = null;
  // extensions: Map<string, ???> | null = null;
}

console.log((isManaged<PeopleData>() || isReference<PeopleData>()).toString());

// const serialized = JSON.stringify(new Response<PeopleData>());
// console.log("Serialized Node: " + serialized);

let deserialized = JSON.parse<Response<PeopleData>>('{"data":{"people":[]}}');
console.log("Deserialized Node: " + JSON.stringify(deserialized));

// const deserialized2 = JSON.parse<Response<i32>>('{"data":0}');
// console.log("Deserialized Node: " + JSON.stringify(deserialized2));
// {"data":{"people":[]}}
