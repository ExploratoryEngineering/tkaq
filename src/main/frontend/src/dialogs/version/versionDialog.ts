import { autoinject } from "aurelia-framework";
import { HelpDialog } from "Dialogs/help/helpDialog";

@autoinject
export class VersionModal extends HelpDialog {
  ok() {
    this.dialogController.ok();
  }

  cancel() {
    this.dialogController.cancel();
  }
}
