export default class Case {
    static toCustom(o: object, keyTransformation: (v: string | number) => string) {
        return new Proxy(o, {
            get: (target: object, key: string | number) => {
                if (key == "toJSON")
                    return () => {
                        if (typeof target === "object") {
                            const transformObject = object =>
                                Object.fromEntries(
                                    Object.entries(object).map(([k, v]) => [
                                        keyTransformation(k),
                                        typeof v == "object" ? transformObject(v) : v
                                    ])
                                )
                            return transformObject(target)
                        }
                        return target
                    }

                const inner = target[keyTransformation(key)]
                if (typeof inner === "object")
                    return Case.toCustom(target[keyTransformation(key)], keyTransformation)
                return inner
            },
            set: (target: object, key: string | number, value: any) => {
                target[keyTransformation(key)] = value
                return true
            },
            defineProperty: (target: typeof Object, key: string | number, value: any) => {
                target[keyTransformation(key)] = value
                return true
            },
            has: (target: object, key: string | number) => {
                return keyTransformation(key) in target
            },
            enumerate: (target: object) => {
                return Object.keys(target).map(keyTransformation)
            },
            ownKeys: (target: object) => {
                console.log(Object.keys(target).map(keyTransformation))
                return Object.keys(target).map(keyTransformation)
            },
            deleteProperty: (target: object, key: string | number) => {
                delete target[keyTransformation(key)]
                return true
            },
            getOwnPropertyDescriptor: (target: object, key: string | number) => {
                var value = target[keyTransformation(key)]
                return value
                    ? {
                          value,
                          writable: true,
                          enumerable: true,
                          configurable: true
                      }
                    : undefined
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
