import { autoinject, bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

import "./tn-button.scss";

@autoinject
export class TnButton extends TnCustomComponent {
  @bindable primary: boolean | string = false;
  @bindable flat: boolean | string = false;
  @bindable raised: boolean | string = false;
  @bindable icon: string | boolean = false;

  @bindable
  focused: boolean | string = false;

  @bindable focusElement: string | boolean = false;
  @bindable disabled: boolean | string = false;

  @bindable type: string = "button";
  @bindable loading: boolean = false;

  tnButton: HTMLElement;
  button: HTMLButtonElement;

  bind() {
    this.setDisabled();
    this.setType();
  }

  attached() {
    this.setFocus();
  }

  disabledChanged() {
    this.setDisabled();
  }

  typeChanged() {
    this.setType();
  }

  focusChanged() {
    this.setFocus();
  }

  private setDisabled() {
    if (this.hasProp("disabled")) {
      this.button.setAttribute("disabled", "disabled");
    } else {
      this.button.removeAttribute("disabled");
    }
  }

  private setType() {
    this.button.setAttribute("type", this.type);
  }

  private setFocus() {
    if (this.hasProp("focused")) {
      this.button.focus();
    }
  }
}
