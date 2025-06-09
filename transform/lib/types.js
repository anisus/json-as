import { TypeAlias } from "./linkers/alias.js";
import { stripNull } from "./index.js";
export var PropertyFlags;
(function (PropertyFlags) {
    PropertyFlags[PropertyFlags["OmitNull"] = 0] = "OmitNull";
    PropertyFlags[PropertyFlags["OmitIf"] = 1] = "OmitIf";
    PropertyFlags[PropertyFlags["Raw"] = 2] = "Raw";
    PropertyFlags[PropertyFlags["Custom"] = 3] = "Custom";
})(PropertyFlags || (PropertyFlags = {}));
export class Property {
    name = "";
    alias = null;
    type = "";
    value = null;
    flags = new Map();
    node;
    byteSize = 0;
    _generic = false;
    _custom = false;
    parent;
    set custom(value) {
        this._custom = value;
    }
    get custom() {
        if (this._custom)
            return true;
        if (this.parent.node.isGeneric && this.parent.node.typeParameters.some((p) => p.name.text == this.type)) {
            this._custom = true;
            return true;
        }
        for (const dep of this.parent.deps) {
            if (this.name == dep.name && dep.custom) {
                this._custom = true;
                return true;
            }
        }
        return false;
    }
    set generic(value) {
        this._generic = value;
    }
    get generic() {
        if (this._generic)
            return true;
        if (this.parent.node.isGeneric && this.parent.node.typeParameters.some((p) => p.name.text == stripNull(this.type))) {
            this._generic = true;
            return true;
        }
        return false;
    }
}
export class Schema {
    static = true;
    name = "";
    members = [];
    parent = null;
    node;
    needsLink = null;
    byteSize = 0;
    deps = [];
    _custom = false;
    set custom(value) {
        this._custom = value;
    }
    get custom() {
        if (this._custom)
            return true;
        if (this.parent)
            return this.parent.custom;
    }
}
export class Src {
    internalPath;
    schemas;
    aliases;
    imports;
    exports;
    constructor(source) {
        this.internalPath = source.internalPath;
        this.aliases = TypeAlias.getAliases(source);
    }
}
//# sourceMappingURL=types.js.map