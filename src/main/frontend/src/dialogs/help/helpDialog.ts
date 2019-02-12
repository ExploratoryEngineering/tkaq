import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import "./helpDialog.scss";

@autoinject
export class HelpDialog {
  helpTitle: string;
  helpText: string;

  cancelButtonText: string = "Tell me later";
  acceptButtonText: string = "Got it!";

  constructor(protected dialogController: DialogController) {}

  cancel() {
    this.dialogController.cancel();
  }

  accept() {
    this.dialogController.ok();
  }
}
