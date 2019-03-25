import { Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, BindingEngine } from "aurelia-framework";
import * as L from "leaflet";
import "leaflet.heat";
import { TKAQDataPoint } from "Models/Device";

declare module "leaflet" {
  interface HeatLayer extends Layer {
    initialize(a: any, b: any): void;
    setLatLngs(a: any): any;
    addLatLng(a: any): any;
    setOptions(a: any): any;
    redraw(): any;
    onAdd(a: any): any;
    onRemove(a: any): any;
    addTo(a: any): any;
    _initCanvas(): void;
    _updateOptions(): void;
    _reset(): void;
    _redraw(): void;
    _animateZoom(a: any): void;
  }
  function heatLayer(a: any, b: any): any;
}

@autoinject
export class HeatmapVisualization {
  @bindable tkaqDataPoints: TKAQDataPoint[] = [];

  @bindable co2Range: number = 2250;
  @bindable filteredDeviceId: string = "*";

  map: L.Map;
  mapHeatLayer: L.HeatLayer;
  mapElement: HTMLElement;

  subscriptions: Subscription[] = [];

  constructor(private bindingEngine: BindingEngine) {}

  bind() {
    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.updateHeatmapLayer();
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
    });

    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.createHeatMapLayer();
  }

  co2RangeChanged() {
    this.updateHeatmapLayer();
  }

  filteredDeviceIdChanged() {
    this.updateHeatmapLayer();
  }

  tkaqDataPointsChanged() {
    this.subscriptions.forEach((sub) => sub.dispose());

    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.updateHeatmapLayer();
      }),
    );

    this.createHeatMapLayer();
  }

  updateHeatmapLayer() {
    this.mapHeatLayer.setLatLngs(
      this.tkaqDataPoints
        .filter((dataPoint) => {
          return (
            (this.filteredDeviceId === "*" || this.filteredDeviceId === dataPoint.deviceId) &&
            dataPoint.co2Equivalents > this.co2Range - 500
          );
        })
        .map((dataPoint) => {
          return [
            dataPoint.latitude,
            dataPoint.longitude,
            dataPoint.co2Equivalents / this.co2Range,
          ];
        }),
    );
    this.mapHeatLayer.redraw();
  }

  private createHeatMapLayer() {
    if (this.mapHeatLayer) {
      this.map.removeLayer(this.mapHeatLayer);
      this.mapHeatLayer.remove();
    }
    this.mapHeatLayer = L.heatLayer(
      this.tkaqDataPoints
        .filter((dataPoint) => {
          return (
            (this.filteredDeviceId === "*" || this.filteredDeviceId === dataPoint.deviceId) &&
            dataPoint.co2Equivalents > this.co2Range - 500
          );
        })
        .map((dataPoint) => {
          return [
            dataPoint.latitude,
            dataPoint.longitude,
            dataPoint.co2Equivalents / this.co2Range,
          ];
        }),
      { radius: 25 },
    ).addTo(this.map);
  }
}