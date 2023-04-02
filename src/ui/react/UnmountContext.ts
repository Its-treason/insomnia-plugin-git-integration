import { createContext } from 'react'

export default createContext<(value?: any) => void>(() => { });
