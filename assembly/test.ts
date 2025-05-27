import { JSON } from ".";
import { expect, it } from "./__tests__/lib";
import { bytes } from "./util";

// @json
// class Obj {
//   public a: string = "hello";
//   public b: string = "world";
//   public c: string = '"\t\f\u0000\u0001';
// }

// @json
// class Vec3 {
//   x: f32 = 0.0;
//   y: f32 = 0.0;
//   z: f32 = 0.0;
// }

// @json
// class Player {
//   @alias("first name")
//   firstName!: string;
//   lastName!: string;
//   lastActive!: i32[];
//   // Drop in a code block, function, or expression that evaluates to a boolean
//   @omitif((self: Player) => self.age < 18)
//   age!: i32;

//   @omitnull()
//   pos!: Vec3 | null;
//   isVerified!: boolean;
// }

// @json
// class Point { }

// @json
// class NewPoint {
//   x: f64 = 0.0;
//   y: f64 = 0.0;
//   constructor(x: f64, y: f64) {
//     this.x = x;
//     this.y = y;
//   }

//   @serializer
//   serializer(self: NewPoint): string {
//     return `x=${self.x},y=${self.y}`;
//   }

//   @deserializer
//   deserializer(data: string): NewPoint {
//     const dataSize = bytes(data);

//     const c = data.indexOf(",");
//     const x = data.slice(2, c);
//     const y = data.slice(c + 3);

//     return new NewPoint(f64.parse(x), f64.parse(y));
//   }
// }

// @json
// class InnerObj<T> {
//   obj: T = instantiate<T>();
// }

// @json
// class ObjWithBracketString {
//   data: string = "";
// }

// const player: Player = {
//   firstName: "Jairus",
//   lastName: "Tanaka",
//   lastActive: [2, 7, 2025],
//   age: 18,
//   pos: {
//     x: 3.4,
//     y: 1.2,
//     z: 8.3,
//   },
//   isVerified: true,
// };

// const a1 = JSON.stringify("\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\u000a\u000b\u000c\u000d\u000e\u000f\u000f\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f");
// // console.log("Bytes    " + bytes(a1).toString());
// console.log("a1: " + a1);

// const obj = new Obj();
// const a2 = JSON.stringify(obj);
// // console.log("Bytes    " + bytes(a2).toString());
// console.log("a2: " + a2);

// const a3 = JSON.stringify(player);
// // console.log("Bytes    " + bytes(a3).toString());
// console.log("a3: " + a3);

// const a4 = new JSON.Obj();

// a4.set("x", 1.5);
// a4.set("y", 5.4);
// a4.set("z", 9.8);
// a4.set("obj", obj);
// a4.set<boolean>("bool", false);

// console.log("a4: " + JSON.stringify(a4));

// const a5 = JSON.parse<JSON.Obj>('{"foo":"bar"}');

// console.log("a5: " + JSON.stringify(a5));

// const a6 = JSON.parse<JSON.Obj>('{"x":1.5,"y":5.4,"z":9.8,"obj":{"foo":"bar"}}');

// console.log("a6: " + JSON.stringify(a6));

// const a7 = JSON.parse<JSON.Value[]>('["string",true,3.14,{"x":1.0,"y":2.0,"z":3.0},[1,2,3,true]]');

// console.log("a7: " + JSON.stringify(a7));

// const a8 = JSON.stringify(["hello", JSON.stringify("world"), "working?"]);

// console.log("a8: " + a8);

// const a9 = JSON.stringify<JSON.Raw>(JSON.Raw.from('"hello world"'));

// console.log("a9: " + a9);

// const m10 = new Map<string, JSON.Raw>();
// m10.set("hello", new JSON.Raw('"world"'));
// m10.set("pos", new JSON.Raw('{"x":1.0,"y":2.0,"z":3.0}'));

// const a10 = JSON.stringify(m10);

// console.log("a10: " + a10);

// const a11 = JSON.parse<JSON.Obj>('  {  "x"  :  3.4  ,  "y"   :   1.2    ,  "z"  :  8.3   }     ');

// console.log("a11: " + JSON.stringify(a11));

// const a12 = JSON.parse<InnerObj<ObjWithBracketString>>('{"obj":{"data":"hello} world"}}');

// console.log("a12: " + JSON.stringify(a12));

// const a13 = JSON.stringify<JSON.Obj>(new JSON.Obj());

// console.log("a13: " + a13);

// const a14 = JSON.stringify(new Point());
// console.log("a14: " + a14);

// const a15 = JSON.parse<Point>(a14);
// console.log("a15: " + JSON.stringify(a15));

// const a16 = JSON.stringify(new NewPoint(1.0, 2.0));
// console.log("a16: " + a16);

// const a17 = JSON.parse<NewPoint>(a16);
// console.log("a17: " + JSON.stringify(a17));

// const a18 = JSON.parse<JSON.Obj[]>('[{"x":1.0,"y":2.0,"z":3.0},{"x":4.0,"y":5.0,"z":6.0},{"x":7.0,"y":8.0,"z":9.0}]');
// console.log("a18: " + JSON.stringify(a18));

