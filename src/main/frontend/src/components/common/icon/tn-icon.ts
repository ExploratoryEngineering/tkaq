import { bindable } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

import "./tn-icon.scss";

export class TnIcon extends TnCustomComponent {
  @bindable colored: boolean | string = false;
  @bindable clickable: boolean | string = false;

  @bindable huge: boolean | string = false;
  @bindable large: boolean | string = false;
  @bindable medium: boolean | string = true;
  @bindable small: boolean | string = false;

  @bindable left: boolean | string = false;
  @bindable right: boolean | string = false;
  @bindable noMargin: boolean | string = false;

  @bindable center: boolean | string = false;
}
