import {
  bs
} from "../lib/as-bs";
import {
  JSON
} from ".";
import {
  expect,
  it
} from "./__tests__/lib";
it("should parse", () => {
  const str = `{\n  "id": "chatcmpl-BbvlnP0ESWa8OForeEjt7AkoIuh3Q",\n  "object": "chat.completion",\n  "created": 1748379903,\n  "model": "gpt-4o-mini-2024-07-18",\n  "choices": [\n    {\n      "index": 0,\n      "message": {\n        "role": "assistant",\n        "content": "Hello! How can I assist you today?",\n        "refusal": null,\n        "annotations": []\n      },\n      "logprobs": null,\n      "finish_reason": "stop"\n    }\n  ],\n  "usage": {\n    "prompt_tokens": 15,\n    "completion_tokens": 9,\n    "total_tokens": 24,\n    "prompt_tokens_details": {\n      "cached_tokens": 0,\n      "audio_tokens": 0\n    },\n    "completion_tokens_details": {\n      "reasoning_tokens": 0,\n      "audio_tokens": 0,\n      "accepted_prediction_tokens": 0,\n      "rejected_prediction_tokens": 0\n    }\n  },\n  "service_tier": "default",\n  "system_fingerprint": "fp_34a54ae93c"\n}`;
  const output = JSON.parse<OpenAIChatOutput>(str);
  expect(output.id).toBe("chatcmpl-BbvlnP0ESWa8OForeEjt7AkoIuh3Q");
  expect(output.object).toBe("chat.completion");
  expect(output.created.getTime()).toBe(1748379903000);
  expect(output.model).toBe("gpt-4o-mini-2024-07-18");
  expect(output.choices.length).toBe(1);
  const choice = output.choices[0];
  expect(choice.index).toBe(0);
  expect(choice.message.content).toBe("Hello! How can I assist you today?");
});
@json
class OpenAIChatOutput {
  id!: string;
  object!: string;
  choices: Array<Choice> = [];
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
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(230);
    store<u64>(bs.offset, 28147948644860027, 0);
    store<u32>(bs.offset, 3801122, 8);
    bs.offset += 12;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("id")));
    store<u64>(bs.offset, 27585024461242412, 0);
    store<u64>(bs.offset, 32651522506817642, 8);
    store<u32>(bs.offset, 3801122, 16);
    bs.offset += 20;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("object")));
    store<u64>(bs.offset, 29273822781898796, 0);
    store<u64>(bs.offset, 28429397856419951, 8);
    store<u32>(bs.offset, 2228339, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<Array<Choice>>(load<Array<Choice>>(ptr, offsetof<this>("choices")));
    store<u64>(bs.offset, 32088572549005356, 0);
    store<u64>(bs.offset, 28429470870339685, 8);
    store<u32>(bs.offset, 2228324, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<i64>(load<i64>(ptr, offsetof<this>("_created")));
    store<u64>(bs.offset, 31244190568546348, 0);
    store<u64>(bs.offset, 9570613071249508, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("model")));
    store<u64>(bs.offset, 28429466571243564, 0);
    store<u64>(bs.offset, 27866473673654386, 8);
    store<u64>(bs.offset, 29555370777051237, 16);
    store<u64>(bs.offset, 16325694685577317, 24);
    bs.offset += 32;
    JSON.__serialize<string | null>(load<string | null>(ptr, offsetof<this>("serviceTier")));
    store<u64>(bs.offset, 34058966105456684, 0);
    store<u64>(bs.offset, 30681206260760691, 8);
    store<u64>(bs.offset, 30962698416423007, 16);
    store<u64>(bs.offset, 31525687024484455, 24);
    store<u64>(bs.offset, 32651569751720050, 32);
    store<u32>(bs.offset, 3801122, 40);
    bs.offset += 44;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("systemFingerprint")));
    store<u64>(bs.offset, 32370124835127340, 0);
    store<u64>(bs.offset, 9570583006609505, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<Usage>(load<Usage>(ptr, offsetof<this>("usage")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.id = "";
    this.object = "";
    this.choices = [];
    this.model = "";
    this.serviceTier = null;
    this.systemFingerprint = "";
    this.usage = changetype<nonnull<Usage>>(__new(offsetof<nonnull<Usage>>(), idof<nonnull<Usage>>())).__INITIALIZE();
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 4:
                  {
                    const code32 = load<u32>(keyStart);
                    if (code32 == 6553705) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("id"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 12:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS12 = load<u32>(keyStart, 8);
                    if (codeS8 == 28429427920732271 && codeS12 == 7602275) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("object"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 10:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    if (codeS8 == 28429402151780461) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("model"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 24:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    if (codeS8 == 33214536884748403 && codeS16 == 26740556585697385 && codeS24 == 32088581143593076) {
                      store<string | null>(changetype<usize>(out), JSON.__deserialize<string | null>(lastIndex, srcStart + 2), offsetof<this>("serviceTier"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 36:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    const codeS32 = load<u64>(keyStart, 24);
                    const codeS36 = load<u32>(keyStart, 32);
                    if (codeS8 == 32651591227605107 && codeS16 == 28710855653523557 && codeS24 == 28429415036616809 && codeS32 == 29555362188230770 && codeS36 == 7602286) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("systemFingerprint"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 14:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS12 = load<u32>(keyStart, 8);
                    if (codeS8 == 27303506540101731 && codeS12 == 6619252) {
                      store<i64>(changetype<usize>(out), JSON.__deserialize<i64>(lastIndex, srcStart), offsetof<this>("_created"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 10:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      if (codeS8 == 28992339220562037) {
                        store<Usage>(changetype<usize>(out), JSON.__deserialize<Usage>(lastIndex, srcStart), offsetof<this>("usage"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 14:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS12 = load<u32>(keyStart, 8);
                      if (codeS8 == 29555349302804579 && codeS12 == 6619235) {
                        store<Array<Choice>>(changetype<usize>(out), JSON.__deserialize<Array<Choice>>(lastIndex, srcStart), offsetof<this>("choices"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 24:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  const codeS16 = load<u64>(keyStart, 8);
                  const codeS24 = load<u64>(keyStart, 16);
                  if (codeS8 == 33214536884748403 && codeS16 == 26740556585697385 && codeS24 == 32088581143593076) {
                    store<string | null>(changetype<usize>(out), null, offsetof<this>("serviceTier"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class ToolCall {
  id!: string;
  type: string = "function";
  function!: FunctionCall;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(54);
    store<u64>(bs.offset, 28147948644860027, 0);
    store<u32>(bs.offset, 3801122, 8);
    bs.offset += 12;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("id")));
    store<u64>(bs.offset, 34058970400423980, 0);
    store<u64>(bs.offset, 16325694684725360, 8);
    bs.offset += 16;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("type")));
    store<u64>(bs.offset, 32933010364039212, 0);
    store<u64>(bs.offset, 29555370777313390, 8);
    store<u64>(bs.offset, 16325694685315183, 16);
    bs.offset += 24;
    JSON.__serialize<FunctionCall>(load<FunctionCall>(ptr, offsetof<this>("function")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.id = "";
    this.type = "function";
    this.function = changetype<nonnull<FunctionCall>>(__new(offsetof<nonnull<FunctionCall>>(), idof<nonnull<FunctionCall>>())).__INITIALIZE();
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 4:
                  {
                    const code32 = load<u32>(keyStart);
                    if (code32 == 6553705) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("id"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 8:
                  {
                    const code64 = load<u64>(keyStart);
                    if (code64 == 28429453692043380) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("type"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              srcStart += 2;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 16:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS16 = load<u64>(keyStart, 8);
                      if (codeS8 == 27866495148425318 && codeS16 == 30962724186423412) {
                        store<FunctionCall>(changetype<usize>(out), JSON.__deserialize<FunctionCall>(lastIndex, srcStart), offsetof<this>("function"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class FunctionCall {
  name!: string;
  arguments!: string;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(44);
    store<u64>(bs.offset, 27303545189564539, 0);
    store<u64>(bs.offset, 16325694684725357, 8);
    bs.offset += 16;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("name")));
    store<u64>(bs.offset, 32088563959070764, 0);
    store<u64>(bs.offset, 28429440806879335, 8);
    store<u64>(bs.offset, 9570643137003630, 16);
    store<u16>(bs.offset, 58, 24);
    bs.offset += 26;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("arguments")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.name = "";
    this.arguments = "";
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 8:
                  {
                    const code64 = load<u64>(keyStart);
                    if (code64 == 28429440805568622) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("name"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 18:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    if (codeS8 == 32933014664249441 && codeS16 == 32651569751457901) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("arguments"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              srcStart += 2;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class Usage {
  @alias("completion_tokens")
  completionTokens!: i32;
  @alias("prompt_tokens")
  promptTokens!: i32;
  @alias("total_tokens")
  totalTokens!: i32;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(176);
    store<u64>(bs.offset, 31244147618873467, 0);
    store<u64>(bs.offset, 28429436511584365, 8);
    store<u64>(bs.offset, 30962724186423412, 16);
    store<u64>(bs.offset, 30118299257012319, 24);
    store<u64>(bs.offset, 9570643136610405, 32);
    store<u16>(bs.offset, 58, 40);
    bs.offset += 42;
    JSON.__serialize<i32>(load<i32>(ptr, offsetof<this>("completionTokens")));
    store<u64>(bs.offset, 32088628383580204, 0);
    store<u64>(bs.offset, 32651578341916783, 8);
    store<u64>(bs.offset, 30118299257012319, 16);
    store<u64>(bs.offset, 9570643136610405, 24);
    store<u16>(bs.offset, 58, 32);
    bs.offset += 34;
    JSON.__serialize<i32>(load<i32>(ptr, offsetof<this>("promptTokens")));
    store<u64>(bs.offset, 31244220633317420, 0);
    store<u64>(bs.offset, 26740586650337396, 8);
    store<u64>(bs.offset, 28429432216551540, 16);
    store<u64>(bs.offset, 16325694685642862, 24);
    bs.offset += 32;
    JSON.__serialize<i32>(load<i32>(ptr, offsetof<this>("totalTokens")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              srcStart += 4;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 34:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    const codeS32 = load<u64>(keyStart, 24);
                    if (codeS8 == 31525665550303331 && codeS16 == 29555370777444460 && codeS24 == 32651505327538287 && codeS32 == 30962681236881519) {
                      store<i32>(changetype<usize>(out), JSON.__deserialize<i32>(lastIndex, srcStart), offsetof<this>("completionTokens"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                case 26:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    if (codeS8 == 30681249210302576 && codeS16 == 32651505327931504 && codeS24 == 30962681236881519) {
                      store<i32>(changetype<usize>(out), JSON.__deserialize<i32>(lastIndex, srcStart), offsetof<this>("promptTokens"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                case 24:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    if (codeS8 == 27303570964414580 && codeS16 == 31244220637315180 && codeS24 == 32370094774747243) {
                      store<i32>(changetype<usize>(out), JSON.__deserialize<i32>(lastIndex, srcStart), offsetof<this>("totalTokens"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class Choice {
  @alias("finish_reason")
  finishReason!: string;
  index!: i32;
  message: CompletionMessage = new CompletionMessage();
  logprobs!: Logprobs | null;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(122);
    store<u64>(bs.offset, 29555310643511419, 0);
    store<u64>(bs.offset, 29273891506028654, 8);
    store<u64>(bs.offset, 27303506540101727, 16);
    store<u64>(bs.offset, 9570621661839475, 24);
    store<u16>(bs.offset, 58, 32);
    bs.offset += 34;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("finishReason")));
    store<u64>(bs.offset, 30962698411966508, 0);
    store<u64>(bs.offset, 9570664610857060, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<i32>(load<i32>(ptr, offsetof<this>("index")));
    store<u64>(bs.offset, 28429440801439788, 0);
    store<u64>(bs.offset, 28992339220562035, 8);
    store<u32>(bs.offset, 2228325, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<CompletionMessage>(load<CompletionMessage>(ptr, offsetof<this>("message")));
    store<u64>(bs.offset, 31244186273579052, 0);
    store<u64>(bs.offset, 31244212048494695, 8);
    store<u64>(bs.offset, 16325694685642850, 16);
    bs.offset += 24;
    JSON.__serialize<Logprobs | null>(load<Logprobs | null>(ptr, offsetof<this>("logprobs")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.finishReason = "";
    this.message = new CompletionMessage();
    this.logprobs = changetype<nonnull<Logprobs | null>>(__new(offsetof<nonnull<Logprobs | null>>(), idof<nonnull<Logprobs | null>>())).__INITIALIZE();
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 26:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS24 = load<u64>(keyStart, 16);
                    if (codeS8 == 29555345007902822 && codeS16 == 32088555373723763 && codeS24 == 31244216342478949) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("finishReason"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 10:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    if (codeS8 == 28429402151714921) {
                      store<i32>(changetype<usize>(out), JSON.__deserialize<i32>(lastIndex, srcStart), offsetof<this>("index"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 14:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS12 = load<u32>(keyStart, 8);
                      if (codeS8 == 32370116249583725 && codeS12 == 6750305) {
                        store<CompletionMessage>(changetype<usize>(out), JSON.__deserialize<CompletionMessage>(lastIndex, srcStart), offsetof<this>("message"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  case 16:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS16 = load<u64>(keyStart, 8);
                      if (codeS8 == 31525639780499564 && codeS16 == 32370043235795058) {
                        store<Logprobs | null>(changetype<usize>(out), JSON.__deserialize<Logprobs | null>(lastIndex, srcStart), offsetof<this>("logprobs"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 16:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  const codeS16 = load<u64>(keyStart, 8);
                  if (codeS8 == 31525639780499564 && codeS16 == 32370043235795058) {
                    store<Logprobs | null>(changetype<usize>(out), null, offsetof<this>("logprobs"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class Logprobs {
  content: Array<LogprobsContent> | null = null;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(24);
    store<u64>(bs.offset, 31244147618873467, 0);
    store<u64>(bs.offset, 30962681237471342, 8);
    store<u32>(bs.offset, 2228340, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<Array<LogprobsContent> | null>(load<Array<LogprobsContent> | null>(ptr, offsetof<this>("content")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.content = null;
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              srcStart += 4;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              srcStart += 2;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 14:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS12 = load<u32>(keyStart, 8);
                      if (codeS8 == 32651569752113251 && codeS12 == 7209061) {
                        store<Array<LogprobsContent> | null>(changetype<usize>(out), JSON.__deserialize<Array<LogprobsContent> | null>(lastIndex, srcStart), offsetof<this>("content"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 14:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  const codeS12 = load<u32>(keyStart, 8);
                  if (codeS8 == 32651569752113251 && codeS12 == 7209061) {
                    store<Array<LogprobsContent> | null>(changetype<usize>(out), null, offsetof<this>("content"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class LogprobsContent {
  token!: string;
  logprob!: f64;
  bytes!: Array<u8> | null;
  @alias("top_logprobs")
  topLogprobs!: Array<TopLogprobsContent>;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(92);
    store<u64>(bs.offset, 31244220633317499, 0);
    store<u64>(bs.offset, 9570621661184107, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("token")));
    store<u64>(bs.offset, 31244186273579052, 0);
    store<u64>(bs.offset, 31244212048494695, 8);
    store<u32>(bs.offset, 2228322, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<f64>(load<f64>(ptr, offsetof<this>("logprob")));
    store<u64>(bs.offset, 34058893091012652, 0);
    store<u64>(bs.offset, 9570643136020596, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<Array<u8> | null>(load<Array<u8> | null>(ptr, offsetof<this>("bytes")));
    store<u64>(bs.offset, 31244220633317420, 0);
    store<u64>(bs.offset, 31244186277576816, 8);
    store<u64>(bs.offset, 31244212048494695, 16);
    store<u64>(bs.offset, 16325694685642850, 24);
    bs.offset += 32;
    JSON.__serialize<Array<TopLogprobsContent>>(load<Array<TopLogprobsContent>>(ptr, offsetof<this>("topLogprobs")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.token = "";
    this.bytes = [];
    this.topLogprobs = [];
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 10:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    if (codeS8 == 28429432216551540) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("token"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 14:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS12 = load<u32>(keyStart, 8);
                    if (codeS8 == 31525639780499564 && codeS12 == 7274610) {
                      store<f64>(changetype<usize>(out), JSON.__deserialize<f64>(lastIndex, srcStart), offsetof<this>("logprob"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 10:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      if (codeS8 == 28429470871912546) {
                        store<Array<u8> | null>(changetype<usize>(out), JSON.__deserialize<Array<u8> | null>(lastIndex, srcStart), offsetof<this>("bytes"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  case 24:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS16 = load<u64>(keyStart, 8);
                      const codeS24 = load<u64>(keyStart, 16);
                      if (codeS8 == 26740603831124084 && codeS16 == 31525639780499564 && codeS24 == 32370043235795058) {
                        store<Array<TopLogprobsContent>>(changetype<usize>(out), JSON.__deserialize<Array<TopLogprobsContent>>(lastIndex, srcStart), offsetof<this>("topLogprobs"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 10:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  if (codeS8 == 28429470871912546) {
                    store<Array<u8> | null>(changetype<usize>(out), null, offsetof<this>("bytes"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class TopLogprobsContent {
  token!: string;
  logprob!: f64;
  bytes!: Array<u8> | null;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(60);
    store<u64>(bs.offset, 31244220633317499, 0);
    store<u64>(bs.offset, 9570621661184107, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("token")));
    store<u64>(bs.offset, 31244186273579052, 0);
    store<u64>(bs.offset, 31244212048494695, 8);
    store<u32>(bs.offset, 2228322, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<f64>(load<f64>(ptr, offsetof<this>("logprob")));
    store<u64>(bs.offset, 34058893091012652, 0);
    store<u64>(bs.offset, 9570643136020596, 8);
    store<u16>(bs.offset, 58, 16);
    bs.offset += 18;
    JSON.__serialize<Array<u8> | null>(load<Array<u8> | null>(ptr, offsetof<this>("bytes")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.token = "";
    this.bytes = [];
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 10:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    if (codeS8 == 28429432216551540) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("token"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 14:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS12 = load<u32>(keyStart, 8);
                    if (codeS8 == 31525639780499564 && codeS12 == 7274610) {
                      store<f64>(changetype<usize>(out), JSON.__deserialize<f64>(lastIndex, srcStart), offsetof<this>("logprob"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 10:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      if (codeS8 == 28429470871912546) {
                        store<Array<u8> | null>(changetype<usize>(out), JSON.__deserialize<Array<u8> | null>(lastIndex, srcStart), offsetof<this>("bytes"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 10:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  if (codeS8 == 28429470871912546) {
                    store<Array<u8> | null>(changetype<usize>(out), null, offsetof<this>("bytes"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
@json
class CompletionMessage {
  role!: string;
  content!: string;
  @omitnull()
  refusal: string | null = null;
  @alias("tool_calls")
  @omitif((self: this): boolean => self.toolCalls.length == 0)
  toolCalls: Array<ToolCall> = [];
  @omitnull()
  audio: AudioOutput | null = null;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(86);
    let block: usize = 0;
    store<u16>(bs.offset, 123, 0);
    bs.offset += 2;
    if ((block = load<usize>(ptr, offsetof<this>("refusal"))) !== 0) {
      store<u64>(bs.offset, 28710881423654946, 0);
      store<u64>(bs.offset, 30399714104115317, 8);
      store<u32>(bs.offset, 3801122, 16);
      bs.offset += 20;
      JSON.__serialize<string | null>(load<string | null>(ptr, offsetof<this>("refusal")));
      store<u16>(bs.offset, 44, 0);
      bs.offset += 2;
    }
    if (!((self: this): boolean => self.toolCalls.length == 0)(this)) {
      store<u64>(bs.offset, 31244199163854882, 0);
      store<u64>(bs.offset, 27303497948921964, 8);
      store<u64>(bs.offset, 9570643136479340, 16);
      store<u16>(bs.offset, 58, 24);
      bs.offset += 26;
      JSON.__serialize<Array<ToolCall>>(load<Array<ToolCall>>(ptr, offsetof<this>("toolCalls")));
      store<u16>(bs.offset, 44, 0);
      bs.offset += 2;
    }
    if ((block = load<usize>(ptr, offsetof<this>("audio"))) !== 0) {
      store<u64>(bs.offset, 28148000188596258, 0);
      store<u64>(bs.offset, 16325694685380713, 8);
      bs.offset += 16;
      JSON.__serialize<AudioOutput | null>(load<AudioOutput | null>(ptr, offsetof<this>("audio")));
      store<u16>(bs.offset, 44, 0);
      bs.offset += 2;
    }
    store<u64>(bs.offset, 30399774233591842, 0);
    store<u32>(bs.offset, 2228325, 8);
    store<u16>(bs.offset, 58, 12);
    bs.offset += 14;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("role")));
    store<u64>(bs.offset, 31244147618873388, 0);
    store<u64>(bs.offset, 30962681237471342, 8);
    store<u32>(bs.offset, 2228340, 16);
    store<u16>(bs.offset, 58, 20);
    bs.offset += 22;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("content")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.refusal = null;
    this.toolCalls = [];
    this.audio = null;
    this.role = "";
    this.content = "";
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 14:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS12 = load<u32>(keyStart, 8);
                    if (codeS8 == 32933010368430194 && codeS12 == 6357107) {
                      store<string | null>(changetype<usize>(out), JSON.__deserialize<string | null>(lastIndex, srcStart + 2), offsetof<this>("refusal"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else if (codeS8 == 32651569752113251 && codeS12 == 7209061) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("content"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 8:
                  {
                    const code64 = load<u64>(keyStart);
                    if (code64 == 28429436511518834) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("role"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              srcStart += 2;
              keyStart = 0;
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 10:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      if (codeS8 == 29555302059016289) {
                        store<AudioOutput | null>(changetype<usize>(out), JSON.__deserialize<AudioOutput | null>(lastIndex, srcStart), offsetof<this>("audio"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                switch (<u32>keyEnd - <u32>keyStart) {
                  case 20:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS16 = load<u64>(keyStart, 8);
                      const codeS20 = load<u32>(keyStart, 16);
                      if (codeS8 == 30399774233395316 && codeS16 == 30399714103066719 && codeS20 == 7536748) {
                        store<Array<ToolCall>>(changetype<usize>(out), JSON.__deserialize<Array<ToolCall>>(lastIndex, srcStart), offsetof<this>("toolCalls"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      srcStart += 2;
                      keyStart = 0;
                    }

}
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 14:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  const codeS12 = load<u32>(keyStart, 8);
                  if (codeS8 == 32933010368430194 && codeS12 == 6357107) {
                    store<string | null>(changetype<usize>(out), null, offsetof<this>("refusal"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              case 10:
                {
                  const codeS8 = load<u64>(keyStart, 0);
                  if (codeS8 == 29555302059016289) {
                    store<AudioOutput | null>(changetype<usize>(out), null, offsetof<this>("audio"));
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  } else {
                    srcStart += 2;
                    keyStart = 0;
                    break;
                  }
                }

              default:
                {
                  srcStart += 2;
                  keyStart = 0;
                }

}
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
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
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(110);
    store<u64>(bs.offset, 28147948644860027, 0);
    store<u32>(bs.offset, 3801122, 8);
    bs.offset += 12;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("id")));
    store<u64>(bs.offset, 33777430999203884, 0);
    store<u64>(bs.offset, 28429462280929392, 8);
    store<u64>(bs.offset, 32651513916489843, 16);
    store<u32>(bs.offset, 3801122, 24);
    bs.offset += 28;
    JSON.__serialize<i64>(load<i64>(ptr, offsetof<this>("_expiresAt")));
    store<u64>(bs.offset, 32088645563449388, 0);
    store<u64>(bs.offset, 27866516622803041, 8);
    store<u64>(bs.offset, 32651578341654642, 16);
    store<u32>(bs.offset, 3801122, 24);
    bs.offset += 28;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("transcript")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.id = "";
    this.transcript = "";
    return this;
  }
  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {
    let keyStart: usize = 0;
    let keyEnd: usize = 0;
    let isKey = false;
    let depth: i32 = 0;
    let lastIndex: usize = 0;
    while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;
    while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;
    if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");
;
    if (load<u16>(srcStart) != 123) throw new Error("Expected '{' at start of object at position " + (srcEnd - srcStart).toString());
;
    if (load<u16>(srcEnd - 2) != 125) throw new Error("Expected '}' at end of object at position " + (srcEnd - srcStart).toString());
;
    srcStart += 2;
    while (srcStart < srcEnd) {
      let code = load<u16>(srcStart);
      while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);
      if (keyStart == 0) {
        if (code == 34 && load<u16>(srcStart - 2) !== 92) {
          if (isKey) {
            keyStart = lastIndex;
            keyEnd = srcStart;
            while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}
            if (code !== 58) throw new Error("Expected ':' after key at position " + (srcEnd - srcStart).toString());
;
            isKey = false;
          } else {
            isKey = true;
            lastIndex = srcStart + 2;
          }
        }
        srcStart += 2;
      } else {
        if (code == 34) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34 && load<u16>(srcStart - 2) !== 92) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 4:
                  {
                    const code32 = load<u32>(keyStart);
                    if (code32 == 6553705) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("id"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 20:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS20 = load<u32>(keyStart, 16);
                    if (codeS8 == 30962664057471092 && codeS16 == 29555362187378803 && codeS20 == 7602288) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("transcript"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 4;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code - 48 <= 9 || code == 45) {
          lastIndex = srcStart;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {
              switch (<u32>keyEnd - <u32>keyStart) {
                case 20:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    const codeS20 = load<u32>(keyStart, 16);
                    if (codeS8 == 29555353598820453 && codeS16 == 26740616715370610 && codeS20 == 7602273) {
                      store<i64>(changetype<usize>(out), JSON.__deserialize<i64>(lastIndex, srcStart), offsetof<this>("_expiresAt"));
                      keyStart = 0;
                      break;
                    } else {
                      keyStart = 0;
                      break;
                    }
                  }

                default:
                  {
                    srcStart += 2;
                    keyStart = 0;
                  }

}
              break;
            }
            srcStart += 2;
          }
        } else if (code == 123) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 125) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 123) depth++;
;
            srcStart += 2;
          }
        } else if (code == 91) {
          lastIndex = srcStart;
          depth++;
          srcStart += 2;
          while (srcStart < srcEnd) {
            const code = load<u16>(srcStart);
            if (code == 34) {
              srcStart += 2;
              while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;
            } else if (code == 93) {
              if (--depth == 0) {
                srcStart += 2;
                srcStart += 2;
                keyStart = 0;
                break;
              }
            } else if (code == 91) depth++;
;
            srcStart += 2;
          }
        } else if (code == 116) {
          if (load<u64>(srcStart) == 28429475166421108) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            srcStart += 2;
            keyStart = 0;
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            srcStart += 2;
            keyStart = 0;
          }
        } else {
          srcStart += 2;
          keyStart = 0;
        }
      }
    }
    return out;
  }
}
