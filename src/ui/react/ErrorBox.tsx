import React, { ReactNode } from 'react'

export default function ErrorBox({ children }: { children: string | ReactNode }) {
  return (
    <p className={'notice error margin'}>{children}</p>
  );
}
