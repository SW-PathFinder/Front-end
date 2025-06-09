/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

type NestedNonFunctionKeys<
  T,
  TKeys extends keyof T & (string | number) = keyof T & (string | number),
  TPrefix extends string = "",
> = {
  [K in TKeys]: K extends `${TPrefix}${string | number}`
    ? T[K] extends Function
      ? never
      : T[K] extends Array<infer U>
        ?
            | `${K}`
            | `${K}.${number}`
            | `${K}.${number}.${NestedNonFunctionKeys<U>}`
        : T[K] extends object
          ? `${K}` | `${K}.${NestedNonFunctionKeys<T[K]>}`
          : `${K}`
    : never;
}[TKeys];

type GetPropertyByNestedKey<
  T,
  TNestedKey extends string | number,
> = TNestedKey extends `${infer TKey extends keyof T & (string | number)}.${infer TRest}`
  ? GetPropertyByNestedKey<T[TKey], TRest>
  : TNestedKey extends keyof T & (string | number)
    ? T[TNestedKey]
    : never;

export interface ReactiveObject {
  on<TThis extends object, TKey extends NestedNonFunctionKeys<TThis>>(
    this: TThis,
    propertyKey: TKey,
    callback: (
      // @ts-expect-error FIXME later
      propertyKey: NestedNonFunctionKeys<TThis, TKey>,
      value: GetPropertyByNestedKey<TThis, TKey>,
    ) => void,
    /** @default true */
    exact?: boolean,
  ): void;
  onAny<TThis extends object>(
    this: TThis,
    callback: <TKey extends NestedNonFunctionKeys<TThis>>(
      propertyKey: TKey,
      value: GetPropertyByNestedKey<TThis, TKey>,
    ) => void,
  ): void;
}

const REACTIVITY_PREFIX = "reactivity:";
const reactiveMetadataKey = Symbol(`${REACTIVITY_PREFIX}reactive`);
const ignoreKeysMetadataKey = Symbol(`${REACTIVITY_PREFIX}ignoreKeys`);
const ignoreMetadataKey = Symbol(`${REACTIVITY_PREFIX}ignore`);
const storeSymbol = Symbol(`${REACTIVITY_PREFIX}store`);
const eventTargetSymbol = Symbol(`${REACTIVITY_PREFIX}eventTarget`);

export const Reactive = ((target: object, propertyKey: string | symbol) => {
  Reflect.defineMetadata(
    ignoreKeysMetadataKey,
    [
      ...(Reflect.getMetadata(ignoreKeysMetadataKey, target) ?? []),
      propertyKey,
    ],
    target,
  );
  Reflect.defineMetadata(ignoreMetadataKey, false, target, propertyKey);
}) as PropertyDecorator;
export const NonReactive = ((target: object, propertyKey: string | symbol) => {
  Reflect.defineMetadata(
    ignoreKeysMetadataKey,
    [
      ...(Reflect.getMetadata(ignoreKeysMetadataKey, target) ?? []),
      propertyKey,
    ],
    target,
  );
  Reflect.defineMetadata(ignoreMetadataKey, true, target, propertyKey);
}) as PropertyDecorator;

export function isReactive(target: unknown): target is ReactiveObject {
  if (typeof target !== "object" || target === null) return false;
  return Reflect.getMetadata(reactiveMetadataKey, target) === true;
}

type Class<T = any, TArgs extends unknown[] = any[]> = new (
  ...args: TArgs
) => T;

export const Reactivity = (defaultReactive = true) =>
  ((target: Class) => {
    // TODO: 이 시점에서 최상위 constructor를 후킹해서 proxy 객체를 반환하도록 변경

    return class extends target implements ReactiveObject {
      private [eventTargetSymbol] = new EventTarget();

      constructor(...args: any[]) {
        super(...args);
        NonReactive(this, eventTargetSymbol);

        return watch(
          this,
          (p, v) => {
            this[eventTargetSymbol].dispatchEvent(
              new CustomEvent(`${REACTIVITY_PREFIX}any`, {
                detail: { propertyKey: p, value: v },
              }),
            );
          },
          (target, targetPropertyKey) => {
            const ignore = Reflect.getMetadata(
              ignoreMetadataKey,
              target,
              targetPropertyKey,
            ) as boolean | undefined;

            if (ignore === undefined) return defaultReactive;
            else return !ignore;
          },
        );
      }

      on(
        propertyKey: any,
        callback: (propertyKey: any, property: any) => void,
        exact: boolean = true,
      ): void {
        this.onAny((p, v) => {
          if (!String(p).startsWith(String(propertyKey))) return;
          if (exact && p !== propertyKey) return;
          callback(p, v);
        });
      }

      onAny(callback: (propertyKey: any, value: any) => void): void {
        this[eventTargetSymbol].addEventListener(`${REACTIVITY_PREFIX}any`, ((
          e: CustomEvent<{ propertyKey: string | number; value: any }>,
        ) => {
          callback(e.detail.propertyKey, e.detail.value);
        }) as any);
      }
    };
  }) as ClassDecorator;

