import { bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

export class TnDialog extends TnCustomComponent {
  @bindable small: string | boolean = false;
  @bindable large: string | boolean = false;
  @bindable cover: string | boolean = false;
  @bindable transparent: string | boolean = false;
}
