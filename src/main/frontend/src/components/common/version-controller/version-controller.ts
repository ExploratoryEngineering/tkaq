import { DialogService } from "aurelia-dialog";
import { autoinject, noView, PLATFORM } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";

declare global {
  interface Window {
    tkaqVersion: string;
  }
}

const INTERVAL_TIMEOUT = 60000;

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("Version controller");

@noView
@autoinject
export class VersionController {
  version: string;
  pollId: number;

  httpClient: HttpClient = new HttpClient();

  constructor(private dialogService: DialogService) {
    this.version = window.tkaqVersion;
    this.initializePolling();
  }

  initializePolling() {
    Log.debug("Init polling");
    this.pollId = window.setInterval(() => {
      this.checkNewVersion();
    }, INTERVAL_TIMEOUT);
    this.checkNewVersion();
  }

  fetchVersion(): Promise<string> {
    return this.httpClient
      .get("/version.json", { cache: new Date().getTime() })
      .then((response) => response.content)
      .then((versionObject) => versionObject.version);
  }

  checkNewVersion() {
    return this.fetchVersion()
      .then((fetchedVersion) => {
        if (fetchedVersion !== this.version) {
          Log.debug("Version doesn't match");
          window.clearInterval(this.pollId);

          this.dialogService
            .open({
              viewModel: PLATFORM.moduleName("dialogs/version/versionDialog"),
            })
            .whenClosed((output) => {
              if (!output.wasCancelled) {
                window.location.reload(true);
              }
            });
        } else {
          Log.debug("Version match. Carry on pollin'");
        }
      })
      .catch(() => {
        Log.warn("Couldn't find version.json.");
      });
  }
}
