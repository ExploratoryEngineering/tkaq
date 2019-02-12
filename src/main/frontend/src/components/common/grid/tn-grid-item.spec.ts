import { bootstrap } from "aurelia-bootstrapper";
import { ComponentTester, StageComponent } from "aurelia-testing";

const createComponent = async (markup: string, vm: object = {}): Promise<ComponentTester> => {
  const component = StageComponent.withResources(["components/common/grid/tn-grid-item"])
    .inView(markup)
    .boundTo(vm);
  await component.create(bootstrap);
  return component;
};

describe("tn-grid-item component", () => {
  let component: ComponentTester;

  it("should be able to render by default", async () => {
    component = await createComponent("<tn-grid-item></tn-grid-item>");

    const element = document.querySelector("tn-grid-item");
    expect(element.innerHTML).not.toBe("");
  });

  it("should by default have class 'grid__item--12'", async () => {
    component = await createComponent("<tn-grid-item></tn-grid-item>");

    const element = document.querySelector("tn-grid-item");
    expect(element.className).toContain("grid__item--12");
  });

  describe("props", () => {
    it("should add class 'tn-grid__item--no-stretch' after adding prop 'no-stretch'", async () => {
      component = await createComponent("<tn-grid-item no-stretch></tn-grid-item>");

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--no-stretch");
    });

    it("should add class 'tn-grid__item--no-flex' after adding prop 'no-flex'", async () => {
      component = await createComponent("<tn-grid-item no-flex></tn-grid-item>");

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--no-flex");
    });

    it("should add class 'tn-grid__item--2' after adding prop 'grid-size=\"2\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="2"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--2");
    });

    it("should add class 'tn-grid__item--3' after adding prop 'grid-size=\"3\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="3"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--3");
    });

    it("should add class 'tn-grid__item--4' after adding prop 'grid-size=\"4\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="4"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--4");
    });

    it("should add class 'tn-grid__item--6' after adding prop 'grid-size=\"6\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="6"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--6");
    });

    it("should add class 'tn-grid__item--8' after adding prop 'grid-size=\"8\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="8"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--8");
    });

    it("should add class 'tn-grid__item--9' after adding prop 'grid-size=\"9\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="9"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--9");
    });

    it("should add class 'tn-grid__item--12' after adding prop 'grid-size=\"12\"'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="12"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--12");
    });

    it("should add class 'tn-grid__item--12' after adding invalid value for prop 'grid-size'", async () => {
      component = await createComponent(`<tn-grid-item grid-size="18"></tn-grid-item>`);

      const element = document.querySelector(".tn-grid__item");
      expect(element.className).toContain("tn-grid__item--12");
    });
  });

  afterEach(() => {
    component.dispose();
  });
});
