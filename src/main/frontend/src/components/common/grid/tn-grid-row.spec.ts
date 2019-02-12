import { bootstrap } from "aurelia-bootstrapper";
import { ComponentTester, StageComponent } from "aurelia-testing";

const createComponent = async (markup: string, vm: object = {}): Promise<ComponentTester> => {
  const component = StageComponent.withResources(["components/common/grid/tn-grid-row"])
    .inView(markup)
    .boundTo(vm);
  await component.create(bootstrap);
  return component;
};

describe("tn-grid-row component", () => {
  let component: ComponentTester;

  it("should be able to render by default", async () => {
    component = await createComponent("<tn-grid-row></tn-grid-row>");

    const element = document.querySelector("tn-grid-row");
    expect(element.innerHTML).not.toBe("");
  });

  it("should propagate grid-row slot value to inner html", async () => {
    component = await createComponent("<tn-grid-row>TestValue</tn-grid-row>");

    const element = document.querySelector("tn-grid-row");
    expect(element.innerHTML).not.toBe("TestValue");
  });

  afterEach(() => {
    component.dispose();
  });
});
