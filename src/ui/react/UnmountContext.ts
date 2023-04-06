import { createContext } from 'react';

export default createContext<(value?: unknown) => void>(() => { throw new Error('Unmount function not set'); });
