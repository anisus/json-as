import { Node } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import { Visitor } from "./visitor.js";
import { isStdlib, removeExtension, SimpleParser, toString } from "./util.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { Property, PropertyFlags, Schema, SourceSet } from "./types.js";
import { writeFileSync } from "fs";
import { CustomTransform } from "./linkers/custom.js";
let indent = "  ";
let id = 0;
const WRITE = process.env["JSON_WRITE"]?.trim();
const rawValue = process.env["JSON_DEBUG"]?.trim();
const DEBUG = rawValue === "true" ? 1 : rawValue === "false" || rawValue === "" ? 0 : isNaN(Number(rawValue)) ? 0 : Number(rawValue);
const STRICT = process.env["JSON_STRICT"] && process.env["JSON_STRICT"] == "true";
export class JSONTransform extends Visitor {
    static SN = new JSONTransform();
    program;
    baseCWD;
    parser;
    schemas = new Map();
    schema;
    sources = new SourceSet();
    imports = [];
    simdStatements = [];
    visitedClasses = new Set();
    visitClassDeclarationRef(node) {
        if (!node.decorators?.length ||
            !node.decorators.some((decorator) => {
                const name = decorator.name.text;
                return name === "json" || name === "serializable";
            }))
            throw new Error("Class " + node.name.text + " is missing an @json or @serializable decorator in " + node.range.source.internalPath);
        this.visitClassDeclaration(node);
    }
    visitClassDeclaration(node) {
        if (!node.decorators?.length)
            return;
        if (!node.decorators.some((decorator) => {
            const name = decorator.name.text;
            return name === "json" || name === "serializable";
        }))
            return;
        const source = this.sources.get(node.range.source);
        const fullClassPath = source.getFullPath(node);
        if (this.visitedClasses.has(fullClassPath))
            return;
        if (!this.schemas.has(source.internalPath))
            this.schemas.set(source.internalPath, []);
        const members = [...node.members.filter((v) => v.kind === 54 && v.flags !== 32 && v.flags !== 512 && v.flags !== 1024 && !v.decorators?.some((decorator) => decorator.name.text === "omit"))];
        const serializers = [...node.members.filter((v) => v.kind === 58 && v.decorators && v.decorators.some((e) => e.name.text.toLowerCase() === "serializer"))];
        const deserializers = [...node.members.filter((v) => v.kind === 58 && v.decorators && v.decorators.some((e) => e.name.text.toLowerCase() === "deserializer"))];
        const schema = new Schema();
        schema.node = node;
        schema.name = source.getQualifiedName(node);
        if (node.extendsType) {
            const extendsName = source.resolveExtendsName(node);
            if (!schema.parent) {
                const depSearch = schema.deps.find((v) => v.name == extendsName);
                if (depSearch) {
                    if (DEBUG > 0)
                        console.log("Found " + extendsName + " in dependencies of " + source.internalPath);
                    if (!schema.deps.some((v) => v.name == depSearch.name))
                        schema.deps.push(depSearch);
                    schema.parent = depSearch;
                }
                else {
                    const internalSearch = source.getClass(extendsName);
                    if (internalSearch) {
                        if (DEBUG > 0)
                            console.log("Found " + extendsName + " internally from " + source.internalPath);
                        if (!this.visitedClasses.has(source.getFullPath(internalSearch))) {
                            this.visitClassDeclarationRef(internalSearch);
                            this.schemas.get(internalSearch.range.source.internalPath).push(this.schema);
                            this.visitClassDeclaration(node);
                            return;
                        }
                        const schem = this.schemas.get(internalSearch.range.source.internalPath)?.find((s) => s.name == extendsName);
                        if (!schem)
                            throw new Error("Could not find schema for " + internalSearch.name.text + " in " + internalSearch.range.source.internalPath);
                        schema.deps.push(schem);
                        schema.parent = schem;
                    }
                    else {
                        const externalSearch = source.getImportedClass(extendsName, this.parser);
                        if (externalSearch) {
                            if (DEBUG > 0)
                                console.log("Found " + externalSearch.name.text + " externally from " + source.internalPath);
                            const externalSource = this.sources.get(externalSearch.range.source);
                            if (!this.visitedClasses.has(externalSource.getFullPath(externalSearch))) {
                                this.visitClassDeclarationRef(externalSearch);
                                this.schemas.get(externalSource.internalPath).push(this.schema);
                                this.visitClassDeclaration(node);
                                return;
                            }
                            const schem = this.schemas.get(externalSource.internalPath)?.find((s) => s.name == extendsName);
                            if (!schem)
                                throw new Error("Could not find schema for " + externalSearch.name.text + " in " + externalSource.internalPath);
                            schema.deps.push(schem);
                            schema.parent = schem;
                        }
                    }
                }
            }
            if (schema.parent?.members) {
                for (let i = schema.parent.members.length - 1; i >= 0; i--) {
                    const replace = schema.members.find((v) => v.name == schema.parent?.members[i]?.name);
                    if (!replace) {
                        members.unshift(schema.parent?.members[i].node);
                    }
                }
            }
        }
        const getUnknownTypes = (type, types = []) => {
            type = stripNull(type);
            type = source.aliases.find((v) => stripNull(v.name) == type)?.getBaseType() || type;
            if (type.startsWith("Array<")) {
                return getUnknownTypes(type.slice(6, -1));
            }
            else if (type.startsWith("Map<")) {
                const parts = type.slice(4, -1).split(",");
                return getUnknownTypes(parts[0]) || getUnknownTypes(parts[1]);
            }
            else if (isString(type) || isPrimitive(type)) {
                return types;
            }
            else if (["JSON.Box", "JSON.Obj", "JSON.Value", "JSON.Raw"].includes(type)) {
                return types;
            }
            else if (node.isGeneric && node.typeParameters.some((p) => p.name.text == type)) {
                return types;
            }
            else if (type == node.name.text) {
                return types;
            }
            types.push(type);
            return types;
        };
        for (const member of members) {
            const type = toString(member.type);
            const unknown = getUnknownTypes(type);
            for (const unknownType of unknown) {
                const depSearch = schema.deps.find((v) => v.name == unknownType);
                if (depSearch) {
                    if (DEBUG > 0)
                        console.log("Found " + unknownType + " in dependencies of " + source.internalPath);
                    if (!schema.deps.some((v) => v.name == depSearch.name)) {
                        schema.deps.push(depSearch);
                    }
                }
                else {
                    const internalSearch = source.getClass(unknownType);
                    if (internalSearch) {
                        if (DEBUG > 0)
                            console.log("Found " + unknownType + " internally from " + source.internalPath);
                        if (!this.visitedClasses.has(source.getFullPath(internalSearch))) {
                            this.visitClassDeclarationRef(internalSearch);
                            const internalSchema = this.schemas.get(internalSearch.range.source.internalPath)?.find((s) => s.name == unknownType);
                            schema.deps.push(internalSchema);
                            this.schemas.get(internalSearch.range.source.internalPath).push(this.schema);
                            this.visitClassDeclaration(node);
                            return;
                        }
                        const schem = this.schemas.get(internalSearch.range.source.internalPath)?.find((s) => s.name == unknownType);
                        if (!schem)
                            throw new Error("Could not find schema for " + internalSearch.name.text + " in " + internalSearch.range.source.internalPath);
                        schema.deps.push(schem);
                    }
                    else {
                        const externalSearch = source.getImportedClass(unknownType, this.parser);
                        if (externalSearch) {
                            if (DEBUG > 0)
                                console.log("Found " + externalSearch.name.text + " externally from " + source.internalPath);
                            const externalSource = this.sources.get(externalSearch.range.source);
                            if (!this.visitedClasses.has(externalSource.getFullPath(externalSearch))) {
                                this.visitClassDeclarationRef(externalSearch);
                                const externalSchema = this.schemas.get(externalSource.internalPath)?.find((s) => s.name == unknownType);
                                schema.deps.push(externalSchema);
                                this.schemas.get(externalSource.internalPath).push(this.schema);
                                this.visitClassDeclaration(node);
                                return;
                            }
                            const schem = this.schemas.get(externalSource.internalPath)?.find((s) => s.name == unknownType);
                            if (!schem)
                                throw new Error("Could not find schema for " + externalSearch.name.text + " in " + externalSource.internalPath);
                            schema.deps.push(schem);
                        }
                    }
                }
            }
        }
        this.schemas.get(source.internalPath).push(schema);
        this.schema = schema;
        this.visitedClasses.add(fullClassPath);
        let SERIALIZE = "__SERIALIZE(ptr: usize): void {\n";
        let INITIALIZE = "@inline __INITIALIZE(): this {\n";
        let DESERIALIZE = "__DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {\n";
        let DESERIALIZE_CUSTOM = "";
        let SERIALIZE_CUSTOM = "";
        if (DEBUG > 0)
            console.log("Created schema: " + this.schema.name + " in file " + source.normalizedPath + (this.schema.deps.length ? " with dependencies:\n  " + this.schema.deps.map((v) => v.name).join("\n  ") : ""));
        if (serializers.length > 1)
            throwError("Multiple serializers detected for class " + node.name.text + " but schemas can only have one serializer!", serializers[1].range);
        if (deserializers.length > 1)
            throwError("Multiple deserializers detected for class " + node.name.text + " but schemas can only have one deserializer!", deserializers[1].range);
        if (serializers.length) {
            this.schema.custom = true;
            const serializer = serializers[0];
            const hasCall = CustomTransform.hasCall(serializer);
            CustomTransform.visit(serializer);
            if (serializer.signature.parameters.length > 1)
                throwError("Found too many parameters in custom serializer for " + this.schema.name + ", but serializers can only accept one parameter of type '" + this.schema.name + "'!", serializer.signature.parameters[1].range);
            if (serializer.signature.parameters.length > 0 && serializer.signature.parameters[0].type.name.identifier.text != node.name.text && serializer.signature.parameters[0].type.name.identifier.text != "this")
                throwError("Type of parameter for custom serializer does not match! It should be 'string'either be 'this' or '" + this.schema.name + "'", serializer.signature.parameters[0].type.range);
            if (!serializer.signature.returnType || !serializer.signature.returnType.name.identifier.text.includes("string"))
                throwError("Could not find valid return type for serializer in " + this.schema.name + "!. Set the return type to type 'string' and try again", serializer.signature.returnType.range);
            if (!serializer.decorators.some((v) => v.name.text == "inline")) {
                serializer.decorators.push(Node.createDecorator(Node.createIdentifierExpression("inline", serializer.range), null, serializer.range));
            }
            SERIALIZE_CUSTOM += "  __SERIALIZE(ptr: usize): void {\n";
            SERIALIZE_CUSTOM += "    const data = this." + serializer.name.text + "(" + (serializer.signature.parameters.length ? "this" : "") + ");\n";
            if (hasCall)
                SERIALIZE_CUSTOM += "    bs.resetState();\n";
            SERIALIZE_CUSTOM += "    const dataSize = data.length << 1;\n";
            SERIALIZE_CUSTOM += "    memory.copy(bs.offset, changetype<usize>(data), dataSize);\n";
            SERIALIZE_CUSTOM += "    bs.offset += dataSize;\n";
            SERIALIZE_CUSTOM += "  }\n";
        }
        if (deserializers.length) {
            this.schema.custom = true;
            const deserializer = deserializers[0];
            if (!deserializer.signature.parameters.length)
                throwError("Could not find any parameters in custom deserializer for " + this.schema.name + ". Deserializers must have one parameter like 'deserializer(data: string): " + this.schema.name + " {}'", deserializer.range);
            if (deserializer.signature.parameters.length > 1)
                throwError("Found too many parameters in custom deserializer for " + this.schema.name + ", but deserializers can only accept one parameter of type 'string'!", deserializer.signature.parameters[1].range);
            if (deserializer.signature.parameters[0].type.name.identifier.text != "string")
                throwError("Type of parameter for custom deserializer does not match! It must be 'string'", deserializer.signature.parameters[0].type.range);
            if (!deserializer.signature.returnType || !(deserializer.signature.returnType.name.identifier.text.includes(this.schema.name) || deserializer.signature.returnType.name.identifier.text.includes("this")))
                throwError("Could not find valid return type for deserializer in " + this.schema.name + "!. Set the return type to type '" + this.schema.name + "' or 'this' and try again", deserializer.signature.returnType.range);
            if (!deserializer.decorators.some((v) => v.name.text == "inline")) {
                deserializer.decorators.push(Node.createDecorator(Node.createIdentifierExpression("inline", deserializer.range), null, deserializer.range));
            }
            DESERIALIZE_CUSTOM += "  __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {\n";
            DESERIALIZE_CUSTOM += "    return inline.always(this." + deserializer.name.text + "(JSON.Util.ptrToStr(srcStart, srcEnd)));\n";
            DESERIALIZE_CUSTOM += "  }\n";
        }
        if (!members.length && !deserializers.length && !serializers.length) {
            this.generateEmptyMethods(node);
            return;
        }
        for (const member of members) {
            if (!member.type)
                throwError("Fields must be strongly typed", node.range);
            let type = toString(member.type);
            type = source.aliases.find((v) => stripNull(v.name) == stripNull(type))?.getBaseType() || type;
            const name = member.name;
            const value = member.initializer ? toString(member.initializer) : null;
            if (type.startsWith("(") && type.includes("=>"))
                continue;
            const mem = new Property();
            mem.parent = this.schema;
            mem.name = name.text;
            mem.type = type;
            mem.value = value;
            mem.node = member;
            mem.byteSize = sizeof(mem.type);
            this.schema.byteSize += mem.byteSize;
            if (member.decorators) {
                for (const decorator of member.decorators) {
                    const decoratorName = decorator.name.text.toLowerCase().trim();
                    switch (decoratorName) {
                        case "alias": {
                            const arg = decorator.args[0];
                            if (!arg || arg.kind != 16)
                                throwError("@alias must have an argument of type string or number", member.range);
                            mem.alias = arg.value.toString();
                            break;
                        }
                        case "omitif": {
                            let arg = decorator.args[0];
                            if (!decorator.args?.length)
                                throwError("@omitif must have an argument or callback that resolves to type bool", member.range);
                            mem.flags.set(PropertyFlags.OmitIf, arg);
                            this.schema.static = false;
                            break;
                        }
                        case "omitnull": {
                            if (isPrimitive(type)) {
                                throwError("@omitnull cannot be used on primitive types!", member.range);
                            }
                            else if (!member.type.isNullable) {
                                throwError("@omitnull cannot be used on non-nullable types!", member.range);
                            }
                            mem.flags.set(PropertyFlags.OmitNull, null);
                            this.schema.static = false;
                            break;
                        }
                    }
                }
            }
            this.schema.members.push(mem);
        }
        if (!this.schema.static)
            this.schema.members = sortMembers(this.schema.members);
        indent = "  ";
        if (this.schema.static == false) {
            if (this.schema.members.some((v) => v.flags.has(PropertyFlags.OmitNull))) {
                SERIALIZE += indent + "let block: usize = 0;\n";
            }
            this.schema.byteSize += 2;
            SERIALIZE += indent + "store<u16>(bs.offset, 123, 0); // {\n";
            SERIALIZE += indent + "bs.offset += 2;\n";
        }
        let isPure = this.schema.static;
        let isRegular = isPure;
        let isFirst = true;
        for (let i = 0; i < this.schema.members.length; i++) {
            const member = this.schema.members[i];
            const aliasName = JSON.stringify(member.alias || member.name);
            const realName = member.name;
            const isLast = i == this.schema.members.length - 1;
            if (member.value && member.type == stripNull(member.type)) {
                if (!(member.value == "null" || member.value == "0" || member.value == "0.0" || member.value == "false")) {
                    INITIALIZE += `  store<${member.type}>(changetype<usize>(this), ${member.value}, offsetof<this>(${JSON.stringify(member.name)}));\n`;
                }
            }
            else if (member.generic) {
                INITIALIZE += `  if (isManaged<nonnull<${member.type}>>() || isReference<nonnull<${member.type}>>()) {\n`;
                INITIALIZE += `    store<${member.type}>(changetype<usize>(this), changetype<nonnull<${member.type}>>(__new(offsetof<nonnull<${member.type}>>(), idof<nonnull<${member.type}>>())), offsetof<this>(${JSON.stringify(member.name)}));\n`;
                INITIALIZE += `    if (isDefined(this.${member.name}.__INITIALIZE)) changetype<nonnull<${member.type}>>(this.${member.name}).__INITIALIZE();\n`;
                INITIALIZE += `  }\n`;
            }
            else if (!member.node.type.isNullable) {
                if (this.getSchema(member.type)) {
                    INITIALIZE += `  store<${member.type}>(changetype<usize>(this), changetype<nonnull<${member.type}>>(__new(offsetof<nonnull<${member.type}>>(), idof<nonnull<${member.type}>>())).__INITIALIZE(), offsetof<this>(${JSON.stringify(member.name)}));\n`;
                }
                else if (member.type.startsWith("Array<") || member.type.startsWith("Map<")) {
                    INITIALIZE += `  store<${member.type}>(changetype<usize>(this), [], offsetof<this>(${JSON.stringify(member.name)}));\n`;
                }
                else if (member.type == "string" || member.type == "String") {
                    INITIALIZE += `  store<${member.type}>(changetype<usize>(this), "", offsetof<this>(${JSON.stringify(member.name)}));\n`;
                }
            }
            const SIMD_ENABLED = this.program.options.hasFeature(16);
            if (!isRegular && !member.flags.has(PropertyFlags.OmitIf) && !member.flags.has(PropertyFlags.OmitNull))
                isRegular = true;
            if (isRegular && isPure) {
                const keyPart = (isFirst ? "{" : ",") + aliasName + ":";
                this.schema.byteSize += keyPart.length << 1;
                SERIALIZE += this.getStores(keyPart, SIMD_ENABLED)
                    .map((v) => indent + v + "\n")
                    .join("");
                SERIALIZE += indent + `JSON.__serialize<${member.type}>(load<${member.type}>(ptr, offsetof<this>(${JSON.stringify(realName)})));\n`;
                if (isFirst)
                    isFirst = false;
            }
            else if (isRegular && !isPure) {
                const keyPart = (isFirst ? "" : ",") + aliasName + ":";
                this.schema.byteSize += keyPart.length << 1;
                SERIALIZE += this.getStores(keyPart, SIMD_ENABLED)
                    .map((v) => indent + v + "\n")
                    .join("");
                SERIALIZE += indent + `JSON.__serialize<${member.type}>(load<${member.type}>(ptr, offsetof<this>(${JSON.stringify(realName)})));\n`;
                if (isFirst)
                    isFirst = false;
            }
            else {
                if (member.flags.has(PropertyFlags.OmitNull)) {
                    SERIALIZE += indent + `if ((block = load<usize>(ptr, offsetof<this>(${JSON.stringify(realName)}))) !== 0) {\n`;
                    indentInc();
                    const keyPart = aliasName + ":";
                    this.schema.byteSize += keyPart.length << 1;
                    SERIALIZE += this.getStores(keyPart, SIMD_ENABLED)
                        .map((v) => indent + v + "\n")
                        .join("");
                    SERIALIZE += indent + `JSON.__serialize<${member.type}>(load<${member.type}>(ptr, offsetof<this>(${JSON.stringify(realName)})));\n`;
                    if (!isLast) {
                        this.schema.byteSize += 2;
                        SERIALIZE += indent + `store<u16>(bs.offset, 44, 0); // ,\n`;
                        SERIALIZE += indent + `bs.offset += 2;\n`;
                    }
                    indentDec();
                    this.schema.byteSize += 2;
                    SERIALIZE += indent + `}\n`;
                }
                else if (member.flags.has(PropertyFlags.OmitIf)) {
                    if (member.flags.get(PropertyFlags.OmitIf).kind == 14) {
                        const arg = member.flags.get(PropertyFlags.OmitIf);
                        arg.declaration.signature.parameters[0].type = Node.createNamedType(Node.createSimpleTypeName("this", node.range), null, false, node.range);
                        arg.declaration.signature.returnType.name = Node.createSimpleTypeName("boolean", arg.declaration.signature.returnType.name.range);
                        SERIALIZE += indent + `if (!(${toString(member.flags.get(PropertyFlags.OmitIf))})(this)) {\n`;
                    }
                    else {
                        SERIALIZE += indent + `if (${toString(member.flags.get(PropertyFlags.OmitIf))}) {\n`;
                    }
                    indentInc();
                    SERIALIZE += this.getStores(aliasName + ":", SIMD_ENABLED)
                        .map((v) => indent + v + "\n")
                        .join("");
                    SERIALIZE += indent + `JSON.__serialize<${member.type}>(load<${member.type}>(ptr, offsetof<this>(${JSON.stringify(realName)})));\n`;
                    if (!isLast) {
                        this.schema.byteSize += 2;
                        SERIALIZE += indent + `store<u16>(bs.offset, 44, 0); // ,\n`;
                        SERIALIZE += indent + `bs.offset += 2;\n`;
                    }
                    indentDec();
                    SERIALIZE += indent + `}\n`;
                }
            }
        }
        const sortedMembers = {
            string: [],
            number: [],
            boolean: [],
            null: [],
            array: [],
            object: [],
        };
        for (const member of this.schema.members) {
            const type = stripNull(member.type);
            if (member.custom || member.generic) {
                sortedMembers.string.push(member);
                sortedMembers.number.push(member);
                sortedMembers.object.push(member);
                sortedMembers.array.push(member);
                sortedMembers.boolean.push(member);
                sortedMembers.null.push(member);
            }
            else {
                if (member.node.type.isNullable)
                    sortedMembers.null.push(member);
                if (isString(type) || type == "JSON.Raw")
                    sortedMembers.string.push(member);
                else if (isBoolean(type) || type.startsWith("JSON.Box<bool"))
                    sortedMembers.boolean.push(member);
                else if (isPrimitive(type) || type.startsWith("JSON.Box<"))
                    sortedMembers.number.push(member);
                else if (isArray(type))
                    sortedMembers.array.push(member);
                sortedMembers.object.push(member);
            }
        }
        indent = "";
        DESERIALIZE += indent + "  let keyStart: usize = 0;\n";
        DESERIALIZE += indent + "  let keyEnd: usize = 0;\n";
        DESERIALIZE += indent + "  let isKey = false;\n";
        if (!STRICT || sortedMembers.object.length || sortedMembers.array.length)
            DESERIALIZE += indent + "  let depth: i32 = 0;\n";
        DESERIALIZE += indent + "  let lastIndex: usize = 0;\n\n";
        DESERIALIZE += indent + "  while (srcStart < srcEnd && JSON.Util.isSpace(load<u16>(srcStart))) srcStart += 2;\n";
        DESERIALIZE += indent + "  while (srcEnd > srcStart && JSON.Util.isSpace(load<u16>(srcEnd - 2))) srcEnd -= 2;\n";
        DESERIALIZE += indent + '  if (srcStart - srcEnd == 0) throw new Error("Input string had zero length or was all whitespace");\n';
        DESERIALIZE += indent + "  if (load<u16>(srcStart) != 123) throw new Error(\"Expected '{' at start of object at position \" + (srcEnd - srcStart).toString());\n";
        DESERIALIZE += indent + "  if (load<u16>(srcEnd - 2) != 125) throw new Error(\"Expected '}' at end of object at position \" + (srcEnd - srcStart).toString());\n";
        DESERIALIZE += indent + "  srcStart += 2;\n\n";
        DESERIALIZE += indent + "  while (srcStart < srcEnd) {\n";
        DESERIALIZE += indent + "    let code = load<u16>(srcStart);\n";
        DESERIALIZE += indent + "    while (JSON.Util.isSpace(code)) code = load<u16>(srcStart += 2);\n";
        DESERIALIZE += indent + "    if (keyStart == 0) {\n";
        DESERIALIZE += indent + "      if (code == 34 && load<u16>(srcStart - 2) !== 92) {\n";
        DESERIALIZE += indent + "        if (isKey) {\n";
        DESERIALIZE += indent + "          keyStart = lastIndex;\n";
        DESERIALIZE += indent + "          keyEnd = srcStart;\n";
        if (DEBUG > 1)
            DESERIALIZE += indent + '          console.log("Key: " + JSON.Util.ptrToStr(keyStart, keyEnd));\n';
        DESERIALIZE += indent + "          while (JSON.Util.isSpace((code = load<u16>((srcStart += 2))))) {}\n";
        DESERIALIZE += indent + "          if (code !== 58) throw new Error(\"Expected ':' after key at position \" + (srcEnd - srcStart).toString());\n";
        DESERIALIZE += indent + "          isKey = false;\n";
        DESERIALIZE += indent + "        } else {\n";
        DESERIALIZE += indent + "          isKey = true;\n";
        DESERIALIZE += indent + "          lastIndex = srcStart + 2;\n";
        DESERIALIZE += indent + "        }\n";
        DESERIALIZE += indent + "      }\n";
        DESERIALIZE += indent + "      srcStart += 2;\n";
        DESERIALIZE += indent + "    } else {\n";
        const groupMembers = (members) => {
            const groups = new Map();
            for (const member of members) {
                const name = member.alias || member.name;
                const length = name.length;
                if (!groups.has(length)) {
                    groups.set(length, []);
                }
                groups.get(length).push(member);
            }
            return [...groups.values()]
                .map((group) => group.sort((a, b) => {
                const aLen = (a.alias || a.name).length;
                const bLen = (b.alias || b.name).length;
                return aLen - bLen;
            }))
                .sort((a, b) => b.length - a.length);
        };
        const generateGroups = (members, cb, type) => {
            if (!members.length) {
                if (STRICT) {
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                }
                else {
                    if (type == "string") {
                        DESERIALIZE += indent + "              srcStart += 4;\n";
                    }
                    else if (type == "boolean" || type == "null" || type == "number") {
                        DESERIALIZE += indent + "              srcStart += 2;\n";
                    }
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    if (type == "string" || type == "object" || type == "array" || type == "number")
                        DESERIALIZE += indent + "              break;\n";
                }
            }
            else {
                const groups = groupMembers(members);
                DESERIALIZE += "     switch (<u32>keyEnd - <u32>keyStart) {\n";
                for (const group of groups) {
                    const groupLen = (group[0].alias || group[0].name).length << 1;
                    DESERIALIZE += "           case " + groupLen + ": {\n";
                    cb(group);
                    DESERIALIZE += "\n            }\n";
                }
                DESERIALIZE += "    default: {\n";
                if (STRICT) {
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                }
                else {
                    if (type == "string") {
                        DESERIALIZE += indent + "              srcStart += 4;\n";
                    }
                    else if (type == "boolean" || type == "null" || type == "number") {
                        DESERIALIZE += indent + "              srcStart += 2;\n";
                    }
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    if (type == "string" || type == "object" || type == "array" || type == "number")
                        DESERIALIZE += indent + "              break;\n";
                }
                DESERIALIZE += "        }\n";
                DESERIALIZE += "    }\n";
                if (type != "null" && type != "boolean")
                    DESERIALIZE += "  break;\n";
            }
        };
        const generateConsts = (members) => {
            if (members.some((m) => (m.alias || m.name).length << 1 == 2)) {
                DESERIALIZE += "            const code16 = load<u16>(keyStart);\n";
            }
            if (members.some((m) => (m.alias || m.name).length << 1 == 4)) {
                DESERIALIZE += "            const code32 = load<u32>(keyStart);\n";
            }
            if (members.some((m) => (m.alias || m.name).length << 1 == 6)) {
                DESERIALIZE += "            const code48 = load<u64>(keyStart) & 0x0000FFFFFFFFFFFF;\n";
            }
            if (members.some((m) => (m.alias || m.name).length << 1 == 8)) {
                DESERIALIZE += "            const code64 = load<u64>(keyStart);\n";
            }
            if (members.some((m) => (m.alias || m.name).length << 1 > 8)) {
                DESERIALIZE += toMemCDecl(Math.max(...members.map((m) => (m.alias || m.name).length << 1)), "            ");
            }
        };
        let mbElse = "      ";
        if (!STRICT || sortedMembers.string.length) {
            DESERIALIZE += mbElse + "if (code == 34) {\n";
            DESERIALIZE += "          lastIndex = srcStart;\n";
            DESERIALIZE += "          srcStart += 2;\n";
            DESERIALIZE += "          while (srcStart < srcEnd) {\n";
            DESERIALIZE += "            const code = load<u16>(srcStart);\n";
            DESERIALIZE += "            if (code == 34 && load<u16>(srcStart - 2) !== 92) {\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (string, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart + 2));';
            generateGroups(sortedMembers.string, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "            if (" + (first.generic ? "isString<" + first.type + ">() && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "              store<" + first.type + ">(changetype<usize>(out), JSON.__deserialize<" + first.type + ">(lastIndex, srcStart + 2), offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "              srcStart += 4;\n";
                DESERIALIZE += indent + "              keyStart = 0;\n";
                DESERIALIZE += indent + "              break;\n";
                DESERIALIZE += indent + "            }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isString<" + mem.type + ">() && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "              store<" + mem.type + ">(changetype<usize>(out), JSON.__deserialize<" + mem.type + ">(lastIndex, srcStart + 2), offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "              srcStart += 4;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "            }\n";
                }
                else {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + "              srcStart += 4;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "string");
            DESERIALIZE += "          }\n";
            DESERIALIZE += "          srcStart += 2;\n";
            DESERIALIZE += "        }\n";
            DESERIALIZE += "      }\n";
            mbElse = " else ";
        }
        if (!STRICT || sortedMembers.number.length) {
            DESERIALIZE += mbElse + "if (code - 48 <= 9 || code == 45) {\n";
            DESERIALIZE += "        lastIndex = srcStart;\n";
            DESERIALIZE += "        srcStart += 2;\n";
            DESERIALIZE += "        while (srcStart < srcEnd) {\n";
            DESERIALIZE += "          const code = load<u16>(srcStart);\n";
            DESERIALIZE += "          if (code == 44 || code == 125 || JSON.Util.isSpace(code)) {\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (number, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart));';
            generateGroups(sortedMembers.number, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "            if (" + (first.generic ? "(isInteger<" + first.type + ">() || isFloat<" + first.type + ">()) && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "              store<" + first.type + ">(changetype<usize>(out), JSON.__deserialize<" + first.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "              srcStart += 2;\n";
                DESERIALIZE += indent + "              keyStart = 0;\n";
                DESERIALIZE += indent + "              break;\n";
                DESERIALIZE += indent + "            }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "(isInteger<" + mem.type + ">() || isFloat<" + mem.type + ">()) && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "              store<" + mem.type + ">(changetype<usize>(out), JSON.__deserialize<" + mem.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "              srcStart += 2;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "            }\n";
                }
                else {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + "              srcStart += 2;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "number");
            DESERIALIZE += "          }\n";
            DESERIALIZE += "          srcStart += 2;\n";
            DESERIALIZE += "        }\n";
            DESERIALIZE += "      }";
            mbElse = " else ";
        }
        if (!STRICT || sortedMembers.object.length) {
            DESERIALIZE += mbElse + "if (code == 123) {\n";
            DESERIALIZE += "        lastIndex = srcStart;\n";
            DESERIALIZE += "        depth++;\n";
            DESERIALIZE += "        srcStart += 2;\n";
            DESERIALIZE += "        while (srcStart < srcEnd) {\n";
            DESERIALIZE += "          const code = load<u16>(srcStart);\n";
            DESERIALIZE += "          if (code == 34) {\n";
            DESERIALIZE += "            srcStart += 2;\n";
            DESERIALIZE += "            while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;\n";
            DESERIALIZE += "          } else if (code == 125) {\n";
            DESERIALIZE += "            if (--depth == 0) {\n";
            DESERIALIZE += "              srcStart += 2;\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (object, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart));';
            indent = "  ";
            generateGroups(sortedMembers.object, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "            if (" + (first.generic ? "isDefined(out.__DESERIALIZE) &&" : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "              store<" + first.type + ">(changetype<usize>(out), JSON.__deserialize<" + first.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "              keyStart = 0;\n";
                DESERIALIZE += indent + "              break;\n";
                DESERIALIZE += indent + "            }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isDefined(out.__DESERIALIZE) &&" : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "              store<" + mem.type + ">(changetype<usize>(out), JSON.__deserialize<" + mem.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "            }\n";
                }
                else {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "object");
            indent = "";
            DESERIALIZE += "            }\n";
            DESERIALIZE += "          } else if (code == 123) depth++;\n";
            DESERIALIZE += "          srcStart += 2;\n";
            DESERIALIZE += "        }\n";
            DESERIALIZE += "      }";
            mbElse = " else ";
        }
        if (!STRICT || sortedMembers.array.length) {
            DESERIALIZE += mbElse + "if (code == 91) {\n";
            DESERIALIZE += "        lastIndex = srcStart;\n";
            DESERIALIZE += "        depth++;\n";
            DESERIALIZE += "        srcStart += 2;\n";
            DESERIALIZE += "        while (srcStart < srcEnd) {\n";
            DESERIALIZE += "          const code = load<u16>(srcStart);\n";
            DESERIALIZE += "          if (code == 34) {\n";
            DESERIALIZE += "            srcStart += 2;\n";
            DESERIALIZE += "            while (!(load<u16>(srcStart) == 34 && load<u16>(srcStart - 2) != 92)) srcStart += 2;\n";
            DESERIALIZE += "          } else if (code == 93) {\n";
            DESERIALIZE += "            if (--depth == 0) {\n";
            DESERIALIZE += "              srcStart += 2;\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (object, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart));';
            indent = "  ";
            generateGroups(sortedMembers.array, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "            if (" + (first.generic ? "isArray<" + first.type + ">() && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "              store<" + first.type + ">(changetype<usize>(out), JSON.__deserialize<" + first.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "              keyStart = 0;\n";
                DESERIALIZE += indent + "              break;\n";
                DESERIALIZE += indent + "            }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isArray" + mem.type + ">() && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "              store<" + mem.type + ">(changetype<usize>(out), JSON.__deserialize<" + mem.type + ">(lastIndex, srcStart), offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '              throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "            }\n";
                }
                else {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "array");
            indent = "";
            DESERIALIZE += "            }\n";
            DESERIALIZE += "          } else if (code == 91) depth++;\n";
            DESERIALIZE += "          srcStart += 2;\n";
            DESERIALIZE += "        }\n";
            DESERIALIZE += "      }";
            mbElse = " else ";
        }
        if (!STRICT || sortedMembers.boolean.length) {
            DESERIALIZE += mbElse + "if (code == 116) {\n";
            DESERIALIZE += "        if (load<u64>(srcStart) == 28429475166421108) {\n";
            DESERIALIZE += "          srcStart += 8;\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (bool, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart - 8));';
            generateGroups(sortedMembers.boolean, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "          if (" + (first.generic ? "isBoolean<" + first.type + ">() && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "            store<boolean>(changetype<usize>(out), true, offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "            srcStart += 2;\n";
                DESERIALIZE += indent + "            keyStart = 0;\n";
                DESERIALIZE += indent + "            break;\n";
                DESERIALIZE += indent + "          }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isBoolean<" + mem.type + ">() && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "            store<boolean>(changetype<usize>(out), true, offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "            srcStart += 2;\n";
                    DESERIALIZE += indent + "            keyStart = 0;\n";
                    DESERIALIZE += indent + "            break;\n";
                    DESERIALIZE += indent + "          }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '            throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "          }\n";
                }
                else {
                    DESERIALIZE += " else { \n";
                    DESERIALIZE += indent + "              srcStart += 2;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "boolean");
            DESERIALIZE += "        }";
            DESERIALIZE += " else {\n";
            DESERIALIZE += "          throw new Error(\"Expected to find 'true' but found '\" + JSON.Util.ptrToStr(lastIndex, srcStart) + \"' instead at position \" + (srcEnd - srcStart).toString());\n";
            DESERIALIZE += "        }";
            DESERIALIZE += "\n      }";
            mbElse = " else ";
            DESERIALIZE += mbElse + "if (code == 102) {\n";
            DESERIALIZE += "        if (load<u64>(srcStart, 2) == 28429466576093281) {\n";
            DESERIALIZE += "          srcStart += 10;\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (bool, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart - 10));';
            generateGroups(sortedMembers.boolean, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "          if (" + (first.generic ? "isBoolean<" + first.type + ">() && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "            store<boolean>(changetype<usize>(out), false, offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "            srcStart += 2;\n";
                DESERIALIZE += indent + "            keyStart = 0;\n";
                DESERIALIZE += indent + "            break;\n";
                DESERIALIZE += indent + "          }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isBoolean<" + mem.type + ">() && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "            store<boolean>(changetype<usize>(out), false, offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "            srcStart += 2;\n";
                    DESERIALIZE += indent + "            keyStart = 0;\n";
                    DESERIALIZE += indent + "            break;\n";
                    DESERIALIZE += indent + "          }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '            throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "          }\n";
                }
                else {
                    DESERIALIZE += " else { \n";
                    DESERIALIZE += indent + "              srcStart += 2;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "boolean");
            DESERIALIZE += "        }";
            DESERIALIZE += " else {\n";
            DESERIALIZE += "          throw new Error(\"Expected to find 'false' but found '\" + JSON.Util.ptrToStr(lastIndex, srcStart) + \"' instead at position \" + (srcEnd - srcStart).toString());\n";
            DESERIALIZE += "        }";
            DESERIALIZE += "\n      }";
            mbElse = " else ";
        }
        if (!STRICT || sortedMembers.null.length) {
            DESERIALIZE += mbElse + "if (code == 110) {\n";
            DESERIALIZE += "        if (load<u64>(srcStart) == 30399761348886638) {\n";
            DESERIALIZE += "          srcStart += 8;\n";
            if (DEBUG > 1)
                DESERIALIZE += '              console.log("Value (null, ' + ++id + '): " + JSON.Util.ptrToStr(lastIndex, srcStart - 8));';
            generateGroups(sortedMembers.null, (group) => {
                generateConsts(group);
                const first = group[0];
                const fName = first.alias || first.name;
                DESERIALIZE += indent + "          if (" + (first.generic ? "isNullable<" + first.type + ">() && " : "") + getComparision(fName) + ") { // " + fName + "\n";
                DESERIALIZE += indent + "            store<usize>(changetype<usize>(out), 0, offsetof<this>(" + JSON.stringify(first.name) + "));\n";
                DESERIALIZE += indent + "            srcStart += 2;\n";
                DESERIALIZE += indent + "            keyStart = 0;\n";
                DESERIALIZE += indent + "            break;\n";
                DESERIALIZE += indent + "          }";
                for (let i = 1; i < group.length; i++) {
                    const mem = group[i];
                    const memName = mem.alias || mem.name;
                    DESERIALIZE += indent + " else if (" + (mem.generic ? "isNullable<" + mem.type + ">() && " : "") + getComparision(memName) + ") { // " + memName + "\n";
                    DESERIALIZE += indent + "            store<usize>(changetype<usize>(out), 0, offsetof<this>(" + JSON.stringify(mem.name) + "));\n";
                    DESERIALIZE += indent + "            srcStart += 2;\n";
                    DESERIALIZE += indent + "            keyStart = 0;\n";
                    DESERIALIZE += indent + "            break;\n";
                    DESERIALIZE += indent + "          }";
                }
                if (STRICT) {
                    DESERIALIZE += " else {\n";
                    DESERIALIZE += indent + '            throw new Error("Unexpected key value pair in JSON object \'" + JSON.Util.ptrToStr(keyStart, keyEnd) + ":" + JSON.Util.ptrToStr(lastIndex, srcStart) + "\' at position " + (srcEnd - srcStart).toString());\n';
                    DESERIALIZE += indent + "          }\n";
                }
                else {
                    DESERIALIZE += " else { \n";
                    DESERIALIZE += indent + "              srcStart += 2;\n";
                    DESERIALIZE += indent + "              keyStart = 0;\n";
                    DESERIALIZE += indent + "              break;\n";
                    DESERIALIZE += indent + "            }\n";
                }
            }, "null");
            DESERIALIZE += "        }";
            DESERIALIZE += "\n      }";
            mbElse = " else ";
        }
        DESERIALIZE += " else {\n";
        DESERIALIZE += "   srcStart += 2;\n";
        DESERIALIZE += "   keyStart = 0;\n";
        DESERIALIZE += "}\n";
        DESERIALIZE += "\n    }\n";
        indentDec();
        DESERIALIZE += `  }\n`;
        indentDec();
        DESERIALIZE += `  return out;\n}\n`;
        indent = "  ";
        this.schema.byteSize += 2;
        SERIALIZE += indent + "store<u16>(bs.offset, 125, 0); // }\n";
        SERIALIZE += indent + "bs.offset += 2;\n";
        SERIALIZE += "}";
        SERIALIZE = SERIALIZE.slice(0, 32) + indent + "bs.proposeSize(" + this.schema.byteSize + ");\n" + SERIALIZE.slice(32);
        INITIALIZE += "  return this;\n";
        INITIALIZE += "}";
        if (DEBUG > 0) {
            console.log(SERIALIZE_CUSTOM || SERIALIZE);
            console.log(INITIALIZE);
            console.log(DESERIALIZE_CUSTOM || DESERIALIZE);
        }
        const SERIALIZE_METHOD = SimpleParser.parseClassMember(SERIALIZE_CUSTOM || SERIALIZE, node);
        const INITIALIZE_METHOD = SimpleParser.parseClassMember(INITIALIZE, node);
        const DESERIALIZE_METHOD = SimpleParser.parseClassMember(DESERIALIZE_CUSTOM || DESERIALIZE, node);
        if (!node.members.find((v) => v.name.text == "__SERIALIZE"))
            node.members.push(SERIALIZE_METHOD);
        if (!node.members.find((v) => v.name.text == "__INITIALIZE"))
            node.members.push(INITIALIZE_METHOD);
        if (!node.members.find((v) => v.name.text == "__DESERIALIZE"))
            node.members.push(DESERIALIZE_METHOD);
        super.visitClassDeclaration(node);
    }
    getSchema(name) {
        name = stripNull(name);
        return this.schemas.get(this.schema.node.range.source.internalPath).find((s) => s.name == name) || null;
    }
    generateEmptyMethods(node) {
        let SERIALIZE_EMPTY = "@inline __SERIALIZE(ptr: usize): void {\n  bs.proposeSize(4);\n  store<u32>(bs.offset, 8192123);\n  bs.offset += 4;\n}";
        let INITIALIZE_EMPTY = "@inline __INITIALIZE(): this {\n  return this;\n}";
        let DESERIALIZE_EMPTY = "@inline __DESERIALIZE<__JSON_T>(srcStart: usize, srcEnd: usize, out: __JSON_T): __JSON_T {\n  return this;\n}";
        if (DEBUG > 0) {
            console.log(SERIALIZE_EMPTY);
            console.log(INITIALIZE_EMPTY);
            console.log(DESERIALIZE_EMPTY);
        }
        const SERIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(SERIALIZE_EMPTY, node);
        const INITIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(INITIALIZE_EMPTY, node);
        const DESERIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(DESERIALIZE_EMPTY, node);
        if (!node.members.find((v) => v.name.text == "__SERIALIZE"))
            node.members.push(SERIALIZE_METHOD_EMPTY);
        if (!node.members.find((v) => v.name.text == "__INITIALIZE"))
            node.members.push(INITIALIZE_METHOD_EMPTY);
        if (!node.members.find((v) => v.name.text == "__DESERIALIZE"))
            node.members.push(DESERIALIZE_METHOD_EMPTY);
    }
    visitImportStatement(node) {
        super.visitImportStatement(node);
        this.imports.push(node);
    }
    visitSource(node) {
        this.imports = [];
        super.visitSource(node);
    }
    addImports(node) {
        this.baseCWD = this.baseCWD.replaceAll("/", path.sep);
        const baseDir = path.resolve(fileURLToPath(import.meta.url), "..", "..", "..");
        const pkgPath = path.join(this.baseCWD, "node_modules");
        let fromPath = node.range.source.normalizedPath.replaceAll("/", path.sep);
        fromPath = fromPath.startsWith("~lib") ? fromPath.slice(5) : path.join(this.baseCWD, fromPath);
        const bsImport = this.imports.find((i) => i.declarations?.find((d) => d.foreignName.text == "bs" || d.name.text == "bs"));
        const jsonImport = this.imports.find((i) => i.declarations?.find((d) => d.foreignName.text == "JSON" || d.name.text == "JSON"));
        let baseRel = path.posix.join(...path.relative(path.dirname(fromPath), path.join(baseDir)).split(path.sep));
        if (baseRel.endsWith("node_modules/json-as")) {
            baseRel = "json-as" + baseRel.slice(baseRel.indexOf("node_modules/json-as") + 20);
        }
        else if (!baseRel.startsWith(".") && !baseRel.startsWith("/") && !baseRel.startsWith("json-as")) {
            baseRel = "./" + baseRel;
        }
        if (!bsImport) {
            const replaceNode = Node.createImportStatement([Node.createImportDeclaration(Node.createIdentifierExpression("bs", node.range, false), null, node.range)], Node.createStringLiteralExpression(path.posix.join(baseRel, "lib", "as-bs"), node.range), node.range);
            node.range.source.statements.unshift(replaceNode);
            if (DEBUG > 0)
                console.log("Added import: " + toString(replaceNode) + " to " + node.range.source.normalizedPath + "\n");
        }
        if (!jsonImport) {
            const replaceNode = Node.createImportStatement([Node.createImportDeclaration(Node.createIdentifierExpression("JSON", node.range, false), null, node.range)], Node.createStringLiteralExpression(path.posix.join(baseRel, "assembly", "index"), node.range), node.range);
            node.range.source.statements.unshift(replaceNode);
            if (DEBUG > 0)
                console.log("Added import: " + toString(replaceNode) + " to " + node.range.source.normalizedPath + "\n");
        }
    }
    getStores(data, simd = false) {
        const out = [];
        const sizes = strToNum(data, simd);
        let offset = 0;
        for (const [size, num] of sizes) {
            if (size == "v128" && simd) {
                let index = this.simdStatements.findIndex((v) => v.includes(num));
                let name = "SIMD_" + (index == -1 ? this.simdStatements.length : index);
                if (index && !this.simdStatements.includes(`const ${name} = ${num};`))
                    this.simdStatements.push(`const ${name} = ${num};`);
                out.push("store<v128>(bs.offset, " + name + ", " + offset + "); // " + data.slice(offset >> 1, (offset >> 1) + 8));
                offset += 16;
            }
            if (size == "u64") {
                out.push("store<u64>(bs.offset, " + num + ", " + offset + "); // " + data.slice(offset >> 1, (offset >> 1) + 4));
                offset += 8;
            }
            else if (size == "u32") {
                out.push("store<u32>(bs.offset, " + num + ", " + offset + "); // " + data.slice(offset >> 1, (offset >> 1) + 2));
                offset += 4;
            }
            else if (size == "u16") {
                out.push("store<u16>(bs.offset, " + num + ", " + offset + "); // " + data.slice(offset >> 1, (offset >> 1) + 1));
                offset += 2;
            }
        }
        out.push("bs.offset += " + offset + ";");
        return out;
    }
    isValidType(type, node) {
        const validTypes = ["string", "u8", "i8", "u16", "i16", "u32", "i32", "u64", "i64", "f32", "f64", "bool", "boolean", "Date", "JSON.Value", "JSON.Obj", "JSON.Raw", "Value", "Obj", "Raw", ...this.schemas.get(this.schema.node.range.source.internalPath).map((v) => v.name)];
        const baseTypes = ["Array", "Map", "Set", "JSON.Box", "Box"];
        if (node && node.isGeneric && node.typeParameters)
            validTypes.push(...node.typeParameters.map((v) => v.name.text));
        if (type.endsWith("| null")) {
            if (isPrimitive(type.slice(0, type.indexOf("| null"))))
                return false;
            return this.isValidType(type.slice(0, type.length - 7), node);
        }
        if (type.includes("<"))
            return baseTypes.includes(type.slice(0, type.indexOf("<"))) && this.isValidType(type.slice(type.indexOf("<") + 1, type.lastIndexOf(">")), node);
        if (validTypes.includes(type))
            return true;
        return false;
    }
}
export default class Transformer extends Transform {
    afterParse(parser) {
        const transformer = JSONTransform.SN;
        const sources = parser.sources
            .filter((source) => {
            const p = source.internalPath;
            if (p.startsWith("~lib/rt") || p.startsWith("~lib/performance") || p.startsWith("~lib/wasi_") || p.startsWith("~lib/shared/")) {
                return false;
            }
            return !isStdlib(source);
        })
            .sort((a, b) => {
            if (a.sourceKind >= 2 && b.sourceKind <= 1) {
                return -1;
            }
            else if (a.sourceKind <= 1 && b.sourceKind >= 2) {
                return 1;
            }
            else {
                return 0;
            }
        })
            .sort((a, b) => {
            if (a.sourceKind === 1) {
                return 1;
            }
            else {
                return 0;
            }
        });
        transformer.baseCWD = path.join(process.cwd(), this.baseDir);
        transformer.program = this.program;
        transformer.parser = parser;
        for (const source of sources) {
            transformer.imports = [];
            transformer.currentSource = source;
            transformer.visit(source);
            if (transformer.simdStatements.length) {
                for (const simd of transformer.simdStatements)
                    source.statements.unshift(SimpleParser.parseTopLevelStatement(simd));
            }
            transformer.simdStatements = [];
            if (transformer.schemas.has(source.internalPath)) {
                transformer.addImports(source);
            }
            if (source.normalizedPath == WRITE) {
                writeFileSync(path.join(process.cwd(), this.baseDir, removeExtension(source.normalizedPath) + ".tmp.ts"), toString(source));
            }
        }
    }
}
function sortMembers(members) {
    return members.sort((a, b) => {
        const aMove = a.flags.has(PropertyFlags.OmitIf) || a.flags.has(PropertyFlags.OmitNull);
        const bMove = b.flags.has(PropertyFlags.OmitIf) || b.flags.has(PropertyFlags.OmitNull);
        if (aMove && !bMove) {
            return -1;
        }
        else if (!aMove && bMove) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
function toU16(data, offset = 0) {
    return data.charCodeAt(offset + 0).toString();
}
function toU32(data, offset = 0) {
    return ((data.charCodeAt(offset + 1) << 16) | data.charCodeAt(offset + 0)).toString();
}
function toU48(data, offset = 0) {
    return ((BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0))).toString();
}
function toU64(data, offset = 0) {
    return ((BigInt(data.charCodeAt(offset + 3)) << 48n) | (BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0))).toString();
}
function toMemCDecl(n, indent) {
    let out = "";
    let offset = 0;
    let index = 0;
    while (n >= 8) {
        out += `${indent}const codeS${(index += 8)} = load<u64>(keyStart, ${offset});\n`;
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        out += `${indent}const codeS${(index += 4)} = load<u32>(keyStart, ${offset});\n`;
        offset += 4;
        n -= 4;
    }
    if (n == 1)
        out += `${indent}const codeS${(index += 1)} = load<u16>(keyStart, ${offset});\n`;
    return out;
}
function toMemCCheck(data) {
    let n = data.length << 1;
    let out = "";
    let offset = 0;
    let index = 0;
    while (n >= 8) {
        out += ` && codeS${(index += 8)} == ${toU64(data, offset >> 1)}`;
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        out += ` && codeS${(index += 4)} == ${toU32(data, offset >> 1)}`;
        offset += 4;
        n -= 4;
    }
    if (n == 1)
        out += ` && codeS${(index += 1)} == ${toU16(data, offset >> 1)}`;
    return out.slice(4);
}
function strToNum(data, simd = false, offset = 0) {
    const out = [];
    let n = data.length;
    while (n >= 8 && simd) {
        out.push(["v128", "i16x8(" + data.charCodeAt(offset + 0) + ", " + data.charCodeAt(offset + 1) + ", " + data.charCodeAt(offset + 2) + ", " + data.charCodeAt(offset + 3) + ", " + data.charCodeAt(offset + 4) + ", " + data.charCodeAt(offset + 5) + ", " + data.charCodeAt(offset + 6) + ", " + data.charCodeAt(offset + 7) + ")"]);
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        const value = (BigInt(data.charCodeAt(offset + 3)) << 48n) | (BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0));
        out.push(["u64", value.toString()]);
        offset += 4;
        n -= 4;
    }
    while (n >= 2) {
        const value = (data.charCodeAt(offset + 1) << 16) | data.charCodeAt(offset + 0);
        out.push(["u32", value.toString()]);
        offset += 2;
        n -= 2;
    }
    if (n === 1) {
        const value = data.charCodeAt(offset + 0);
        out.push(["u16", value.toString()]);
    }
    return out;
}
function throwError(message, range) {
    const err = new Error();
    err.stack = `${message}\n  at ${range.source.normalizedPath}:${range.source.lineAt(range.start)}:${range.source.columnAt()}\n`;
    throw err;
}
function indentInc() {
    indent += "  ";
}
function indentDec() {
    indent = indent.slice(0, Math.max(0, indent.length - 2));
}
function sizeof(type) {
    if (type == "u8")
        return 6;
    else if (type == "i8")
        return 8;
    else if (type == "u16")
        return 10;
    else if (type == "i16")
        return 12;
    else if (type == "u32")
        return 20;
    else if (type == "i32")
        return 22;
    else if (type == "u64")
        return 40;
    else if (type == "i64")
        return 40;
    else if (type == "bool" || type == "boolean")
        return 10;
    else
        return 0;
}
function isPrimitive(type) {
    const primitiveTypes = ["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "f32", "f64", "bool", "boolean"];
    return primitiveTypes.some((v) => type.startsWith(v));
}
function isBoolean(type) {
    return type == "bool" || type == "boolean";
}
function isStruct(type) {
    type = stripNull(type);
    const schema = JSONTransform.SN.schema;
    if (schema.name == type)
        return true;
    const depSearch = schema.deps.some((v) => v.name == type);
    if (depSearch)
        return true;
    return false;
}
function isString(type) {
    return stripNull(type) == "string" || stripNull(type) == "String";
}
function isArray(type) {
    return type.startsWith("Array<");
}
export function stripNull(type) {
    if (type.endsWith(" | null")) {
        return type.slice(0, type.length - 7);
    }
    else if (type.startsWith("null | ")) {
        return type.slice(7);
    }
    return type;
}
function getComparision(data) {
    switch (data.length << 1) {
        case 2: {
            return "code16 == " + data.charCodeAt(0);
        }
        case 4: {
            return "code32 == " + toU32(data);
        }
        case 6: {
            return "code48 == " + toU48(data);
        }
        case 8: {
            return "code64 == " + toU64(data);
        }
        default: {
            return toMemCCheck(data);
        }
    }
}
//# sourceMappingURL=index.js.map