import { ClassDeclaration, Expression, FieldDeclaration, Source } from "assemblyscript/dist/assemblyscript.js";
import { TypeAlias } from "./linkers/alias.js";

export enum PropertyFlags {
  OmitNull,
  OmitIf,
  Raw,
  Custom,
}

export class Property {
  public name: string = "";
  public alias: string | null = null;
  public type: string = "";
  public value: string | null = null;
  public flags: Map<PropertyFlags, Expression | null> = new Map<PropertyFlags, Expression | null>();
  public node!: FieldDeclaration;
  public byteSize: number = 0;
  public generic: boolean = false;
}

export class Schema {
  public static: boolean = true;
  public name: string = "";
  public members: Property[] = [];
  public parent: Schema | null = null;
  public node!: ClassDeclaration;
  public needsLink: string | null = null;
  public byteSize: number = 0;
  public deps: Schema[] = [];
  public custom: boolean = false;
}

export class Src {
  public internalPath: string;
  public schemas: Schema[];
  public aliases: TypeAlias[];
  public imports: Schema[];
  public exports: Schema[];
  constructor(source: Source) {
    this.internalPath = source.internalPath;
    this.aliases = TypeAlias.getAliases(source);
  }
}
