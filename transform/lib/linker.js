import { Visitor } from "./visitor.js";
class ImportGetter extends Visitor {
    static SN = new ImportGetter();
    imports = [];
    visitImportStatement(node, ref) {
        this.imports.push(node);
    }
    static getImports(source) {
        ImportGetter.SN.imports = [];
        ImportGetter.SN.visit(source);
        return ImportGetter.SN.imports;
    }
}
export function getImports(source) {
    return ImportGetter.getImports(source);
}
export function getImportedClass(name, source, parser) {
    for (const stmt of getImports(source)) {
        const externalSource = parser.sources.filter((src) => src.internalPath != source.internalPath).find((src) => src.internalPath == stmt.internalPath);
        if (!externalSource)
            continue;
        const classDeclaration = ClassGetter.getClass(name, externalSource);
        if (!(classDeclaration.flags & 2))
            continue;
        return classDeclaration;
    }
    return null;
}
class ClassGetter extends Visitor {
    static SN = new ClassGetter();
    classes = [];
    visitClassDeclaration(node) {
        this.classes.push(node);
    }
    static getClass(name, source) {
        return ClassGetter.getClasses(source).find((c) => c.name.text == name) || null;
    }
    static getClasses(source) {
        ClassGetter.SN.classes = [];
        ClassGetter.SN.visit(source);
        return ClassGetter.SN.classes;
    }
}
export function getClasses(source) {
    return ClassGetter.getClasses(source);
}
export function getClass(name, source) {
    return ClassGetter.getClass(name, source);
}
//# sourceMappingURL=linker.js.map