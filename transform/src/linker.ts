import { ClassDeclaration, CommonFlags, ImportStatement, NodeKind, Parser, Source } from "assemblyscript/dist/assemblyscript.js";
import { Visitor } from "./visitor.js";
import { Node } from "types:assemblyscript/src/ast";

class ImportGetter extends Visitor {
  static SN: ImportGetter = new ImportGetter();

  private imports: ImportStatement[] = [];

  visitImportStatement(node: ImportStatement, ref?: Node | null): void {
    this.imports.push(node);
  }
  static getImports(source: Source): ImportStatement[] {
    ImportGetter.SN.imports = [];
    ImportGetter.SN.visit(source);
    return ImportGetter.SN.imports;
  }
}

export function getImports(source: Source): ImportStatement[] {
  return ImportGetter.getImports(source);
}

export function getImportedClass(name: string, source: Source, parser: Parser): ClassDeclaration | null {
  for (const stmt of getImports(source)) {
    const externalSource = parser.sources.filter((src) => src.internalPath != source.internalPath).find((src) => src.internalPath == stmt.internalPath);
    if (!externalSource) continue;

    const classDeclaration = ClassGetter.getClass(name, externalSource);
    if (!classDeclaration) continue;
    if (!(classDeclaration.flags & CommonFlags.Export)) continue;
    return classDeclaration;
  }
  return null;
}

class ClassGetter extends Visitor {
  static SN: ClassGetter = new ClassGetter();

  private classes: ClassDeclaration[] = [];

  visitClassDeclaration(node: ClassDeclaration): void {
    this.classes.push(node);
  }

  static getClass(name: string, source: Source): ClassDeclaration | null {
    return ClassGetter.getClasses(source).find((c) => c.name.text == name) || null;
  }

  static getClasses(source: Source): ClassDeclaration[] {
    ClassGetter.SN.classes = [];
    ClassGetter.SN.visit(source);
    return ClassGetter.SN.classes;
  }
}

export function getClasses(source: Source): ClassDeclaration[] {
  return ClassGetter.getClasses(source);
}

export function getClass(name: string, source: Source): ClassDeclaration | null {
  return ClassGetter.getClass(name, source);
}