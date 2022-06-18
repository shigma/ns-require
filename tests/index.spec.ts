import ns from '../src'
import { expect } from 'chai'

describe('ns-require', () => {
  it('basic support', () => {
    const scope = ns({
      namespace: 'koishi',
      prefix: 'plugin',
    })

    expect(scope.paths('foo-bar')).to.deep.equal(['koishi-plugin-foo-bar'])
    expect(scope.paths('foo-bar/baz')).to.deep.equal(['koishi-plugin-foo-bar/baz'])
    expect(scope.paths('koishi-plugin-foo-bar')).to.deep.equal(['koishi-plugin-foo-bar'])
    expect(scope.paths('@qux/foo-bar')).to.deep.equal(['@qux/koishi-plugin-foo-bar'])
    expect(scope.paths('@qux/foo-bar/baz')).to.deep.equal(['@qux/koishi-plugin-foo-bar/baz'])
    expect(scope.paths('@qux/koishi-plugin-foo-bar')).to.deep.equal(['@qux/koishi-plugin-foo-bar'])
  })

  it('with official scope', () => {
    const require = ns({
      namespace: 'koishi',
      prefix: 'plugin',
      official: 'koishijs',
    })

    expect(require.paths('foo-bar')).to.deep.equal(['@koishijs/plugin-foo-bar', 'koishi-plugin-foo-bar'])
    expect(require.paths('foo-bar/baz')).to.deep.equal(['@koishijs/plugin-foo-bar/baz', 'koishi-plugin-foo-bar/baz'])
    expect(require.paths('koishi-plugin-foo-bar')).to.deep.equal(['koishi-plugin-foo-bar'])
    expect(require.paths('@koishijs/plugin-foo-bar')).to.deep.equal(['@koishijs/plugin-foo-bar'])
    expect(require.paths('@qux/foo-bar')).to.deep.equal(['@qux/koishi-plugin-foo-bar'])
    expect(require.paths('@qux/foo-bar/baz')).to.deep.equal(['@qux/koishi-plugin-foo-bar/baz'])
    expect(require.paths('@qux/koishi-plugin-foo-bar')).to.deep.equal(['@qux/koishi-plugin-foo-bar'])
  })
})
