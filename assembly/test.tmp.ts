import {
  bs
} from "../lib/as-bs";
import {
  JSON
} from ".";
@json
class Person {
  id: string | null = null;
  firstName: string = "";
  lastName: string = "";
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(64);
    store<u64>(bs.offset, 28147948644860027, 0);
    store<u32>(bs.offset, 3801122, 8);
    bs.offset += 12;
    JSON.__serialize<string | null>(load<string | null>(ptr, offsetof<this>("id")));
    store<u64>(bs.offset, 29555310643511340, 0);
    store<u64>(bs.offset, 21955546407174258, 8);
    store<u64>(bs.offset, 9570583007002721, 16);
    store<u16>(bs.offset, 58, 24);
    bs.offset += 26;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("firstName")));
    store<u64>(bs.offset, 27303536599629868, 0);
    store<u64>(bs.offset, 27303407755985011, 8);
    store<u64>(bs.offset, 16325694684725357, 16);
    bs.offset += 24;
    JSON.__serialize<string>(load<string>(ptr, offsetof<this>("lastName")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.firstName = "";
    this.lastName = "";
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
                      store<string | null>(changetype<usize>(out), JSON.__deserialize<string | null>(lastIndex, srcStart + 2), offsetof<this>("id"));
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
                    if (codeS8 == 32370111954878566 && codeS16 == 30681189078401140) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("firstName"));
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    } else {
                      srcStart += 4;
                      keyStart = 0;
                      break;
                    }
                  }

                case 16:
                  {
                    const codeS8 = load<u64>(keyStart, 0);
                    const codeS16 = load<u64>(keyStart, 8);
                    if (codeS8 == 32651591226032236 && codeS16 == 28429440805568590) {
                      store<string>(changetype<usize>(out), JSON.__deserialize<string>(lastIndex, srcStart + 2), offsetof<this>("lastName"));
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
                    break;
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
              case 4:
                {
                  const code32 = load<u32>(keyStart);
                  if (code32 == 6553705) {
                    store<usize>(changetype<usize>(out), 0, offsetof<this>("id"));
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
class PeopleData {
  people: Array<Person> = [];
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(22);
    store<u64>(bs.offset, 28429453686341755, 0);
    store<u64>(bs.offset, 28429436511584367, 8);
    store<u32>(bs.offset, 3801122, 16);
    bs.offset += 20;
    JSON.__serialize<Array<Person>>(load<Array<Person>>(ptr, offsetof<this>("people")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    this.people = [];
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
                  case 12:
                    {
                      const codeS8 = load<u64>(keyStart, 0);
                      const codeS12 = load<u32>(keyStart, 8);
                      if (codeS8 == 31525674139582576 && codeS12 == 6619244) {
                        store<Array<Person>>(changetype<usize>(out), JSON.__deserialize<Array<Person>>(lastIndex, srcStart), offsetof<this>("people"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      keyStart = 0;
                      break;
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
export class Response<T> {
  data: T | null = null;
  __SERIALIZE(ptr: usize): void {
    bs.proposeSize(18);
    store<u64>(bs.offset, 27303502239891579, 0);
    store<u64>(bs.offset, 16325694684463220, 8);
    bs.offset += 16;
    JSON.__serialize<T | null>(load<T | null>(ptr, offsetof<this>("data")));
    store<u16>(bs.offset, 125, 0);
    bs.offset += 2;
  }
  @inline
  __INITIALIZE(): this {
    if (isManaged<nonnull<T | null>>() || isReference<nonnull<T | null>>()) {
      this.data = changetype<nonnull<T | null>>(__new(offsetof<nonnull<T | null>>(), idof<nonnull<T | null>>()));
      if (isDefined(this.data.__INITIALIZE)) changetype<nonnull<T | null>>(this.data).__INITIALIZE();
;
    }
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
                    if (isString<T | null>() && code64 == 27303570963497060) {
                      store<T | null>(changetype<usize>(out), JSON.__deserialize<T | null>(lastIndex, srcStart + 2), offsetof<this>("data"));
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
                    break;
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
                case 8:
                  {
                    const code64 = load<u64>(keyStart);
                    if ((isInteger<T | null>() || isFloat<T | null>()) && code64 == 27303570963497060) {
                      store<T | null>(changetype<usize>(out), JSON.__deserialize<T | null>(lastIndex, srcStart), offsetof<this>("data"));
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
                    break;
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
                  case 8:
                    {
                      const code64 = load<u64>(keyStart);
                      if (isDefined(out.__DESERIALIZE) && code64 == 27303570963497060) {
                        store<T | null>(changetype<usize>(out), JSON.__deserialize<T | null>(lastIndex, srcStart), offsetof<this>("data"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      keyStart = 0;
                      break;
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
                  case 8:
                    {
                      const code64 = load<u64>(keyStart);
                      if (isArray<T | null>() && code64 == 27303570963497060) {
                        store<T | null>(changetype<usize>(out), JSON.__deserialize<T | null>(lastIndex, srcStart), offsetof<this>("data"));
                        keyStart = 0;
                        break;
                      } else {
                        keyStart = 0;
                        break;
                      }
                    }

                  default:
                    {
                      keyStart = 0;
                      break;
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
            switch (<u32>keyEnd - <u32>keyStart) {
              case 8:
                {
                  const code64 = load<u64>(keyStart);
                  if (isBoolean<T | null>() && code64 == 27303570963497060) {
                    store<boolean>(changetype<usize>(out), true, offsetof<this>("data"));
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
          } else {
            throw new Error("Expected to find 'true' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 102) {
          if (load<u64>(srcStart, 2) == 28429466576093281) {
            srcStart += 10;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 8:
                {
                  const code64 = load<u64>(keyStart);
                  if (isBoolean<T | null>() && code64 == 27303570963497060) {
                    store<boolean>(changetype<usize>(out), false, offsetof<this>("data"));
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
          } else {
            throw new Error("Expected to find 'false' but found '" + JSON.Util.ptrToStr(lastIndex, srcStart) + "' instead at position " + (srcEnd - srcStart).toString());
          }
        } else if (code == 110) {
          if (load<u64>(srcStart) == 30399761348886638) {
            srcStart += 8;
            switch (<u32>keyEnd - <u32>keyStart) {
              case 8:
                {
                  const code64 = load<u64>(keyStart);
                  if (isNullable<T | null>() && code64 == 27303570963497060) {
                    store<usize>(changetype<usize>(out), 0, offsetof<this>("data"));
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
console.log((isManaged<PeopleData>() || isReference<PeopleData>()).toString());
let deserialized = JSON.parse<Response<PeopleData>>("{\"data\":{\"people\":[]}}");
console.log("Deserialized Node: " + JSON.stringify(deserialized));
