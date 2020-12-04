define(["require", "exports", "utils/Color"], function (require, exports, Color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StyleName;
    (function (StyleName) {
        StyleName["Fill"] = "fill";
        StyleName["Text"] = "text";
        StyleName["TextSize"] = "text-size";
        StyleName["TextColor"] = "text-color";
        StyleName["Padding"] = "padding";
        StyleName["Margin"] = "margin";
        StyleName["BorderColor"] = "border-color";
        StyleName["BorderWidth"] = "border-width";
        StyleName["BorderRadius"] = "border-radius";
        StyleName["WidgetType"] = "widget-type";
        StyleName["JustifyContent"] = "justify-content";
        StyleName["FlexDirection"] = "flex-direction";
        StyleName["AlignItems"] = "align-items";
        StyleName["DisableDAD"] = "disable-dad";
    })(StyleName || (StyleName = {}));
    const styles = {
        [StyleName.Fill]: {
            get: (widget) => {
                const val = widget.element.style.backgroundColor;
                const clr = new Color_1.default();
                clr.setColor(val);
                return clr.getHEX();
            },
            set: (widget, value) => {
                widget.element.style.backgroundColor = value;
            },
        },
        [StyleName.Text]: {
            get: (widget) => {
                return widget.element.innerText;
            },
            set: (widget, value) => {
                if (!widget.isContainer) {
                    widget.element.innerText = value;
                }
            },
        },
        [StyleName.TextSize]: {
            get: (widget) => {
                return parseInt(widget.element.style.fontSize) || 14;
            },
            set: (widget, value) => {
                widget.element.style.fontSize = value + 'px';
            },
        },
        [StyleName.TextColor]: {
            get: (widget) => {
                const val = widget.element.style.color || '#000';
                const clr = new Color_1.default();
                clr.setColor(val);
                return clr.getHEX();
            },
            set: (widget, value) => {
                widget.element.style.color = value;
            },
        },
        [StyleName.Padding]: {
            get: (widget) => {
                return parseInt(widget.element.style.padding) || 0;
            },
            set: (widget, value) => {
                widget.element.style.padding = value + 'px';
            },
        },
        [StyleName.Margin]: {
            get: (widget) => {
                return parseInt(widget.element.style.margin) || 0;
            },
            set: (widget, value) => {
                widget.element.style.margin = value + 'px';
            },
        },
        [StyleName.BorderColor]: {
            get: (widget) => {
                const val = widget.element.style.borderColor || '#000';
                const clr = new Color_1.default();
                clr.setColor(val);
                return clr.getHEX();
            },
            set: (widget, value) => {
                widget.element.style.borderColor = value;
            },
        },
        [StyleName.BorderWidth]: {
            get: (widget) => {
                return parseInt(widget.element.style.borderWidth) || 0;
            },
            set: (widget, value) => {
                widget.element.style.borderStyle = 'solid';
                widget.element.style.borderWidth = value + 'px';
            },
        },
        [StyleName.BorderRadius]: {
            get: (widget) => {
                return parseInt(widget.element.style.borderRadius) || 0;
            },
            set: (widget, value) => {
                widget.element.style.borderRadius = value + 'px';
            },
        },
        [StyleName.WidgetType]: {
            get: (widget) => {
                return widget.containerType;
            },
            set: (widget, value) => {
                widget.containerType = value;
            },
        },
        [StyleName.JustifyContent]: {
            get: (widget) => {
                return widget.element.style.justifyContent || 'flex-start';
            },
            set: (widget, value) => {
                widget.element.style.justifyContent = value;
            },
        },
        [StyleName.FlexDirection]: {
            get: (widget) => {
                return widget.element.style.flexDirection || 'row';
            },
            set: (widget, value) => {
                widget.element.style.flexDirection = value;
            },
        },
        [StyleName.AlignItems]: {
            get: (widget) => {
                return widget.element.style.alignItems || 'stretch';
            },
            set: (widget, value) => {
                widget.element.style.alignItems = value;
            },
        },
        [StyleName.DisableDAD]: {
            get: (widget) => {
                return !widget.isDADEnabled;
            },
            set: (widget, value) => {
                widget.isDADEnabled = !value;
            },
        },
    };
    function getInputByStyleName(styleName) {
        if (styleName === StyleName.WidgetType
            || styleName === StyleName.JustifyContent
            || styleName === StyleName.FlexDirection
            || styleName === StyleName.AlignItems) {
            return 'select';
        }
        return 'input';
    }
    function getMultiProxy(styleName, widgets) {
        return {
            get: () => {
                let commonVal = styles[styleName].get(widgets[0]);
                for (let i = 1; i < widgets.length; i++) {
                    const styleVal = styles[styleName].get(widgets[i]);
                    if (commonVal === styleVal) {
                        commonVal = styleVal;
                    }
                    else {
                        return undefined;
                    }
                }
                return commonVal;
            },
            set: (value) => {
                widgets.forEach(w => {
                    styles[styleName].set(w, value);
                });
            },
        };
    }
    class SidebarController {
        constructor(container) {
            this.container = container;
            this.styleProxies = new Map();
            this.selectionOptionsContainer = container.querySelector('.selected-widgets-options');
            Object.keys(styles).forEach(s => this.attachEvent(s));
        }
        attachEvent(styleName) {
            this.getOptionElement(styleName).addEventListener('change', (e) => {
                const styleProxy = this.styleProxies.get(styleName);
                if (styleProxy) {
                    let val;
                    if (styleName === StyleName.DisableDAD) {
                        val = e.target.checked;
                    }
                    else {
                        val = e.target.value;
                    }
                    styleProxy.set(val);
                }
                this.update();
            });
        }
        getOptionElement(styleName) {
            return this.container.querySelector('.' + styleName);
        }
        update() {
            const hasContainer = this.styleProxies.get(StyleName.WidgetType).get() !== 'not';
            const hide = hasContainer ? 'none' : 'block';
            const show = hasContainer ? 'block' : 'none';
            this.getOptionElement(StyleName.Text).style.display = hide;
            this.getOptionElement(StyleName.TextSize).style.display = hide;
            this.getOptionElement(StyleName.TextColor).style.display = hide;
            this.getOptionElement(StyleName.JustifyContent).style.display = show;
            this.getOptionElement(StyleName.FlexDirection).style.display = show;
            this.getOptionElement(StyleName.AlignItems).style.display = show;
            this.getOptionElement(StyleName.DisableDAD).style.display = show;
            this.styleProxies.forEach((proxy, styleName) => {
                const styleValue = proxy.get();
                const input = this.getStyleInput(styleName);
                if (styleName === StyleName.DisableDAD) {
                    input.checked = styleValue === undefined ? false : styleValue;
                }
                else {
                    input.value = styleValue === undefined ? '' : styleValue;
                }
            });
        }
        getStyleInput(styleName) {
            return this.container.querySelector(`.${styleName} ${getInputByStyleName(styleName)}`);
        }
        onSelectionUpdated(widgets) {
            if (widgets.length > 0) {
                Object.keys(styles).forEach(styleName => {
                    this.styleProxies.set(styleName, getMultiProxy(styleName, widgets));
                });
                this.update();
                this.selectionOptionsContainer.style.display = 'block';
            }
        }
        onSelectionClear() {
            this.selectionOptionsContainer.style.display = 'none';
            this.styleProxies.clear();
        }
    }
    exports.default = SidebarController;
});
