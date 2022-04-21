import { isAbsolute, resolve } from 'path'

function ns(options: ns.Options) {
  return new ns.Scope(options)
}

namespace ns {
  export function unwrapExports(module: any) {
    return module?.default || module
  }

  export interface Options {
    namespace: string
    prefix: string
    official?: string
    dirname?: string
  }

  export class Scope {
    private prefixes: string[]

    constructor(public options: Options) {
      this.prefixes = [`${options.namespace}-${options.prefix}-`]
      if (options.official) {
        this.prefixes.push(`@${options.official}/${options.prefix}-`)
      }
    }

    private throwError(name: string): never {
      throw new Error(`cannot resolve ${this.options.prefix} "${name}"`)
    }

    paths(name: string) {
      // absolute path
      if (isAbsolute(name)) {
        return [name]
      }

      // relative path
      if (name.startsWith('./') || name.startsWith('../')) {
        if (this.options.dirname) {
          return [resolve(this.options.dirname, name)]
        } else {
          this.throwError(name)
        }
      }

      // full package path
      if (this.prefixes.some(prefix => name.startsWith(prefix))) {
        return [name]
      }

      // scoped package path
      if (name[0] === '@') {
        const index = name.indexOf('/')
        if (index < 0) this.throwError(name)
        const scope = name.slice(0, index + 1)
        name = name.slice(index + 1)
        if (!name.startsWith(this.prefixes[0])) {
          name = this.prefixes[0] + name
        }
        return [scope + name]
      }

      // normal package path
      return this.prefixes.map(prefix => prefix + name).reverse()
    }

    require(name: string) {
      if (typeof name === 'object') {
        return name
      }
      const path = this.resolve(name)
      const exports = require(path)
      return ns.unwrapExports(exports)
    }

    resolve(name: string) {
      const modules = this.paths(name)
      for (const path of modules) {
        try {
          return require.resolve(path)
        } catch {}
      }
      this.throwError(name)
    }
  }
}

export = ns
