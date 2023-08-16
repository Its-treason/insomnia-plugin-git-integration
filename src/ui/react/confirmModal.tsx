import React, { CSSProperties, FC, useContext } from 'react';
import BaseModal from './BaseModal';
import UnmountContext from './UnmountContext';

const errorBoxStyles: CSSProperties = {
  marginTop: 8,
  background: 'var(--hl-xs)',
  padding: 'var(--padding-xs) var(--padding-sm)',
  color: 'var(--color-font)',
  border: '1px solid var(--hl-sm)',
  fontSize: '.9em',
};

export default function confirmModal(title: string, body: string, extBody?: string): FC {
  function ConfirmModal() {
    const unmount = useContext(UnmountContext);

    return (
      <BaseModal
        footer={(
          <>
            <button className={'btn'} onClick={() => unmount(false)}>Cancel</button>
            <button className={'btn'} onClick={() => unmount(true)}>OK</button>
          </>
        )}
        title={title}
      >
        <>
          {body}
          {extBody ? (
            <pre style={errorBoxStyles}>{String(extBody)}</pre>
          ) : null}
        </>
      </BaseModal>
    );
  }
  return ConfirmModal;
}
