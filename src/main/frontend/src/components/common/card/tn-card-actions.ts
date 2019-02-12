import { autoinject, bindable, containerless } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

@autoinject
@containerless
export class TnCardActions extends TnCustomComponent {
  @bindable alignRight: string | boolean;
}
