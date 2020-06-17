"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Case {
    static toCustom(o, keyTransformation) {
        return new Proxy(o, {
            get: (target, key) => {
                const inner = target[keyTransformation(key)];
                return typeof inner === "object"
                    ? Case.toCustom(target[keyTransformation(key)], keyTransformation)
                    : inner;
            },
            set: (target, key, value) => {
                target[keyTransformation(key)] = value;
                return true;
            },
            defineProperty: (target, key, value) => {
                target[keyTransformation(key)] = value;
                return true;
            },
            has: (target, key) => {
                return keyTransformation(key) in target;
            },
            enumerate: (target) => {
                return target.keys(target).map(keyTransformation);
            },
            ownKeys: (target) => {
                return target.keys(target).map(keyTransformation);
            },
            deleteProperty: (target, key) => {
                delete target[keyTransformation(key)];
                return true;
            }
        });
    }
    static fromUnderscoreToCamel(o) {
        return Case.toCustom(o, (underscoreKey) => underscoreKey.replace(/_([a-z])/g, (_, firstLetterWord) => firstLetterWord.toUpperCase()));
    }
    static fromCamelToUnderscore(o) {
        return Case.toCustom(o, (underscoreKey) => underscoreKey.replace(/([A-Z])/g, (_, firstLetterWord) => `_${firstLetterWord.toLowerCase()}`));
    }
}
exports.default = Case;
//# sourceMappingURL=index.js.map