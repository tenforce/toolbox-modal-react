import { ReactNode } from "react"
import * as ReactDOM from "react-dom"
import Container, {
    className as containerClassName,
    Props as ContainerProps,
} from "./Container"
import { Props as OverlayProps } from "./Overlay"
import { Props as ContentProps } from "./Content"
import { Props as InnerContentProps } from "./InnerContent"
import FocusTrap, { Props as FocusTrapProps } from "focus-trap-react"

export interface Props {
    children: ReactNode
    containerProps?: Partial<ContainerProps>
    containerSelector?: string
    contentProps?: Partial<ContentProps>
    focusTrapProps?: Partial<FocusTrapProps>
    innerContentProps?: Partial<InnerContentProps>
    isShown?: boolean
    overlayProps?: Partial<OverlayProps>
}

function Modal({
    isShown = false,
    containerSelector = "#modals",
    focusTrapProps,
    containerProps,
    overlayProps,
    contentProps,
    innerContentProps,
    children,
}: Props): JSX.Element {
    // This is necessary to ensure focusTrapProps.focusTrapOptions.fallbackFocus is set to something
    // even if the consumer wants to indicate any other options on it
    const finalFocusTrapProps = Object.assign(
        {},
        {
            focusTrapOptions: {
                // If we don't have any focusable element, focus-trap-react needs a fallback focus
                fallbackFocus: `.${containerClassName}`,
            },
        },
        focusTrapProps,
    )

    const domNode = document.querySelector(containerSelector)

    return (
        <>
            {isShown &&
                domNode &&
                ReactDOM.createPortal(
                    <FocusTrap
                        {...finalFocusTrapProps}
                        focusTrapOptions={{
                            escapeDeactivates: false,
                            ...finalFocusTrapProps.focusTrapOptions,
                        }}
                    >
                        <Container
                            {...containerProps}
                            overlayProps={overlayProps}
                            contentProps={contentProps}
                            innerContentProps={innerContentProps}
                        >
                            {children}
                        </Container>
                    </FocusTrap>,
                    domNode,
                )}
        </>
    )
}

Modal.displayName = "Modal"
export default Modal
