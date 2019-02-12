import { bootstrap } from "aurelia-bootstrapper";
import { ComponentTester, StageComponent } from "aurelia-testing";

const createComponent = async (markup: string, vm: object = {}): Promise<ComponentTester> => {
  const component = StageComponent.withResources(["components/common/grid/tn-grid"])
    .inView(markup)
    .boundTo(vm);
  await component.create(bootstrap);
  return component;
};

describe("tn-grid component", () => {
  it("should be able to render by default", async () => {
    await createComponent("<tn-grid></tn-grid>");

    const element = document.querySelector("tn-grid");
    expect(element.innerHTML).not.toBe("");
  });

  it("should propagate grid slot value to inner html", async () => {
    createComponent("<tn-grid>TestValue</tn-grid>");

    const element = document.querySelector("tn-grid");
    expect(element.innerHTML).not.toBe("TestValue");
  });
});
