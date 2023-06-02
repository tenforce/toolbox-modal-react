toolbox-modal-react
==============================================================================

Tenforce toolbox modal component

### Installation

You will **need** to have an html element in the body (preferebly div as a child of the body) with the id that matches the `Modal/containerSelector` parameter, as that's where react portals will insert your modals into.

## Base components
### Modal
#### Description
A component that when shown lays an overlay over the screen and displays content at a specific location. When the overlay is clicked it should close.
Its child is Container
#### Parameters

- `isShown`: Boolean, whether the modal is visible.
- `containerSelector`: String, the CSS selector of the container where **all modals will be inserted into**. Default: `#modals`
- `containerProps`: Props for the container.
- `ovarlayProps`: Props for the ovarlay.
- `contentProps`: Props for the content.
- `innerContentProps`: Props for the innerContent.
- `focusTrapProps`: Props for the focusTrap.

### Container
#### Description
This component is a combination of an Overlay and Content.
Its children are Overlay and Content.
#### Parameters
- `animationDuration`: Number, duration of the animation.
- `isCenterPositioned`: Boolean, whether the container should be center positioned.
- `isCenterFixedPositioned`: Boolean, whether the container should be center fixed positioned.
- `isTopFixedPositioned`: Boolean, whether the container should be top fixed positioned.
- `isAbsolutePositioned`: Boolean, whether the container should be absolute positioned.
- `blockInteraction`: Boolean, whether the modal should block any interaction.
- `blockOverlayInteraction`: Boolean, whether the overlay should block interaction with the elements in the background.
- `shouldCloseOnEscape`: Boolean, whether the modal should close on pressing Esc.
- `targetSelector`: String, CSS selector of the trigger where the popup will appear. If empty **and** there is a fixed parent element, the popup will be fullscreen.
- `targetElement`: Element or null, the HTML Element of the trigger where the popup should appear. It will only be taken into account, when the `targetSelector` is empty.
- `targetRef`: `RefObject<HTMLElement>` or null, the refObject of the trigger where the popup should appear. It will only be taken into account, when the `targetSelector` and `targetElement` are empty.
- `horizontalOffset`: Number, the horizontal offset of the content in relation to the targeted element.
- `verticalOffset`: Number, the vertical offset of the content in relation to the targeted element.
- `extraClasses`: String, classes to be added to this component.
- `onClose`: Function, to be called when the overlay is pressed.
- `willClose`: Function, to be called before the modal will be closed.
- `ovarlayProps`: Props for the ovarlay.
- `contentProps`: Props for the content.
- `innerContentProps`: Props for the innerContent.

### Content
#### Description
Component that contains the actual content of the modal.
#### Parameters
- `innerContentProps`: Props for the innerContent.
- `isShown`: Boolean, whether the modal is visible.
- `targetElement`: Element or null, the HTML Element of the trigger where the popup should appear. It will only be taken into account, when the `targetSelector` is empty.
- `targetRef`: `RefObject<HTMLElement>` or null, the refObject of the trigger where the popup should appear. It will only be taken into account, when the `targetSelector` and `targetElement` are empty.
- `horizontalOffset`: Number, the horizontal offset of the content in relation to the targeted element.
- `verticalOffset`: Number, the vertical offset of the content in relation to the targeted element.
- `isFixed`: Function that calculates if the position of the modal is fixed or not.
- `extraClasses`: String, classes to be added to this component.

### Overlay
#### Description
Component that is the colored overlay that lays over the screen when the modal is shown.
#### Parameters
- `extraClasses`: String, classes to be added to this component.
- `isHidden`: Boolean, whether the overlay is visible.
- `isLightColored`: Boolean, whether the overlay should be the default dark or a light version(0.3 opacity).
- `isTransparent`: Boolean, whether the overlay should be the default dark or transparent.
- `onClose`: Function, to be called when the overlay is pressed.

## Usage
See the example in `example/src/index.tsx`.

```
<div id={containerSelector}/>

<Action
    content="Modal trigger"
    onClick={() => this.setState({ isShown: true })}
    isLabel={false}
    actionType={ActionType.button}
    id={targetElement}
/>

<Modal
    isShown={isShown}
    containerSelector={containerSelector}
    containerProps={{
        extraClasses: extraClasses,
        isTopFixedPositioned: isTopFixedPositioned,
        isCenterPositioned: isCenterPositioned,
        isAbsolutePositioned: isAbsolutePositioned,
        isDropDown: isDropDown,
        shouldCloseOnEscape: shouldCloseOnEscape,
        targetSelector: targetSelector,
        targetElement: targetElement ? targetObjectElement : null,
        onClose: this.onClose,
        willClose: () => {
        // You can provide either a boolean or a promise that resolves to one.
        // If it resolves to "true", it modal will close, if it doesn't, the closing will be interrupted.
        // By default, "willClose" will return "true".
        return confirm("Are you sure you want to close the dialog?")
        // return new Promise(function(resolve, reject) {
        //  setTimeout(() => {resolve(true)}, 5000)
        // })
    }
    }}
>
    <div className="theme-bubble bg-cloud tw-px-4 tw-py-2">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
    </div>
</Modal>
```