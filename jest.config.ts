import type { Config } from "@jest/types"

const jestConfig: Config.InitialOptions = {
    testEnvironment: "jest-environment-jsdom",
    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                isolatedModules: true,
            },
        ],
    },
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy",
        "~/(.*)": "<rootDir>/src/$1",
        "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
            "jest-transform-stub",
    },
    modulePathIgnorePatterns: ["<rootDir>/src/playwright"],
    maxWorkers: 3,
    clearMocks: true,
    testResultsProcessor: "jest-teamcity-reporter",
    verbose: true,
    collectCoverage: true,
    coverageReporters: ["text"],
    testRegex: "(\\.|/)(test|spec)\\.(jsx?|tsx?)$",
}

export default jestConfig
