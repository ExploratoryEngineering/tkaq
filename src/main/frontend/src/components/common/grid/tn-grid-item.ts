import { bindable, computedFrom } from "aurelia-framework";
import { TnCustomComponent } from "Components/TnCustomComponent";

const validGridSizes = ["2", "3", "4", "6", "8", "9", "12"];

export class TnGridItem extends TnCustomComponent {
  @bindable gridSize: string | boolean = false;
  @bindable noStretch: string | boolean = false;
  @bindable noFlex: string | boolean = false;

  @computedFrom("gridSize")
  get cssGridSizeClass() {
    if (typeof this.gridSize === "string" && validGridSizes.includes(this.gridSize)) {
      return `tn-grid__item--${this.gridSize}`;
    } else {
      return "tn-grid__item--12";
    }
  }
}
