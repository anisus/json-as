import { ClassDeclaration, CommonFlags, NodeKind, Parser, Source } from "assemblyscript/dist/assemblyscript.js";
import { Visitor } from "../visitor.js";
import { getImports } from "./imports.js";

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

  // visitTypeName(node: TypeName, ref?: Node | null): void {}
  // visitParameter(node: ParameterNode, ref?: Node | null): void {}
  // visitFunctionTypeNode(node: FunctionTypeNode, ref?: Node | null): void {}
  // visitNamedTypeNode(node: NamedTypeNode, ref?: Node | null): void {}

  static getClass(name: string, source: Source): ClassDeclaration | null {
    return ClassGetter.getClasses(source).find((c) => c.name.text == name) || null;
  }

  static getClasses(source: Source): ClassDeclaration[] {
    // ClassGetter.SN.classes = [];
    // ClassGetter.SN.visit(source);
    // return ClassGetter.SN.classes;
    return source.statements.filter((stmt) => stmt.kind == NodeKind.ClassDeclaration) as ClassDeclaration[];
  }
}

export function getClasses(source: Source): ClassDeclaration[] {
  return ClassGetter.getClasses(source);
}

export function getClass(name: string, source: Source): ClassDeclaration | null {
  return ClassGetter.getClass(name, source);
}
