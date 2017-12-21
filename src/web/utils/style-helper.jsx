import React, { Component } from 'react';

const css = [];

const collectOrRender = function(styles) {
    let renderedCollection = [];

    for (let i = 0, l = styles.length; i < l; i++) {
        const stylesFile = styles[i];

        // is browser
        if (typeof window !== 'undefined') {
            renderedCollection[stylesFile._insertCss()];
        }

        css.push(stylesFile._getCss());
    }

    return renderedCollection;
};

export function styleHelper(ComposedComponent, styles) {
    return class Styles extends Component {
        componentWillMount() {
            this.styleRemovers = collectOrRender(styles);
        }

        componentWillUnmount() {
            setTimeout(() => {
                for (let i = 0, l = this.styleRemovers.length; i < l; i++) {
                    let styleRemover = this.styleRemovers[i];
                    typeof styleRemover === 'function' && styleRemover();
                }
            }, 0);
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    };
}

export function renderStyles() {
    return css.join('');
}
