import {
    HTMLAttributes,
    CSSProperties,
    useState,
    useRef,
    ReactNode,
    useLayoutEffect,
    RefObject,
} from "react"
import bem from "../bem"
import { className as parentClassName } from "./Container"
import InnerContent, { Props as InnerContentProps } from "./InnerContent"
import classNames from "classnames"
const b = bem(parentClassName, "itembox")
export const className = b()

export interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
    innerContentProps?: InnerContentProps
    isShown?: boolean
    horizontalOffset?: number
    verticalOffset?: number
    targetSelector?: string
    targetElement?: Element | null
    targetRef?: RefObject<HTMLElement> | null
    isFixed?: (elem?: Element | null) => boolean
    extraClasses?: string
}

const Content = function ({
    children,
    innerContentProps,
    isShown = false,
    horizontalOffset = 0,
    verticalOffset = 0,
    targetSelector = "",
    targetElement = null,
    targetRef,
    isFixed = (elem?: Element | null): boolean => {
        if (!!elem) {
            do {
                if (getComputedStyle(elem).position === "fixed") return true
            } while ((elem = elem.parentElement))
        }
        return false
    },
    extraClasses = "",
    ...args
}: Props): JSX.Element {
    const [topOffset, setTopOffset] = useState("0")
    const [leftOffset, setLeftOffset] = useState("0")

    const contentRef = useRef<HTMLDivElement>(null)

    let target: Element | null = null
    if (targetSelector) {
        target = document.querySelector(targetSelector)
    } else if (targetElement) {
        target = targetElement
    } else if (targetRef) {
        target = targetRef.current
    }

    const setOffsets = (): void => {
        if (!!target && contentRef.current) {
            const targetBoundingRect = target.getBoundingClientRect()
            const currentBoundingRect =
                contentRef.current.getBoundingClientRect()

            let left = targetBoundingRect.left + horizontalOffset
            let right = left + currentBoundingRect.width
            let top = targetBoundingRect.bottom + verticalOffset
            let bottom = top + currentBoundingRect.height

            // is there enough place on the right
            if (right > window.innerWidth) {
                right = targetBoundingRect.right + horizontalOffset
                left = right - currentBoundingRect.width
            }

            // is there enough place on the bottom and it fits on top
            if (top + currentBoundingRect.height > window.innerHeight) {
                bottom = targetBoundingRect.top + verticalOffset
                if (bottom - currentBoundingRect.height > 0) {
                    top = bottom - currentBoundingRect.height
                }
            }
            setLeftOffset(`${(isFixed(target) ? 0 : scrollX) + left}px`)
            setTopOffset(`${(isFixed(target) ? 0 : scrollY) + top}px`)
        }
    }

    const onSizeChanged = (): void => {
        setOffsets()
    }

    useLayoutEffect(() => {
        window.addEventListener("resize", onSizeChanged)
        setOffsets()

        return () => {
            window.removeEventListener("resize", onSizeChanged)
        }
    }, [])

    const modifiers = {}
    const bemModifiers = {
        visible: isShown,
    }
    const fullClassName = classNames(b(bemModifiers), modifiers, extraClasses)

    const positioningStyle: CSSProperties = target
        ? {
              position: isFixed(target) ? "fixed" : "absolute",
              left: leftOffset,
              top: topOffset,
          }
        : {}

    const contentStyle: CSSProperties = isShown
        ? Object.assign({}, positioningStyle)
        : positioningStyle

    return (
        <div
            className={fullClassName}
            style={contentStyle}
            ref={contentRef}
            data-testid="itembox"
            {...args}
        >
            <InnerContent {...innerContentProps}>{children}</InnerContent>
        </div>
    )
}

Content.displayName = "Modal Content"
export default Content
