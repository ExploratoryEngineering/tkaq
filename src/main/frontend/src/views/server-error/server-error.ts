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
import { Router } from "aurelia-router";

@autoinject
export class ServerError {
  hasBackNavigation: boolean;

  constructor(private router: Router) {
    this.hasBackNavigation = !this.router.isNavigatingFirst;
  }

  navigateToCollections() {
    this.router.navigate("collection-overview");
  }

  navigateBack() {
    this.router.navigateBack();
  }
}
