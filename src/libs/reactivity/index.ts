import "reflect-metadata";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Reactive {
  on(property: string | number | symbol, callback: (value: any) => void): void;
  onAny(
    callback: (property: string | number | symbol, value: any) => void,
  ): void;
}

const reactiveMetadataKey = Symbol("reactivity:reactive");
const storeSymbol = Symbol("reactivity:store");

export const Reactive = ((target: object, propertyKey: string | symbol) => {
  Reflect.defineMetadata(reactiveMetadataKey, true, target, propertyKey);
}) as PropertyDecorator;
export const NonReactive = ((target: object, propertyKey: string | symbol) => {
  Reflect.defineMetadata(reactiveMetadataKey, false, target, propertyKey);
}) as PropertyDecorator;

type Class<T = any, TArgs extends unknown[] = any[]> = new (
  ...args: TArgs
) => T;
export const Reactivity = (defaultReactive = true) =>
  ((target: Class) => {
    return class extends target implements Reactive {
      private _eventTarget = new EventTarget();
      private _anyTarget = new EventTarget();

      constructor(...args: any[]) {
        super(...args);

        NonReactive(this, "_eventTarget");
        NonReactive(this, "_anyTarget");

        watchProperties(
          this,

          (p, v) => {
            this._eventTarget.dispatchEvent(
              new CustomEvent(`reactivity:${String(p)}`, {
                detail: { value: v },
              }),
            );
            this._anyTarget.dispatchEvent(
              new CustomEvent("reactivity:any", {
                detail: { property: p, value: v },
              }),
            );
          },
          (t, k) =>
            Reflect.getMetadata(reactiveMetadataKey, t, k) ?? defaultReactive,
        );
      }

      on(
        event: string,
        callback: (property: string | number | symbol) => void,
      ): void {
        this._eventTarget.addEventListener(event, ((
          e: CustomEvent<{ value: any }>,
        ) => {
          callback(e.detail.value);
        }) as any);
      }

      onAny(
        callback: (property: string | number | symbol, value: any) => void,
      ): void {
        this._anyTarget.addEventListener("reactivity:any", ((
          e: CustomEvent<{ property: string | number | symbol; value: any }>,
        ) => {
          callback(e.detail.property, e.detail.value);
        }) as any);
      }
    };
  }) as ClassDecorator;

function watchProperties(
  target: any,
  callback: (p: number | string | symbol, next: any) => void,
  filter?: (target: any, key: string | symbol) => boolean,
) {
  if (!target || typeof target !== "object") return target;
  if (Object.getPrototypeOf(target) === Object.prototype) return target;

  const allKeys = [
    ...Object.keys(target),
    ...Object.getOwnPropertySymbols(target),
  ];
  if (allKeys.includes(storeSymbol)) return target; // Already watched

  target[storeSymbol] = target[storeSymbol] || new Map();

  for (const key of allKeys) {
    if (filter && !filter(target, key)) continue;

    const value = target[key];
    target[storeSymbol].set(key, value);

    Object.defineProperty(target, key, {
      get() {
        // console.log(`Accessing property: ${String(key)}`);
        return target[storeSymbol].get(key);
      },
      set(next) {
        // console.log(`Setting property: ${String(key)} to ${next}`);
        const prev = target[storeSymbol].get(key);
        if (prev === next) return; // No change, do not trigger callback

        target[storeSymbol].set(key, next);
        callback(key, next);
      },
    });

    if (Array.isArray(value)) {
      watchArrayChange(value, (methodName, next) => {
        callback(`${String(key)}`, next);
      });
    } else if (typeof value === "object" && value !== null) {
      // Recursively watch properties of nested objects
      watchProperties(
        value,
        (p, next) => {
          callback(`${String(key)}.${String(p)}`, next);
        },
        filter,
      );
    }
  }

  return target;
}

const arrayMutableMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];
function watchArrayChange(
  arr: any[],
  callback: (methodName: string, next: any) => void,
) {
  for (const method of arrayMutableMethods) {
    const originalMethod = arr[method as any];
    if (typeof originalMethod !== "function") continue;

    arr[method as any] = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      callback(method, this);
      return result;
    };
  }
}
