import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"

import Modal from "./Modal"

describe("Modal", () => {
    jest.useFakeTimers()

    // For the portals
    const modalRoot = document.createElement("div")
    modalRoot.setAttribute("id", "modals")
    const body = document.querySelector("body")
    if (body) {
        body.appendChild(modalRoot)
    }

    it("renders the fullscreen modal properly", () => {
        render(
            <Modal
                isShown={true}
                containerProps={{ isAbsolutePositioned: true }}
            >
                foobar
            </Modal>,
        )

        const modal = screen.getByTestId("modal")
        expect(modal.classList.contains("toolbox-modal--absolute")).toBeTruthy()
    })

    it("renders the center modal properly", () => {
        render(
            <Modal isShown={true} containerProps={{ isCenterPositioned: true }}>
                foobar
            </Modal>,
        )

        const modal = screen.getByTestId("modal")
        expect(modal.classList.contains("toolbox-modal--center")).toBeTruthy()
    })

    it("renders the top modal properly", () => {
        render(
            <Modal
                isShown={true}
                containerProps={{ isTopFixedPositioned: true }}
            >
                foobar
            </Modal>,
        )

        const modal = screen.getByTestId("modal")
        expect(
            modal.classList.contains("toolbox-modal--top-fixed"),
        ).toBeTruthy()
    })

    it("starts hidden but gets shown once triggered", () => {
        render(<Modal isShown={false}>foobar</Modal>)

        // there should be nothing in the portal container
        expect(document.getElementById("modals")?.childElementCount).toBe(0)

        render(<Modal isShown={true}>foobar</Modal>)

        const overlay = screen.getByTestId("overlay")
        expect(overlay).toBeDefined()
    })

    it("calls the onClose callback when closing", async () => {
        const mockCallback = jest.fn()

        render(
            <Modal isShown={true} containerProps={{ onClose: mockCallback }}>
                foobar
            </Modal>,
        )

        const overlay = screen.getByTestId("overlay")
        expect(overlay).toBeDefined()

        await act(async () => {
            fireEvent.click(overlay)
        })

        setTimeout(() => {
            expect(mockCallback).toHaveBeenCalled()
            expect(overlay).toBeUndefined()
        }, 600)
    })
    jest.runAllTimers()

    it("calls the willClose callback before closing", async () => {
        const mockCallback = jest.fn()
        render(
            <Modal isShown={true} containerProps={{ willClose: mockCallback }}>
                foobar
            </Modal>,
        )

        const overlay = screen.getByTestId("overlay")
        expect(overlay).toBeDefined()
        await act(async () => {
            fireEvent.click(overlay)
        })
        expect(mockCallback).toHaveBeenCalled()
    })
})
