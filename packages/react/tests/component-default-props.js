import { createStitches } from '../src/index.js'

describe('React Component with default props', () => {
	test('default props get passed through', () => {
		const { styled } = createStitches()

		const component = styled('a', {
			color: 'red',
			defaultProps: {
				href: '#',
			},
		}).render()

		expect(component.props.href).toBe('#')
	})

	test('merges default props giving precedence to last prop when there are name clashes', () => {
		const { styled } = createStitches()

		const component = styled(
			'a',
			{
				color: 'red',
				defaultProps: {
					href: '#',
				},
			},
			{
				defaultProps: {
					href: '#last',
				},
			},
		).render()
		expect(component.props.href).toBe('#last')
	})

	test('uses `as` prop', () => {
		const { styled } = createStitches()

		const component = styled('a', {
			defaultProps: {
				as: 'button',
			},
		}).render()
		console.log(component)
		expect(component.type).toBe('button')
	})
})