// const a19 = JSON.stringify<JSON.Obj[]>(a18);
// console.log("a19: " + a19);

// const a20 = JSON.parse<JSON.Box<f64>[]>("[1.3,4.7,9.5]");
// console.log("a20: " + JSON.stringify(a20));

// const a21 = JSON.stringify<JSON.Box<f64>[]>(a20);
// console.log("a21: " + a21);

// const a22 = JSON.parse<Foo>('{"id":"0xb8","firstName":"Jairus","lastName":"Tanaka"}');
// console.log("a22: " + JSON.stringify(a22));


// @json
// class Foo {
//   id: string = "";
//   firstName: string = "";
//   lastName: string = "";
// }

// @json
// class SrvInfo {
//   accessUrl: string = "https://example.com";
//   cardTypes: i32[] = [1, 2, 3];
//   customService: string = "Contact us at support@example.com";
//   invoiceApplicationStatus: i32 = 1;
//   isCertification: bool = true;
//   isOnlineRecharge: bool = false;
//   loginTypes: i32[] = [0, 1]; // e.g. 0 = password, 1 = OTP
//   record: string = "ICP 12345678";
//   regCompanyAudit: i32 = 2;
//   regCompanyPipeline: i32[] = [101, 102, 103];
//   regPwdLimit: i32 = 8; // min password length
//   serverTime: i64 = 1650000000000; // dummy timestamp
//   srvDescription: string = "A demo service for handling customer operations.";
//   srvHiddenMenu: string[] = ["admin", "beta"];
//   srvHost: string = "srv.example.com";
//   srvId: i32 = 999;
//   srvKeywords: string[] = ["finance", "payments", "online"];
//   srvLogoImgUrl: string = "https://example.com/logo.png";
//   srvName: string = "ExampleService";
//   srvPageId: i32 = 5;
//   thirdAuthUrl: string = "https://auth.example.com";
//   userCenterStyle: i32 = 1; // e.g. 1 = modern, 0 = legacy
// }

// const a23 = JSON.stringify(new SrvInfo());
// console.log("a23: " + a23);

// const a24 = '{"accessUrl":"https://example.com","cardTypes":[1,2,3],"customService":"Contact us at support@example.com","invoiceApplicationStatus":1,"isCertification":true,"isOnlineRecharge":false,"loginTypes":[0,1],"record":"ICP 12345678","regCompanyAudit":2,"regCompanyPipeline":[101,102,103],"regPwdLimit":8,"serverTime":1650000000000,"srvDescription":"A demo service for handling customer operations.","srvHiddenMenu":["admin","beta"],"srvHost":"srv.example.com","srvId":999,"srvKeywords":["finance","payments","online"],"srvLogoImgUrl":"https://example.com/logo.png","srvName":"ExampleService","srvPageId":5,"thirdAuthUrl":"https://auth.example.com","userCenterStyle":1}';
// console.log("a25: " + (a24 == a23).toString());

// const a26 = JSON.parse<SrvInfo>(a23);
// console.log("a26: " + JSON.stringify(a26));

// console.log("a27: " + (JSON.stringify(a26) == a23).toString())

// @json
// class GenericEnum<T> {
//   private tag: string = ""
//   private value: T | null = null

//   constructor() {
//     this.tag = ""
//     this.value = null
//   }

//   static create<T>(tag: string, value: T): GenericEnum<T> {
//     const item = new GenericEnum<T>()
//     item.tag = tag
//     item.value = value
//     return item
//   }

//   getTag(): string {
//     return this.tag
//   }

//   getValue(): T | null {
//     return this.value
//   }
//   @serializer
//   serialize<T>(self: GenericEnum<T>): string {
//     const tagJson = JSON.stringify(self.tag);
//     const valueJson = JSON.stringify(self.value);
//     return `{${tagJson}:${valueJson}}`
//   }
//   @deserializer
//   deserialize(data: string): GenericEnum<T> {
//     const parsed = JSON.parse<Map<string, JSON.Raw>>(data);
//     const result = new GenericEnum<T>();

//     const keys = parsed.keys();
//     const values = parsed.values();

//     result.tag = keys[0];
//     result.value = JSON.parse<T>(values[0].data);

//     return result;
//   }
// }

// @json
// class Node<T> {
//   name: string
//   id: u32
//   data: T

//   constructor() {
//     this.name = ""
//     this.id = 0
//     this.data = changetype<T>(0);
//   }
// }

// const enumValue = GenericEnum.create<string>("success", "Hello World");

// const node = new Node<GenericEnum<string>>();
// node.name = "test-node";
// node.id = 42;
// node.data = enumValue;

// const a28 = JSON.stringify(node);
// console.log("a28: " + a28);

// const a29 = JSON.parse<JSON.Obj>(a28);
// console.log("a29: " + JSON.stringify(a29));

// it("should parse", () => {

