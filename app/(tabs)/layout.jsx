'use client';
import Link from 'next/link';import { usePathname } from 'next/navigation';
export default function TabsLayout({children}){
  const pathname=usePathname();
  const Tab=({href,icon,label})=>{const active=pathname===href;return(<Link href={href} className={`tab ${active?'active':''}`}><div className='dot'>{icon}</div>{label}</Link>)};
  return (<div className='container'>
    {children}
    <div className='tabbar'><div className='tabs'>
      <Tab href='/(tabs)' icon='🏠' label='Home'/>
      <Tab href='/(tabs)/trade' icon='💱' label='Trade'/>
      <Tab href='/(tabs)/history' icon='📄' label='History'/>
      <Tab href='/(tabs)/profile' icon='👤' label='Profile'/>
    </div></div>
  </div>);
}
