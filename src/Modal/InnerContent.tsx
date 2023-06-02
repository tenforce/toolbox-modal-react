import { ReactNode, HTMLAttributes } from "react"
import bem from "../bem"
import classNames from "classnames"

import { className as parentClassName } from "./Container"

const b = bem(parentClassName, "item")
export const className = b()

export interface Props extends HTMLAttributes<HTMLDivElement> {
    extraClasses?: string
    children?: ReactNode
}

const InnerContent = function ({
    extraClasses = "",
    children,
    ...args
}: Props): JSX.Element {
    // Add modifiers
    const modifiers = {}
    // Add bem modifiers
    const bemModifiers = {}
    // Generate fullClassName based on base className, eventual modifiers (BEM or not) and possible extra classes
    const fullClassName = classNames(b(bemModifiers), modifiers, extraClasses)

    return (
        <div className={fullClassName} data-testid="item" {...args}>
            {children}
        </div>
    )
}

InnerContent.displayName = "Modal Inner Content"

export default InnerContent
