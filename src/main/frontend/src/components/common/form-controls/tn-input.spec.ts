import { ComponentTester } from "aurelia-testing";
import { ComponentCreator, delay } from "Test/util";
import { TnInput } from "./tn-input";

/* Initiate the component creator with path to needed resources */
const creator = new ComponentCreator(["components/common/form-controls/tn-input"]);

const underlineSelector = ".form-group__focus-underline";
const customElementSelector = "tn-input";
const errorSelector = ".form-group__error-text";
const maxLengthSelector = ".form-group__max-length";
const labelSelector = ".form-group__label";
const inputSelector = ".form-group__input";

describe("tn-input component", () => {
  let component: ComponentTester;

  it("should be able to render by default", async () => {
    component = await creator.createComponent("<tn-input></tn-input>");

    const element = document.querySelector(customElementSelector);
    expect(element.innerHTML).not.toBe("");
  });

  describe("props", () => {
    it("should add class 'tn-input--inline' after adding prop 'inline'", async () => {
      component = await creator.createComponent("<tn-input inline></tn-input>");

      const inputElement = document.querySelector(customElementSelector);

      expect(inputElement.className).toContain("tn-input--inline");
    });

    it("should add class 'form-group__label--floating' after adding prop 'floating-label'", async () => {
      component = await creator.createComponent("<tn-input floating-label></tn-input>");

      const inputElement = document.querySelector(labelSelector);

      expect(inputElement.className).toContain("form-group__label--floating");
    });

    it("should add property 'autocomplete' after adding prop 'autocomplete'", async () => {
      component = await creator.createComponent("<tn-input autocomplete></tn-input>");

      const inputElement = document.querySelector(inputSelector);

      expect(inputElement.getAttribute("autocomplete")).toContain("on");
    });

    it("should add property 'readonly' and readonly classes after adding prop 'readonly'", async () => {
      component = await creator.createComponent("<tn-input readonly></tn-input>");

      const inputElement = document.querySelector(inputSelector);
      const labelElement = document.querySelector(labelSelector);
      const underlineElement = document.querySelector(underlineSelector);

      expect(inputElement.getAttribute("readonly")).not.toBe(null);
      expect(labelElement.className).toContain("form-group__label--readonly");
      expect(underlineElement.className).toContain("form-group__focus-underline--readonly");
    });

    it("should add max-length counter after adding prop 'max-length'", async () => {
      component = await creator.createComponent(`<tn-input max-length="5"></tn-input>`);

      const maxLengthElement = document.querySelector(maxLengthSelector);

      expect(maxLengthElement).not.toBe(null);
    });
  });

  describe("state", () => {
    it("should add error classes and text when has errorText", async () => {
      component = await creator.createComponent(
        `<tn-input error-text.bind="errorText"></tn-input>`,
        { errorText: "There is an error" },
      );

      const errorElement = document.querySelector(errorSelector);
      const underlineElement = document.querySelector(underlineSelector);

      expect(errorElement.innerHTML).toBe("There is an error");
      expect(underlineElement.className).toContain("form-group__focus-underline--error");
    });

    it("should add has-data classes when has data", async () => {
      component = await creator.createComponent(`<tn-input value.bind="value"></tn-input>`, {
        value: "This is a value",
      });

      const labelElement = document.querySelector(labelSelector);
      const inputElement = document.querySelector(inputSelector);

      expect(labelElement.className).toContain("form-group__label--has-data");
      expect(inputElement.className).toContain("form-group__input--has-data");
    });
  });

  describe("interaction", () => {
    it("should add focus classes when input has focus", async () => {
      component = await creator.createComponent(`<tn-input></tn-input>`);

      const inputElement = document.querySelector(inputSelector) as HTMLInputElement;
      const underlineElement = document.querySelector(underlineSelector);

      await inputElement.focus();
      await delay(100);

      expect(underlineElement.className).toContain("form-group__focus-underline--focus");
    });

    it("should remove error-text upon value changed", async () => {
      const tninput = new TnInput();

      tninput.errorText = "There is an error";
      tninput.value = "New value";
      tninput.valueChanged();

      expect(tninput.errorText).toBe("");
    });
  });

  describe("validation", () => {
    it("should validate the input if the value has changed and is within set max-length", () => {
      const tninput = new TnInput();
      tninput.maxLength = "5";
      tninput.value = "12345";
      tninput.valueChanged();

      expect(tninput.errorText).toBe("");
    });

    it("should show error message if the value has changed and is outside set max-length", () => {
      const tninput = new TnInput();
      tninput.maxLength = "5";
      tninput.value = "123456";
      tninput.valueChanged();

      expect(tninput.errorText).toBe("Too long input");
    });
  });

  afterEach(() => {
    try {
      component.dispose();
    } catch {
      /* No component to dispose */
    }
  });
});
