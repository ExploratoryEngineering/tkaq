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

import { PLATFORM } from "aurelia-pal";
import { RouteConfig } from "aurelia-router";

export let routes: RouteConfig[] = [
  {
    route: [""],
    redirect: "dashboard",
  },
  {
    route: ["dashboard"],
    name: "dashboard",
    moduleId: PLATFORM.moduleName("views/dashboard/dashboard"),
    nav: true,
    title: "Home",
    settings: {
      auth: false,
    },
  },
  {
    route: ["cookies-and-legal"],
    name: "cookies-and-legal",
    moduleId: PLATFORM.moduleName("views/cookies-and-more/cookies-and-more.html"),
    nav: false,
    title: "Cookies and legal",
    settings: {
      auth: false,
    },
  },
  {
    route: ["server-error"],
    name: "server-error",
    moduleId: PLATFORM.moduleName("views/server-error/server-error"),
    nav: false,
    title: "Server issues - Stay calm",
    settings: {
      auth: false,
    },
  },
  {
    route: ["not-found"],
    name: "not-found",
    moduleId: PLATFORM.moduleName("views/not-found/not-found"),
    nav: false,
    title: "Could not find your page",
    settings: {
      auth: false,
    },
  },
];
