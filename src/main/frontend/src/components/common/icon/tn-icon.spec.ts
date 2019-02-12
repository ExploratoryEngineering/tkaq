import { ComponentTester } from "aurelia-testing";
import { ComponentCreator } from "Test/util";

/* Initiate the component creator with path to needed resources */
const creator = new ComponentCreator(["components/common/icon/tn-icon"]);

describe("tn-icon component", () => {
  let component: ComponentTester;

  it("should have default material classes added", async () => {
    component = await creator.createComponent("<tn-icon></tn-icon>");

    const iconElement = document.querySelector(".tn-icon");
    expect(iconElement.className).toContain("material-icons");
  });

  it("should propagate icon slot value to inner html", async () => {
    component = await creator.createComponent("<tn-icon>more_vert</tn-icon>");

    const iconElement = document.querySelector(".tn-icon");
    expect(iconElement.innerHTML).toContain("more_vert");
  });

  it("should by default have class 'tn-icon--medium'", async () => {
    component = await creator.createComponent("<tn-icon></tn-icon>");

    const iconElement = document.querySelector(".tn-icon");
    expect(iconElement.className).toContain("tn-icon--medium");
  });

  describe("props", () => {
    it("should add class 'tn-icon--small' after adding prop 'small'", async () => {
      component = await creator.createComponent("<tn-icon small></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--small");
    });

    it("should add class 'tn-icon--large' after adding prop 'large'", async () => {
      component = await creator.createComponent("<tn-icon large></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--large");
    });

    it("should add class 'tn-icon--huge' after adding prop 'huge'", async () => {
      component = await creator.createComponent("<tn-icon huge></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--huge");
    });

    it("should add class 'tn-icon--colored' after adding prop 'colored'", async () => {
      component = await creator.createComponent("<tn-icon colored></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--colored");
    });

    it("should add class 'tn-icon--centered' after adding prop 'center'", async () => {
      component = await creator.createComponent("<tn-icon center></tn-icon>");
      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--centered");
    });

    it("should add class 'tn-icon--margin-right' after adding prop 'left'", async () => {
      component = await creator.createComponent("<tn-icon left></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--margin-right");
    });

    it("should add class 'tn-icon--margin-left' after adding prop 'right'", async () => {
      component = await creator.createComponent("<tn-icon right></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--margin-left");
    });

    it("should add class 'tn-icon--no-margin' after adding prop 'no-margin'", async () => {
      component = await creator.createComponent("<tn-icon no-margin></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--no-margin");
    });

    it("should add class 'tn-icon--clickable' after adding prop 'clickable'", async () => {
      component = await creator.createComponent("<tn-icon clickable></tn-icon>");

      const iconElement = document.querySelector(".tn-icon");
      expect(iconElement.className).toContain("tn-icon--clickable");
    });
  });

  afterEach(() => {
    component.dispose();
  });
});
