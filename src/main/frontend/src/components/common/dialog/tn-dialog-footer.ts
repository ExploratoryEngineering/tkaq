import { bindable, containerless } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

@containerless
export class TnDialogFooter extends TnCustomComponent {
  @bindable small: string | boolean = false;
}
