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
  expect(output.model).toBe("gpt-4o-mini-2024-07-18");
  expect(output.system_fingerprint).toBe("fp_34a54ae93c"); // fails ("")
});


@json
class OpenAIChatOutput {
  id!: string;
  object!: string;
  model!: string;
  system_fingerprint!: string;
}
