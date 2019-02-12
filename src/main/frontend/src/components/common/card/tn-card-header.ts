import { bindable, containerless } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

@containerless
export class TnCardHeader extends TnCustomComponent {
  @bindable warning: string | boolean = false;
  @bindable error: string | boolean = false;
  @bindable table: string | boolean = false;
  @bindable plain: string | boolean = false;
}
