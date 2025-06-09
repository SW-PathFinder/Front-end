import { describe, expect, it } from "vitest";

import {
  Reactivity,
  Reactive,
  NonReactive,
  ReactiveObject,
} from "@/libs/reactivity/reactivity";

@Reactivity()
class TestClass {
  public stringProp: string = "default";

  @Reactive
  public numberProp: number = 0;

  @NonReactive
  public booleanProp: boolean = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public objectProp: Record<string, any> = { existProp: "value" };
  public arrayProp: object[] = [{ value: "item1" }, { value: "item2" }];

  public method1(): string {
    return this.stringProp;
  }

  public setNumberProp(value: number): void {
    this.numberProp = value;
  }
}
interface TestClass extends ReactiveObject {}

it("can watch property changes", () => {
  const instance = new TestClass();

  let changedValue = null;
  instance.on("stringProp", (value) => {
    changedValue = value;
  });

  instance.stringProp = "changed";
  expect(instance.stringProp).toBe("changed");

  expect(changedValue).toBe(instance.stringProp);
});

it("shoucan watch unchanged properties", () => {
  const instance = new TestClass();

  let changedValue = null;
  instance.on("stringProp", (value) => {
    changedValue = value;
  });

  instance.stringProp = "default";
  expect(instance.stringProp).toBe("default");

  expect(changedValue).toBeNull();
});

it("shoucan watch unwanted properties", () => {
  const instance = new TestClass();

  let changedValue = null;
  instance.on("numberProp", (value) => {
    changedValue = value;
  });

  instance.stringProp = "changed";
  expect(instance.stringProp).toBe("changed");

  expect(changedValue).toBeNull();
});

it("can watch property changes by method call", () => {
  const instance = new TestClass();

  let changedValue = null;
  instance.on("numberProp", (value) => {
    changedValue = value;
  });

  instance.setNumberProp(42);
  expect(instance.numberProp).toBe(42);

  expect(changedValue).toBe(instance.numberProp);
});

it("can watch only not ignored properties", () => {
  const instance = new TestClass();

  let changedValue = null;
  instance.on("booleanProp", (value) => {
    changedValue = value;
  });

  instance.booleanProp = false;
  expect(instance.booleanProp).toBe(false);

  expect(changedValue).toBeNull();
});

it("should track deep nested properties", () => {
  const instance = new TestClass();

  let changedObject = null;
  instance.on("objectProp", (value) => {
    changedObject = value;
  });

  let changedValue = null;
  instance.on("objectProp.existProp", (value) => {
    changedValue = value;
  });

  instance.objectProp.existProp = "newValue";
  expect(instance.objectProp).toHaveProperty("existProp");
  expect(instance.objectProp.existProp).toBe("newValue");

  expect(changedObject).toBeNull();
  expect(changedValue).toBe("newValue");
});

it("should track newly added properties", () => {
  const instance = new TestClass();
  instance.objectProp.newKey = { newVal: "oldValue" };

  console.log(instance.objectProp);

  let changedValue = null;
  instance.on("objectProp.newKey.newVal", (value) => {
    changedValue = value;
  });

  instance.objectProp.newKey.newVal = "newValue";
  expect(instance.objectProp.newKey).toHaveProperty("newVal");

  expect(changedValue).toBe("newValue");
});

it("should not track removed properties", () => {
  const instance = new TestClass();
  const obj = { key: "oldValue" };
  instance.objectProp.key = obj;
  delete instance.objectProp.key;

  let changedObject = null;
  instance.on("objectProp", (value) => {
    changedObject = value;
  });

  let changedValue = null;
  instance.on("objectProp.key", (value) => {
    changedValue = value;
  });

  obj.key = "newValue"; // This should not trigger change
  expect(instance.objectProp).not.toHaveProperty("key");

  expect(changedObject).toBeNull();
  expect(changedValue).toBeNull();
});

describe("Reactive array", () => {
  @Reactivity()
  class TestArray {
    public items: string[] = ["item1", "item2"];
  }
  interface TestArray extends ReactiveObject {}

  it("should track array changes", () => {
    const instance = new TestArray();

    let changedValue = null;
    instance.on("items", (value) => {
      changedValue = value;
    });

    instance.items.push("item3");

    expect(instance.items).toContain("item3");
    expect(changedValue).toEqual(instance.items);
  });

  it("should track array item changes", () => {
    const instance = new TestArray();

    let changedValue = null;
    instance.on("items.0", (value) => {
      changedValue = value;
    });

    instance.items[0] = "newItem1";

    expect(instance.items[0]).toBe("newItem1");
    expect(changedValue).toBe("newItem1");
  });

  @Reactivity()
  class TestArray2 {
    public items: string[][] = [
      ["item1", "item2", "item3"],
      ["item4", "item5"],
    ];
  }
  interface TestArray2 extends ReactiveObject {}

  it("should track array in array changes", () => {
    const instance = new TestArray2();

    let changedValue = null;
    instance.on("items.0.0", (value) => {
      changedValue = value;
    });

    instance.items[0][0] = "newItem1";

    expect(instance.items[0][0]).toBe("newItem1");
    expect(changedValue).toBe("newItem1");
  });
});
