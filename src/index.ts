export default class Case {
    static toCustom(o: object, keyTransformation: (v: string | number) => string) {
        return new Proxy(o, {
            get: (target: typeof Object, key: string | number) => {
                const inner = target[keyTransformation(key)]
                return typeof inner === "object"
                    ? Case.toCustom(target[keyTransformation(key)], keyTransformation)
                    : inner
            },
            set: (target: typeof Object, key: string | number, value: any) => {
                target[keyTransformation(key)] = value
                return true
            },
            defineProperty: (target: typeof Object, key: string | number, value: any) => {
                target[keyTransformation(key)] = value
                return true
            },
            has: (target: typeof Object, key: string | number) => {
                return keyTransformation(key) in target
            },
            enumerate: (target: typeof Object) => {
                return target.keys(target).map(keyTransformation)
            },
            ownKeys: (target: typeof Object) => {
                return target.keys(target).map(keyTransformation)
            },
            deleteProperty: (target: typeof Object, key: string | number) => {
                delete target[keyTransformation(key)]
                return true
            }
        })
    }
    static fromUnderscoreToCamel(o: object) {
        return Case.toCustom(o, (underscoreKey: string) =>
            underscoreKey.replace(/_([a-z])/g, (_, firstLetterWord) =>
                firstLetterWord.toUpperCase()
            )
        )
    }
    static fromCamelToUnderscore(o: object) {
        return Case.toCustom(o, (underscoreKey: string) =>
            underscoreKey.replace(
                /([A-Z])/g,
                (_, firstLetterWord) => `_${firstLetterWord.toLowerCase()}`
            )
        )
    }
}