function watch<T = any>(
  target: T,
  callback: (propertyKey: string, nextValue: any) => void,
  filter?: (target: any, targetPropertyKey: string) => boolean,
  prefix?: string,
): T;
function watch(
  target: any,
  callback: (propertyKey: string, nextValue: any) => void,
  filter?: (target: any, targetPropertyKey: string) => boolean,
  prefix = "",
) {
  if (!target || typeof target !== "object") return target;
  if (Object.getPrototypeOf(target) === null) return target;
  if (isReactive(target)) return target; // Already reactive
  Reflect.defineMetadata(reactiveMetadataKey, true, target);

  if (Array.isArray(target)) {
    // watchArrayChange(target, (methodName, arr) => {
    //   console.log(`watchArrayChange: ${target} ${methodName} called`);
    //   for (const index in arr) {
    //     arr[index] = watch(arr[index], callback, filter, `${prefix}${index}`);
    //   }
    //   callback(prefix, arr);
    // });

    target = new Proxy(target, {
      get(target, p, receiver) {
        const result = Reflect.get(target, p, receiver);
        return result;
      },
      set(target, p, newValue, receiver) {
        if (typeof p === "symbol" || (filter && !filter(target, p)))
          return Reflect.set(target, p, newValue, receiver);

        // console.log(
        //   `Proxy: Setting property: ${prefix}${p.toString()} to ${newValue}`,
        // );
        const prevValue = target[p as any];
        if (prevValue === newValue) return true;

        // unwatch previous value if it was reactive
        // TODO: revert reactivity of previous value

        newValue = watch(
          newValue,
          callback,
          filter,
          `${prefix}${p.toString()}.`,
        );

        const result = Reflect.set(target, p, newValue, receiver);
        if (result) callback(`${prefix}${p.toString()}`, newValue);
        return result;
      },
      deleteProperty(target, p) {
        if (typeof p === "symbol") return Reflect.deleteProperty(target, p);

        // console.log(`Proxy: Deleting property: ${prefix}${p.toString()}`);
        const result = Reflect.deleteProperty(target, p);
        if (result) callback(`${prefix}${p.toString()}`, undefined);
        return result;
      },
    });

    return target;
  }

  const allKeys = [...Object.keys(target)];
  target[storeSymbol] = target[storeSymbol] || new Map();

  for (const key of allKeys) {
    if (filter && !filter(target, key)) continue;

    const propertyKey = `${prefix}${key.toString()}`;
    const value = watch(target[key], callback, filter, `${propertyKey}.`);

    target[storeSymbol].set(key, value);

    Object.defineProperty(target, key, {
      get() {
        return target[storeSymbol].get(key);
      },
      set(next) {
        const prev = target[storeSymbol].get(key);
        if (prev === next) return; // No change, do not trigger callback

        next = watch(next, callback, filter, `${propertyKey}.`);

        target[storeSymbol].set(key, next);
        callback(propertyKey, next);
      },
    });
  }

  return target;
}

// TODO: Implement unwatch functionality
// watch한
// function unwatch<T = any>() {}

// TODO: Implement array reactivity for optimization
// const arrayMutableMethods = [
//   "push",
//   "pop",
//   "shift",
//   "unshift",
//   "splice",
//   "sort",
//   "reverse",
// ];
// function watchArrayChange(
//   arr: any[],
//   callback: (methodName: string, arr: any[]) => void,
// ) {
//   for (const method of arrayMutableMethods) {
//     const originalMethod = arr[method as any];
//     if (typeof originalMethod !== "function") continue;

//     arr[method as any] = function (...args: any[]) {
//       const result = originalMethod.apply(this, args);

//       callback(method, this);
//       return result;
//     };
//   }
// }
