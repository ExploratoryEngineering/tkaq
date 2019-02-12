import { bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

export class TnCard extends TnCustomComponent {
  @bindable selectable: string | boolean = false;
}
