import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { endOfDay, startOfDay } from "date-fns";
import { CollectionStream } from "Helpers/CollectionStream";
import { Device, TKAQDataPoint } from "Models/Device";
import { CollectionService } from "Services/CollectionService";
import { DeviceService } from "Services/DeviceService";

const MAX_NUMBER_OF_DATA_POINTS = 100000;

@autoinject
export class Dashboard {
  collectionId: string = "17dh0cf43jfi2f";
  devices: Device[] = [];
  tkaqDataPoints: TKAQDataPoint[] = [];
  filteredTkaqDataPoints: TKAQDataPoint[] = [];

  @bindable filteredDeviceId: string = "*";
  @bindable isLive: boolean = true;
  @bindable dateRange = [startOfDay(new Date()), new Date()];

  subscriptions: Subscription[] = [];

  constructor(
    private collectionService: CollectionService,
    private collectionStream: CollectionStream,
    private deviceService: DeviceService,
    private eventAggregator: EventAggregator,
  ) {}

  async activate() {
    this.subscriptions.push(
      this.eventAggregator.subscribe("deviceMessage", (datapoint: TKAQDataPoint) => {
        if (this.filteredDeviceId === "*" || this.filteredDeviceId === datapoint.deviceId) {
          this.tkaqDataPoints.unshift(datapoint);
        }
      }),
    );
    this.subscriptions.push(
      this.eventAggregator.subscribe("plotly:relayout", (plotlyEvent) => {
        if (plotlyEvent["xaxis.range[0]"] && plotlyEvent["xaxis.range[1]"]) {
          this.dateRange = [plotlyEvent["xaxis.range[0]"], plotlyEvent["xaxis.range[1]"]];
        }
      }),
    );

    this.fetchDataPoints();
    this.devices = await this.deviceService.fetchCollectionDevices(this.collectionId);
    this.collectionStream.openCollectionDataStream(this.collectionId);
  }

  deactivate() {
    this.collectionStream.closeCollectionStream();
    this.subscriptions.map((subscription) => subscription.dispose());
  }

  dateRangeChanged() {
    this.fetchDataPoints();
  }

  filteredDeviceIdChanged() {
    this.fetchDataPoints();
  }

  isLiveChanged() {
    if (this.isLive) {
      this.collectionStream.openCollectionDataStream(this.collectionId);
    } else {
      this.collectionStream.closeCollectionStream();
    }
  }

  private async fetchDataPoints() {
    const since = this.dateRange[0];
    const until = endOfDay(this.dateRange[1]);
    if (this.filteredDeviceId === "*") {
      this.tkaqDataPoints = await this.collectionService.fetchDeviceMessagesByCollectionId(
        this.collectionId,
        {
          since: since,
          until: until,
          limit: MAX_NUMBER_OF_DATA_POINTS,
        },
      );
    } else {
      this.tkaqDataPoints = await this.deviceService.fetchDeviceMessagesById(
        this.collectionId,
        this.filteredDeviceId,
        {
          since: since,
          until: until,
          limit: MAX_NUMBER_OF_DATA_POINTS,
        },
      );
    }

    if (this.tkaqDataPoints.length === MAX_NUMBER_OF_DATA_POINTS) {
      this.eventAggregator.publish("global:message", {
        body: "Maximum number of data points reached",
      });
    }
  }
}
