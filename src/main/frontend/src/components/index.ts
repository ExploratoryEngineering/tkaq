import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export const configure = (config: FrameworkConfiguration) => {
  config.globalResources([
    PLATFORM.moduleName("components/common/main-container/main-container"),
    PLATFORM.moduleName("components/common/p/tn-p"),
    PLATFORM.moduleName("components/common/button/tn-button"),
    PLATFORM.moduleName("components/common/grid/tn-grid"),
    PLATFORM.moduleName("components/common/grid/tn-grid-row"),
    PLATFORM.moduleName("components/common/grid/tn-grid-item"),
    PLATFORM.moduleName("components/common/card/tn-card"),
    PLATFORM.moduleName("components/common/card/tn-card-header"),
    PLATFORM.moduleName("components/common/card/tn-card-title"),
    PLATFORM.moduleName("components/common/card/tn-card-header-actions"),
    PLATFORM.moduleName("components/common/card/tn-card-body"),
    PLATFORM.moduleName("components/common/card/tn-card-body-heading"),
    PLATFORM.moduleName("components/common/card/tn-card-actions"),
    PLATFORM.moduleName("components/common/dialog/tn-dialog"),
    PLATFORM.moduleName("components/common/dialog/tn-dialog-header"),
    PLATFORM.moduleName("components/common/dialog/tn-dialog-body"),
    PLATFORM.moduleName("components/common/dialog/tn-dialog-footer"),
    PLATFORM.moduleName("components/common/form-controls/tn-input"),
    PLATFORM.moduleName("components/common/form-controls/tn-select"),
    PLATFORM.moduleName("components/common/icon/tn-icon"),
  ]);
};
