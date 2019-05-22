import { Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, BindingEngine } from "aurelia-framework";
import * as L from "leaflet";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import { TKAQDataPoint } from "Models/Device";

declare module "leaflet" {
  interface FullscreenMapOptions extends L.MapOptions {
    fullscreenControl: boolean;
  }
}

interface LeafletTrack {
  polyLine: L.Polyline;
  dataPoints: TKAQDataPoint[];
}

interface LeafletTrackCollection {
  [deviceId: string]: LeafletTrack;
}

@autoinject
export class MapPathVisualization {
  @bindable tkaqDataPoints: TKAQDataPoint[] = [];

  @bindable filteredDeviceId: string = "*";

  @bindable title: string = "Datapoint paths";

  map: L.Map;
  mapElement: HTMLElement;
  leafletTracks: LeafletTrackCollection = {};

  subscriptions: Subscription[] = [];

  constructor(private bindingEngine: BindingEngine) {}

  bind() {
    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.updatePolygonLines();
      }),
    );
  }

  unbind() {
    this.subscriptions.map((sub) => sub.dispose());
  }

  attached() {
    this.map = L.map(this.mapElement, {
      center: [63.410774, 10.45424],
      zoom: 10,
      fullscreenControl: true,
    } as L.FullscreenMapOptions);

    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.createPolygonLines();
  }

  filteredDeviceIdChanged() {
    this.updatePolygonLines();
  }

  tkaqDataPointsChanged() {
    this.subscriptions.forEach((sub) => sub.dispose());

    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.updatePolygonLines();
      }),
    );

    this.createPolygonLines();
  }

  private updatePolygonLines() {
    this.createPolygonLines();
  }

  private createPolygonLines() {
    Object.keys(this.leafletTracks).map((deviceId) => {
      if (this.leafletTracks[deviceId].polyLine !== null) {
        this.map.removeLayer(this.leafletTracks[deviceId].polyLine);
        this.leafletTracks[deviceId].polyLine.remove();
        this.leafletTracks[deviceId].polyLine = null;
      }
    });

    this.leafletTracks = {};

    this.tkaqDataPoints.forEach((datapoint) => {
      if (datapoint.longitude !== 0 && datapoint.latitude !== 0) {
        if (this.leafletTracks[datapoint.deviceId]) {
          this.leafletTracks[datapoint.deviceId].dataPoints.push(datapoint);
        } else {
          this.leafletTracks[datapoint.deviceId] = {
            dataPoints: [datapoint],
            polyLine: null,
          };
        }
      }
    });

    Object.keys(this.leafletTracks).map((deviceId) => {
      this.leafletTracks[deviceId].polyLine = new L.Polyline(
        this.leafletTracks[deviceId].dataPoints.map((datapoint) => {
          return [datapoint.latitude, datapoint.longitude] as L.LatLngExpression;
        }),
        {
          color: "#007ACE",
          opacity: 0.3,
        },
      ).addTo(this.map);
    });
  }
}
