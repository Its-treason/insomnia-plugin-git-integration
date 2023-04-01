import React, { FC, useContext } from 'react';
import BaseModal from './BaseModal';
import UnmountContext from './UnmountContext';

export default function alertModal(title: string, body: string, extBody?: string): FC {
  function AlertModal() {
    const unmount = useContext(UnmountContext);

    return (
      <BaseModal
        footer={<button className={'btn'} onClick={unmount}>OK</button>}
        title={title}
      >
        <>
          {body}
          {extBody ? (
            <pre>{extBody}</pre>
          ) : null}
        </>
      </BaseModal>
    )
  }
  return AlertModal;
}
