import { bindable, bindingMode } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

export class TnCheckbox extends TnCustomComponent {
  @bindable name: string = "";
  @bindable label: string = "";
  @bindable({ defaultBindingMode: bindingMode.twoWay }) checked: boolean;
}
