import React from "react"
import Content from "./Content"
import { render, screen } from "@testing-library/react"

describe("Content", () => {
    // For the targeting.

    const modalRoot = document.createElement("div")
    modalRoot.setAttribute("id", "target")
    modalRoot.setAttribute(
        "style",
        '{display: "inline-block", position: "absolute", bottom: 0}',
    )

    const body = document.querySelector("body")
    if (body) {
        body.appendChild(modalRoot)
    }

    it("renders content", function () {
        render(<Content isShown={true}>foobar</Content>)

        expect(screen.getByText("foobar")).toBeDefined()
    })
})
