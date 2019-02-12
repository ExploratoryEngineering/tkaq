import { bindable, bindingMode, computedFrom } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

interface ITnSelectValue {
  id: string;
  value: string;
}
export class TnSelect extends TnCustomComponent {
  @bindable name: string = "";
  @bindable label: string = "";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;
  @bindable values: ITnSelectValue[] = [];
  @bindable focusElement: string | boolean = false;
  @bindable readonly: string | boolean = false;
  @bindable compact: string | boolean = false;

  @bindable helpText: string = "";
  @bindable errorText: string = "";

  @bindable hasFocus: boolean;

  selectElement: HTMLSelectElement;
  inlineOptions: HTMLDivElement;

  valueChanged() {
    this.errorText = "";
  }

  @computedFrom("value")
  get hasValue() {
    return (this.value || this.value === "0") && this.value.length > 0;
  }

  @computedFrom("readonly")
  get isReadOnly() {
    return this.hasProp("readonly");
  }

  attached() {
    Array.from(this.inlineOptions.childNodes)
      .filter(this.isSelect)
      .forEach((selectChild) => {
        this.selectElement.appendChild(selectChild.cloneNode(true));
      });
  }

  private isSelect(node: ChildNode): node is HTMLOptionElement {
    return (node as HTMLOptionElement).nodeName === "OPTION";
  }
}