//   const str = `{
//   "id": "chatcmpl-BbvlnP0ESWa8OForeEjt7AkoIuh3Q",
//   "object": "chat.completion",
//   "created": 1748379903,
//   "model": "gpt-4o-mini-2024-07-18",
//   "choices": [
//     {
//       "index": 0,
//       "message": {
//         "role": "assistant",
//         "content": "Hello! How can I assist you today?"
//       },
//       "finish_reason": "stop"
//     }
//   ],
//   "usage": {
//     "prompt_tokens": 15,
//     "completion_tokens": 9,
//     "total_tokens": 24,
//     "prompt_tokens_details": {
//       "cached_tokens": 0,
//       "audio_tokens": 0
//     },
//     "completion_tokens_details": {
//       "reasoning_tokens": 0,
//       "audio_tokens": 0,
//       "accepted_prediction_tokens": 0,
//       "rejected_prediction_tokens": 0
//     }
//   },
//   "service_tier": "default",
//   "system_fingerprint": "fp_34a54ae93c"
// }`;

//   const output = JSON.parse<OpenAIChatOutput>(str);

//   console.log("output.id: " + output.id.toString());
//   console.log("output.object: " + output.object.toString());
//   console.log("output.created: " + output.created.toString());
//   console.log("output.model: " + output.model.toString());
//   console.log("output.choices[0].index: " + output.choices[0].index.toString());
//   console.log("output.choices[0].message.role: " + output.choices[0].message.role.toString());
//   console.log("output.choices[0].message.content: " + output.choices[0].message.content.toString());
//   console.log("output.choices[0].finish_reason: " + output.choices[0].finish_reason.toString());
//   console.log("output.usage.prompt_tokens: " + output.usage.promptTokens.toString());
//   console.log("output.usage.completion_tokens: " + output.usage.completionTokens.toString());
//   console.log("output.usage.total_tokens: " + output.usage.totalTokens.toString());
//   console.log("output.prompt_tokens_details.cached_tokens: " + output.usage.promptTokensDetails.cachedTokens.toString());
//   console.log("output.prompt_tokens_details.audio_tokens: " + output.usage.promptTokensDetails.audioTokens.toString());
//   console.log("output.completion_tokens_details.reasoning_tokens: " + output.usage.completionTokensDetails.reasoningTokens.toString());
//   console.log("output.completion_tokens_details.audio_tokens: " + output.usage.completionTokensDetails.audioTokens.toString());
//   console.log("output.completion_tokens_details.accepted_prediction_tokens: " + output.usage.completionTokensDetails.acceptedPredictionTokens.toString());
//   console.log("output.completion_tokens_details.rejected_prediction_tokens: " + output.usage.completionTokensDetails.rejectedPredictionTokens.toString());
//   console.log("output.service_tier: " + (output.serviceTier ? output.serviceTier!.toString() : "null"));
//   console.log("output.system_fingerprint: " + output.systemFingerprint.toString());
// });


// @json
// class OpenAIChatOutput {
//   id!: string;
//   object!: string;
//   choices!: Choice[];

//   @alias("created")
//   private _created!: i64;

//   get created(): Date {
//     return new Date(this._created * 1000);
//   }

//   model!: string;

//   @alias("service_tier")
//   serviceTier: string | null = null;

//   @alias("system_fingerprint")
//   systemFingerprint!: string;

//   usage!: Usage;
// }

// @json
// class Choice {
//   index!: i32;
//   message!: CompletionMessage;
//   finish_reason!: string;
// }

// @json
// class PromptTokensDetails {
//   @alias("cached_tokens")
//   cachedTokens!: i32;
//   @alias("audio_tokens")
//   audioTokens!: i32;

// }

// @json
// class CompletionTokensDetails {
//   @alias("reasoning_tokens")
//   reasoningTokens!: i32;
//   @alias("audio_tokens")
//   audioTokens!: i32;
//   @alias("accepted_prediction_tokens")
//   acceptedPredictionTokens!: i32;
//   @alias("rejected_prediction_tokens")
//   rejectedPredictionTokens!: i32;
// }

// @json
// class Usage {
//   @alias("completion_tokens")
//   completionTokens!: i32;

//   @alias("prompt_tokens")
//   promptTokens!: i32;

//   @alias("total_tokens")
//   totalTokens!: i32;

//   @alias("prompt_tokens_details")
//   promptTokensDetails!: PromptTokensDetails;

//   @alias("completion_tokens_details")
//   completionTokensDetails!: CompletionTokensDetails;
// }

// @json
// class CompletionMessage {
//   role!: string;
//   content!: string;
// }

// export namespace ServiceTier {
//   export const Auto = "auto";
//   export const Default = "default";
// }


it("should parse", () => {

  const str = `{
  "a": "aaa",
  "b": "bbb",
  "x": "xxx",
  "c": "ccc",
}`;

  const output = JSON.parse<Foo>(str);
  expect(output.a).toBe("aaa");
  expect(output.b).toBe("bbb");
  expect(output.c).toBe("ccc");
});

@json
class Foo {
  a!: string;
  b!: string;
  c!: string;
}