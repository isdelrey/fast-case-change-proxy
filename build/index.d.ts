export default class Case {
    static toCustom(o: object, keyTransformation: (v: string | number) => string): any;
    static fromUnderscoreToCamel(o: object): any;
    static fromCamelToUnderscore(o: object): any;
}
