import {
    ReactElement,
    HTMLAttributes,
    useEffect,
    useState,
    forwardRef,
    ForwardedRef,
} from "react"

import bem from "../bem"
import classNames from "classnames"
export const className = "toolbox-modal"
const b = bem(className)
import Overlay, { Props as OverlayProps } from "./Overlay"
import Content, { Props as ContentProps } from "./Content"
import { Props as InnerContentProps } from "./InnerContent"
import React from "react"

export interface Props extends HTMLAttributes<HTMLDivElement> {
    overlayProps?: Partial<OverlayProps>
    contentProps?: Partial<ContentProps>
    innerContentProps?: Partial<InnerContentProps>
    animationDuration?: number
    isCenterPositioned?: boolean
    isCenterFixedPositioned?: boolean
    isTopFixedPositioned?: boolean
    isAbsolutePositioned?: boolean
    blockInteraction?: boolean
    blockOverlayInteraction?: boolean
    shouldCloseOnEscape?: boolean
    targetSelector?: string
    targetElement?: Element | null
    targetRef?: React.RefObject<HTMLElement> | null
    horizontalOffset?: number
    verticalOffset?: number
    extraClasses?: string
    onClose?: () => void
    willClose?: () => boolean | Promise<boolean>
}

const Container = forwardRef(
    (
        {
            overlayProps,
            contentProps,
            innerContentProps,
            children,
            animationDuration = 300,
            blockInteraction = false,
            blockOverlayInteraction = false,
            extraClasses = "",
            horizontalOffset = 0,
            isAbsolutePositioned = false,
            isCenterFixedPositioned = false,
            isCenterPositioned = false,
            isTopFixedPositioned = false,
            onClose = (): void => {
                return
            },
            shouldCloseOnEscape = true,
            targetElement = null,
            targetRef = null,
            targetSelector = "",
            verticalOffset = 0,
            willClose = (): boolean => {
                return true
            },
            ...args
        }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ): ReactElement => {
        const [timeouts] = useState<NodeJS.Timeout[]>([])
        const [isShown, setIsShown] = useState(false)
        const [isClosing, setIsClosing] = useState(false)

        const localRef = React.useRef<HTMLDivElement | null>(null)

        const handleOnClose = async function (
            onClose: (...args: unknown[]) => unknown,
        ): Promise<void> {
            // To ensure we don't try closing more than once at the same time
            if (isClosing) {
                return
            }
            setIsClosing(true)

            try {
                const proceed = await willClose()
                if (!proceed) {
                    return
                }

                setIsShown(false)
                // We let the closing animation finish then we trigger the callback
                timeouts.push(global.setTimeout(onClose, animationDuration))
            } finally {
                setIsClosing(false)
            }
        }

        const onKeyDown = function (
            event: React.KeyboardEvent<HTMLDivElement>,
        ): void | boolean {
            if (event.defaultPrevented) {
                return
            }

            if (event.key === "Escape" && shouldCloseOnEscape) {
                handleOnClose(onClose)
                event.preventDefault()
                return false
            }
            return true
        }

        useEffect(() => {
            // For the animation to play, we need to first start with a blank state, we then add the necessary CSS
            timeouts.push(
                global.setTimeout(() => {
                    setIsShown(true)
                }, 1),
            )
        }, [])

        const modifiers = {}
        const bemModifiers = {
            "center-fixed": isCenterFixedPositioned,
            "top-fixed": isTopFixedPositioned,
            "no-interaction": blockInteraction,
            "no-overlay-interaction": blockOverlayInteraction,
            absolute: isAbsolutePositioned,
            center: isCenterPositioned,
            visible: isShown,
        }
        const fullClassName = classNames(
            b(bemModifiers),
            modifiers,
            extraClasses,
        )

        return (
            <div
                ref={(r: HTMLDivElement): void => {
                    localRef.current = r
                    if (typeof ref === "function") {
                        ref(r)
                    } else if (ref !== null) {
                        ref.current = r
                    }
                }}
                className={fullClassName}
                data-testid="modal"
                tabIndex={-1}
                onKeyDown={onKeyDown}
                onBlur={(event): void => {
                    if (event.relatedTarget === null) {
                        localRef.current?.focus()
                    }
                }}
                {...args}
            >
                <Overlay
                    {...overlayProps}
                    onClose={(): void => {
                        handleOnClose(onClose)
                    }}
                />
                <Content
                    {...contentProps}
                    innerContentProps={innerContentProps}
                    isShown={isShown}
                    horizontalOffset={horizontalOffset}
                    verticalOffset={verticalOffset}
                    targetSelector={targetSelector}
                    targetElement={targetElement}
                    targetRef={targetRef}
                >
                    {children}
                </Content>
            </div>
        )
    },
)

Container.displayName = "Modal container"
export default Container
