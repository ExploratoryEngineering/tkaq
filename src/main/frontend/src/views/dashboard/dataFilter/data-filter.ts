import { bindable, bindingMode } from "aurelia-framework";
import { isValid } from "date-fns";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Instance } from "flatpickr/dist/types/instance";
import { Device } from "Models/Device";

export class DataFilter {
  flatpickrInstance: Instance;
  rangeInputElement: HTMLInputElement;

  @bindable devices: Device[] = [];

  @bindable({ defaultBindingMode: bindingMode.twoWay }) dateRange: Date[];

  @bindable({ defaultBindingMode: bindingMode.twoWay }) isLive: boolean = true;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) filteredDeviceId: string = "*";

  attached() {
    this.flatpickrInstance = flatpickr(this.rangeInputElement, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      maxDate: "today",
      mode: "range",
      onClose: (dateArray) => {
        if (isValid(dateArray[0]) && isValid(dateArray[1])) {
          this.dateRange = dateArray;
        }
      },
      defaultDate: [this.dateRange[0], this.dateRange[1]],
    }) as Instance;
  }

  dateRangeChanged() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.dateRange);
    }
  }

  toggleLive() {
    this.isLive = !this.isLive;
  }
}
