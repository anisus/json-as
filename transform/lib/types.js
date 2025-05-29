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
    generic = false;
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
    custom = false;
}
//# sourceMappingURL=types.js.map