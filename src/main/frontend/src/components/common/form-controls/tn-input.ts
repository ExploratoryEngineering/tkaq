import { bindable, bindingMode, computedFrom } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

import "./tn-input.scss";

export class TnInput extends TnCustomComponent {
  inputElement: HTMLInputElement;

  @bindable name: string = "";
  @bindable label: string = "";
  @bindable type: string = "text";
  @bindable helpText: string = "";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) errorText: string = "";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;

  @bindable focusElement: string | boolean = false;
  @bindable floatingLabel: string | boolean = false;
  @bindable readonly: string | boolean = false;
  @bindable autocomplete: string | boolean = false;
  @bindable maxLength: string = "";
  @bindable inline: string | boolean;

  @bindable hasFocus: boolean;

  @computedFrom("value")
  get hasValue() {
    return (this.value || this.value === "0") && String(this.value).length > 0;
  }

  @computedFrom("readonly")
  get isReadOnly() {
    return this.hasProp("readonly");
  }

  valueChanged() {
    this.errorText = "";

    this.validate();
  }

  private validate() {
    if (this.maxLength && this.value.length > parseInt(this.maxLength, 10)) {
      this.errorText = "Too long input";
    }
  }
}
