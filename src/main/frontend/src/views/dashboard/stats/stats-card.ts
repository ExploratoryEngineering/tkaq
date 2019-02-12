import { Subscription } from "aurelia-event-aggregator";
import { bindable, BindingEngine, containerless } from "aurelia-framework";
import { TKAQDataPoint } from "Models/Device";

@containerless
export class StatsCard {
  @bindable tkaqDataPoints: TKAQDataPoint[];

  subscriptions: Subscription[] = [];

  tempMean = "0";
  co2Mean = "0";
  humidityMean = "0";

  constructor(private bindingEngine: BindingEngine) {}

  bind() {
    this.subscribeAndUpdateStats();
  }

  unbind() {
    this.subscriptions.forEach((sub) => sub.dispose());
  }

  tkaqDataPointsChanged() {
    this.subscribeAndUpdateStats();
  }

  subscribeAndUpdateStats() {
    this.subscriptions.forEach((sub) => sub.dispose());

    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.tkaqDataPoints).subscribe(() => {
        this.calculateStats();
      }),
    );

    this.calculateStats();
  }

  calculateStats() {
    let tempTotal = 0;
    let co2Total = 0;
    let humidityTotal = 0;

    this.tkaqDataPoints.forEach((dataPoint) => {
      tempTotal += dataPoint.temperature;
      co2Total += dataPoint.co2Equivalents;
      humidityTotal += dataPoint.relHumidity;
    });

    this.tempMean = (tempTotal / this.tkaqDataPoints.length).toFixed(2);
    this.co2Mean = (co2Total / this.tkaqDataPoints.length).toFixed(0);
    this.humidityMean = (humidityTotal / this.tkaqDataPoints.length).toFixed(2);
  }
}
