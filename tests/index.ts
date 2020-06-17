import { expect } from "chai"
import "mocha"

import Case from "../src/index"

describe("Change case", () => {
    it("should proxy a camelcase-key object onto an underscore-key object", async () => {
        const object = Case.fromUnderscoreToCamel({
            myName: "Ivo",
            mySurname: "Sequeros del Rey",
            details: {
                languageSpoken: "en"
            }
        })

        expect(object.my_name).to.be.eq("Ivo")
        expect(object.my_surname).to.be.eq("Sequeros del Rey")
        expect(object.details.language_spoken).to.be.eq("en")
    })
    it("should proxy an underscore-key object onto an camelcase-key object", async () => {
        const object = Case.fromCamelToUnderscore({
            my_name: "Ivo",
            my_surname: "Sequeros del Rey",
            details: {
                language_spoken: "en"
            }
        })

        expect(object.myName).to.be.eq("Ivo")
        expect(object.mySurname).to.be.eq("Sequeros del Rey")
        expect(object.details.languageSpoken).to.be.eq("en")
    })
})
