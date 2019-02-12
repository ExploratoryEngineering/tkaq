import { bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

export class TnP extends TnCustomComponent {
  @bindable secondary: string | boolean = false;
}
