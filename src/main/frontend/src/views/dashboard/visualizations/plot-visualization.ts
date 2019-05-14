import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, BindingEngine } from "aurelia-framework";
import { TagHelper } from "Helpers/TagHelper";
import { Device, TKAQDataPoint } from "Models/Device";

import * as Plotly from "plotly.js/lib/index-basic";

const TH = new TagHelper();

@autoinject
export class PlotVisualization {
  @bindable tkaqDataPoints: TKAQDataPoint[] = [];
  @bindable devices: Device[] = [];

  @bindable title: string = "Temperature (celsius)";
  @bindable dataKey: string = "temperature";
  @bindable filteredDeviceId: string = "*";
  @bindable logarithmic: string | boolean = false;

  subscriptions: Subscription[] = [];

  plotContainer;
  plotElement;
  plotLayout = {
    automargin: true,
    xaxis: {
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      type: "default",
      showline: false,
      fixedrange: true,
    },
    autosize: true,
    margin: {
      t: 20,
      r: 35,
      b: 50,
      l: 35,
      pad: 0,
    },
    legend: {
      orientation: "h",
      y: 140,
    },
  };

  constructor(private bindingEngine: BindingEngine, private eventAggregator: EventAggregator) {}

  bind() {
    if (this.logarithmic) {
      this.plotLayout.yaxis.type = "log";
    }

    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.tkaqDataPointsChanged();
      }),
    );
    this.createPlot();
    this.plotContainer.on("plotly_relayout", (eventdata) => {
      this.eventAggregator.publish("plotly:relayout", eventdata);
    });
  }

  unbind() {
    this.subscriptions.forEach((sub) => sub.dispose());
  }

  tkaqDataPointsChanged() {
    this.subscriptions.forEach((sub) => sub.dispose());

    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.createPlot();
      }),
    );
    this.createPlot();
  }

  filteredDeviceIdChanged() {
    this.createPlot();
  }

  private async createPlot() {
    const groupedDataPoints: { [deviceId: string]: TKAQDataPoint[] } = this.tkaqDataPoints.reduce(
      (acc, datapoint) => {
        if (this.filteredDeviceId === "*" || this.filteredDeviceId === datapoint.deviceId) {
          if (!acc[datapoint.deviceId]) {
            acc[datapoint.deviceId] = [];
          }

          acc[datapoint.deviceId].push(datapoint);
        }

        return acc;
      },
      {},
    );

    this.plotElement = await Plotly.react(
      this.plotContainer,
      Object.keys(groupedDataPoints).map((deviceId) => {
        const foundDevice = this.devices.find((device) => {
          return device.id === deviceId;
        });
        const deviceName = foundDevice ? TH.getEntityName(foundDevice) : deviceId;

        return groupedDataPoints[deviceId].reduce(
          (acc, dataPoint) => {
            acc.x.push(new Date(dataPoint.timestamp));
            acc.y.push(dataPoint[this.dataKey]);

            return acc;
          },
          {
            name: `${deviceName}`,
            x: [],
            y: [],
          },
        );
      }),
      this.plotLayout,
    );

    try {
      await Plotly.Plots.resize(this.plotContainer);
    } catch {
      // Resize failed.
    }
  }
}
