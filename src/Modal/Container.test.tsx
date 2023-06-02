import React from "react"
import { render, screen } from "@testing-library/react"

import Container, { className } from "./Container"
import Modal from "./Modal"

describe("Container", () => {
    // For the portals
    const modalRoot = document.createElement("div")
    modalRoot.setAttribute("id", "modals")
    const body = document.querySelector("body")
    if (body) {
        body.appendChild(modalRoot)
    }

    it("renders the modal overlay and the modal content and their classes", () => {
        render(
            <Container
                isTopFixedPositioned={true}
                extraClasses={"foobar"}
                overlayProps={{ extraClasses: "foo" }}
                contentProps={{ extraClasses: "bar" }}
                innerContentProps={{ extraClasses: "barfoo" }}
            >
                FOOBAR
            </Container>,
        )

        expect(
            screen.getByTestId("modal").classList.contains("foobar"),
        ).toBeTruthy()
        expect(
            screen.getByTestId("item").classList.contains("barfoo"),
        ).toBeTruthy()
        expect(
            screen.getByTestId("itembox").classList.contains("bar"),
        ).toBeTruthy()
        expect(
            screen.getByTestId("overlay").classList.contains("foo"),
        ).toBeTruthy()
        expect(screen.getByText("FOOBAR")).toBeDefined()
    })

    it("toggles classes properly", () => {
        jest.useFakeTimers()
        jest.spyOn(global, "setTimeout")

        const containerProps = {
            isTopFixedPositioned: true,
            blockInteraction: true,
            targetSelector: "",
        }

        render(
            <Modal isShown={true} containerProps={containerProps}>
                FOOBAR
            </Modal>,
        )

        let modal = screen.getByTestId("modal")
        expect(modal.classList.contains(`${className}--top-fixed`)).toBeTruthy()
        expect(
            modal.classList.contains(`${className}--no-interaction`),
        ).toBeTruthy()

        render(
            <Container
                isTopFixedPositioned={true}
                targetSelector={undefined}
                data-testid="1"
            >
                FOOBAR
            </Container>,
        )

        modal = screen.getByTestId("1")
        expect(modal.classList.contains(`${className}--top-fixed`)).toBeTruthy()

        render(
            <Container
                isCenterPositioned={true}
                targetSelector={undefined}
                data-testid="2"
            >
                FOOBAR
            </Container>,
        )

        modal = screen.getByTestId("2")
        expect(modal.classList.contains(`${className}--center`)).toBeTruthy()
    })
})
