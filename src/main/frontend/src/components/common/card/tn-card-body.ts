import { bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

export class TnCardBody extends TnCustomComponent {
  @bindable noPadding: string | boolean = false;
  @bindable centered: string | boolean = false;
  @bindable fullHeight: string | boolean = false;
}
