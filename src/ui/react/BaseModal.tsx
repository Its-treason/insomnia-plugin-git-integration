import React, { ReactElement, useContext } from 'react';
import UnmountContext from './UnmountContext';

type BaseDialogProps = {
  children: ReactElement|string,
  footer: ReactElement|string,
  title: string,
}

export default function BaseDialog({ children, title, footer }: BaseDialogProps): ReactElement {
  const unmount = useContext(UnmountContext);

  return (
    <div className={'modal theme--dialog'} role={'dialog'} style={{ zIndex: 1100 }}>
      <div className={'modal__backdrop overlay theme--transparent-overlay'} onClick={unmount} />
      <div className={'modal__content__wrapper'}>
        <div className={'modal__content'}>
          <div className={'modal__header theme--dialog__header'}>
            <div className={'modal__header__children'}><i className={'fa fa-git'} style={{ marginRight: 8 }} />{title}</div>
            <button type={'button'} className={'btn btn--compact modal__close-btn'} onClick={unmount}>
              <i className={'fa fa-times'} />
            </button>
          </div>
          <div className={'modal__body theme--dialog__body'}>{children}</div>
          <div className={'modal__footer theme--dialog__footer'}>{footer}</div>
        </div>
      </div>
    </div>
  );
}
