import React from 'react'

import { internal } from '../../../core/src/utility/internal.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'

import { createCssFunction } from '../../../core/src/features/css.js'

/** @typedef {import('../../../core/src').Config} Config */
/** @typedef {import('../../../core/src').GroupSheet} GroupSheet */

const createCssFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) => (
	createCssFunctionMap(config, () => {
		const css = createCssFunction(config, sheet)

		const styled = (...args) => {
			const {defaultProps, rest} = extractDefaultProps(...args)
			const cssComponent = css(...rest)
			const DefaultType = cssComponent[internal].type

			const styledComponent = React.forwardRef((props, ref) => {
				const Type = props && props.as || defaultProps.as || DefaultType

				const { props: forwardProps, deferredInjector } = cssComponent(props)

				delete forwardProps.as

				forwardProps.ref = ref

				if (deferredInjector) {
					return React.createElement(React.Fragment, null, React.createElement(Type, {...defaultProps, ...forwardProps}), React.createElement(deferredInjector, null))
				}

				return React.createElement(Type, {...defaultProps, ...forwardProps})
			})

			const toString = () => cssComponent.selector

			styledComponent.className = cssComponent.className
			styledComponent.displayName = `Styled.${DefaultType.displayName || DefaultType.name || DefaultType}`
			styledComponent.selector = cssComponent.selector
			styledComponent.toString = toString
			styledComponent[internal] = cssComponent[internal]

			return styledComponent
		}

		return styled
	})
)

const extractDefaultProps = (...args) => {
	let defaultProps = {};
	args.forEach(arg => {
		if (arg.defaultProps) {
			defaultProps = {...defaultProps, ...arg.defaultProps};
			delete arg.defaultProps;
		}
	})
	return {defaultProps, rest:args}
}
