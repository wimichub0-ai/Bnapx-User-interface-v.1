import Link from 'next/link';
export default function Landing(){
  return (<main>
    <div className='header-grad'>
      <img className='logo' src='/logo-blue.png' alt='BnapX'/>
      <h2>Welcome to BnapX</h2>
      <p className='small'>Start by signing in or creating an account</p>
    </div>
    <div className='container card'>
      <div style={{display:'flex',gap:10}}>
        <Link className='btn' href='/auth/signup' style={{textAlign:'center',paddingTop:12}}>Create account</Link>
        <Link className='btn' href='/auth/login' style={{textAlign:'center',paddingTop:12}}>Login</Link>
      </div>
    </div>
  </main>);
}
