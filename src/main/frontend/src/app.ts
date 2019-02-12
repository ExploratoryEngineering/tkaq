/*
Copyright 2019 Telenor Digital AS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { BindingSignaler } from "aurelia-templating-resources";

import "leaflet/dist/leaflet.css";

import { routes } from "./appRoutes";

@autoinject
export class App {
  router: Router;

  UPDATE_TIME_INTERVAL_MS: number = 10000;

  constructor(private signaler: BindingSignaler, router: Router) {
    this.router = router;
    setInterval(() => {
      this.signaler.signal("updateTime");
    }, this.UPDATE_TIME_INTERVAL_MS);
  }

  configureRouter(config: RouterConfiguration) {
    config.title = "Trondheim Kommune Air Quality";
    config.options.pushState = true;
    config.map(routes);
    config.fallbackRoute("not-found");
    config.mapUnknownRoutes("not-found");
  }
}
