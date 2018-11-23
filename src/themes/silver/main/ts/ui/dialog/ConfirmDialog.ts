import { Focusing, GuiFactory, Memento, ModalDialog } from '@ephox/alloy';
import { renderFooterButton } from 'tinymce/themes/silver/ui/general/Button';
import * as Dialogs from './Dialogs';
import { UiFactoryBackstage } from '../../backstage/Backstage';

export interface ConfirmDialogSetup {
    backstage: UiFactoryBackstage;
}
export const setup = (extras: ConfirmDialogSetup) => {
  const sharedBackstage = extras.backstage.shared;
  // FIX: Extreme dupe with Alert dialog
  const open = (message: string, callback: (state: boolean) => void) => {

    const closeDialog = (state) => {
      ModalDialog.hide(confirmDialog);
      callback(state);
    };

    const memFooterYes = Memento.record(
      renderFooterButton({
        name: 'yes',
        text: 'Yes',
        primary: true,
      }, 'submit', sharedBackstage.providers)
    );

    const footerNo = renderFooterButton({
      name: 'no',
      text: 'No',
      primary: true
    }, 'cancel', sharedBackstage.providers);

    const confirmDialog = GuiFactory.build(
      Dialogs.renderDialog({
        lazySink: () => sharedBackstage.getSink(),
        partSpecs: {
          title: Dialogs.pUntitled(),
          close: Dialogs.pClose(() => {
            closeDialog(false);
          }),
          body: Dialogs.pBodyMessage(message, sharedBackstage.providers),
          footer: Dialogs.pFooter(Dialogs.pFooterGroup([], [
            footerNo,
            memFooterYes.asSpec()
          ]))
        },
        onCancel: () => closeDialog(false),
        onSubmit: () => closeDialog(true),
        extraClasses: [ 'tox-confirm-dialog' ]
      })
    );

    ModalDialog.show(confirmDialog);
    const footerYesButton = memFooterYes.get(confirmDialog);
    Focusing.focus(footerYesButton);
  };

  return {
    open
  };
};