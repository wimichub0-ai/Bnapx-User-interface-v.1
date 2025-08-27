'use client';
import TabBar from '@/components/TabBar';

export default function ComingSoonPage(){
  return (
    <main className="wrap">
      <div className="center">
        <section className="card">
          <p className="msg">
            Yooy Buddy this feature is not available yet <br/>
            we will notify you once this is up
          </p>
        </section>
      </div>

      <TabBar active="/home" />

      <style jsx>{`
        .wrap{
          min-height:100dvh;
          background:#F6F4FC;
          display:flex;
          flex-direction:column;
          padding-bottom:100px; /* space for TabBar */
        }

        .center{
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:16px;
        }

        /* Card style same as profile page */
        .card{
          width:100%;
          max-width:420px;
          background:#fff;
          border-radius:14px;
          border:1px solid #E7EAF3;
          box-shadow:0 0 12px rgba(16,24,40,.06);
          padding:24px 16px;
          text-align:center;
        }

        .msg{
          margin:0;
          font-size:15px;
          color:#0F172A;
          line-height:1.5;
        }
      `}</style>
    </main>
  );
}




