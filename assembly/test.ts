import { JSON } from ".";
import { expect, it } from "./__tests__/lib";

it("should parse", () => {
  const str = `{
  "id": "chatcmpl-BbvlnP0ESWa8OForeEjt7AkoIuh3Q",
  "object": "chat.completion",
  "created": 1748379903,
  "model": "gpt-4o-mini-2024-07-18",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 9,
    "total_tokens": 24,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default",
  "system_fingerprint": "fp_34a54ae93c"
}`;

  const output = JSON.parse<OpenAIChatOutput>(str);
  expect(output.id).toBe("chatcmpl-BbvlnP0ESWa8OForeEjt7AkoIuh3Q");
  expect(output.object).toBe("chat.completion");
  expect(output.created.getTime()).toBe(1748379903000);
  expect(output.model).toBe("gpt-4o-mini-2024-07-18");
  expect(output.choices.length).toBe(1);

  const choice = output.choices[0];
  expect(choice.index).toBe(0);
  expect(choice.message.content).toBe("Hello! How can I assist you today?");
  // expect(choice.message.refusal).toBe("null");
  // expect(choice.logprobs).toBe("null");
  // expect(choice.finishReason).toBe("stop");

  // expect(output.usage.promptTokens).toBe(15);
  // expect(output.usage.completionTokens).toBe(9);
  // expect(output.usage.totalTokens).toBe(24);
  // expect(output.serviceTier).toBe("default");
  // expect(output.systemFingerprint).toBe("fp_34a54ae93c");
});

@json
class OpenAIChatOutput {
  id!: string;

  object!: string;

  choices: Choice[] = [];

  get created(): Date {
    return new Date(this._created * 1000);
  }

  @alias("created")
  private _created!: i64;

  model!: string;

  @alias("service_tier")
  serviceTier: string | null = null;

  @alias("system_fingerprint")
  systemFingerprint!: string;

  usage!: Usage;
}

@json
class ToolCall {
  id!: string;

  type: string = "function";

  function!: FunctionCall;
}

@json
class FunctionCall {
  name!: string;

  arguments!: string;
}

@json
class Usage {
  @alias("completion_tokens")
  completionTokens!: i32;

  @alias("prompt_tokens")
  promptTokens!: i32;

  @alias("total_tokens")
  totalTokens!: i32;
}

@json
class Choice {
  @alias("finish_reason")
  finishReason!: string;

  index!: i32;

  message: CompletionMessage = new CompletionMessage();

  logprobs!: Logprobs | null;
}

@json
class Logprobs {
  content: LogprobsContent[] | null = null;
}

@json
class LogprobsContent {
  token!: string;

  logprob!: f64;

  bytes!: u8[] | null;

  @alias("top_logprobs")
  topLogprobs!: TopLogprobsContent[];
}

@json
class TopLogprobsContent {
  token!: string;

  logprob!: f64;

  bytes!: u8[] | null;
}

@json
class CompletionMessage {
  content!: string;

  @omitnull()
  refusal: string | null = null;

  @alias("tool_calls")
  @omitif((self: CompletionMessage) => self.toolCalls.length == 0)
  toolCalls: ToolCall[] = [];

  @omitnull()
  audio: AudioOutput | null = null;
}

@json
class AudioOutput {
  id!: string;

  get expiresAt(): Date {
    return new Date(this._expiresAt * 1000);
  }

  @alias("expires_at")
  private _expiresAt!: i64;

  transcript!: string;
}