import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'ATHALIA — Art with evidence', description:'Print-ready work by verified physical artists.' };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
