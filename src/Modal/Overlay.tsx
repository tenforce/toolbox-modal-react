import { HTMLAttributes } from "react"

import bem from "../bem"
import classNames from "classnames"
import { className as parentClassName } from "./Container"

const b = bem(parentClassName, "overlay")
export const className = b()

export interface Props extends HTMLAttributes<HTMLDivElement> {
    extraClasses?: string
    isHidden?: boolean
    isLightColored?: boolean
    isTransparent?: boolean
    onClose?: (event: React.MouseEvent) => void
}

const Overlay = ({
    extraClasses = "",
    isHidden = false,
    isLightColored = false,
    isTransparent = false,
    onClose,
    ...args
}: Props): JSX.Element => {
    // Add modifiers
    const modifiers = {}

    // Add bem modifiers
    const bemModifiers = {
        isHidden: isHidden,
        light: isLightColored,
        transparent: isTransparent,
    }

    // Generate fullClassName based on base className, eventual modifiers (BEM or not) and possible extra classes
    const fullClassName = classNames(b(bemModifiers), modifiers, extraClasses)

    return (
        <div
            className={fullClassName}
            onClick={onClose}
            data-testid="overlay"
            {...args}
        />
    )
}

Overlay.displayName = "Modal Overlay"

export default Overlay
