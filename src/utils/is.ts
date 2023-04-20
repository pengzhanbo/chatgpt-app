type RecordObject = Record<string, any>

const toString = Object.prototype.toString

export const checkType = (val: any): string => toString.call(val).slice(8, -1)

export const isObject = (val: unknown): val is RecordObject => {
  return typeof val === 'object' && val !== null
}

export const isArray = (val: unknown): val is any[] => Array.isArray(val)

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const isBoolean = (val: unknown): val is boolean => {
  return typeof val === 'boolean'
}

export const isEmpty = (val?: unknown): val is undefined | null => {
  return val === undefined || val === null
}

export const isEmptyObject = (val: unknown): val is RecordObject => {
  if (!isObject(val)) {
    return false
  }
  return (
    Object.keys(val).length === 0 &&
    Object.getOwnPropertySymbols(val).length === 0
  )
}

export const isDef = <T = any>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

export const hasOwn = <T extends object, K extends keyof T>(
  val: T,
  key: K,
): key is K => {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export const isHttp = (url: string): boolean => {
  return /^(https?:)?\/\//i.test(url)
}
