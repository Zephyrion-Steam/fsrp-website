 // pages/tickets/[id].js
import clientPromise from '../../lib/mongodb';
import moment from 'moment';
import Head from 'next/head';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const client = await clientPromise;
  const db = client.db('FSRP-tickets'); // Replace 'test' with your DB name if different

  // Find the ticket by the random ID
  const ticket = await db.collection('tickets').findOne({ transcriptId: id });

  if (!ticket) {
    return { notFound: true };
  }

  // Next.js needs data to be serialized (strings/numbers), convert dates
  return {
    props: {
      ticket: JSON.parse(JSON.stringify(ticket)),
    },
  };
}

export default function Transcript({ ticket }) {
  return (
    <div className="min-h-screen bg-[#36393f] text-white font-sans p-4">
      <Head>
        <title>Ticket {ticket.transcriptId}</title>
      </Head>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto border-b border-gray-700 pb-4 mb-4">
        <h1 className="text-2xl font-bold">Ticket Transcript</h1>
        <p className="text-gray-400">ID: {ticket.transcriptId}</p>
        <p className="text-gray-400">Closed: {moment(ticket.closedAt).format('MMMM Do YYYY, h:mm a')}</p>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto space-y-4">
        {ticket.messages.map((msg, index) => (
          <div key={index} className="flex gap-4 group hover:bg-[#32353b] p-2 rounded">
            {/* Avatar */}
            <img 
              src={msg.authorAvatar} 
              className="w-10 h-10 rounded-full bg-gray-600" 
              alt="avatar" 
            />
            
            <div className="flex-1">
              {/* Author Name */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{msg.authorTag}</span>
                <span className="text-xs text-gray-400">
                  {moment(msg.timestamp).format('MM/DD/YYYY h:mm A')}
                </span>
              </div>

              {/* Content */}
              <div className="text-gray-300 mt-1 whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Attachments */}
              {msg.attachments && msg.attachments.map((url, i) => (
                <div key={i} className="mt-2">
                  <img src={url} alt="attachment" className="max-h-60 rounded border border-gray-700" />
                </div>
              ))}

              {/* Embeds (Basic Support) */}
              {msg.embeds && msg.embeds.map((embed, i) => (
                <div key={i} className="mt-2 border-l-4 border-l-[#ffb347] bg-[#2f3136] p-3 rounded max-w-lg">
                  {embed.title && <h4 className="font-bold">{embed.title}</h4>}
                  {embed.description && <p>{embed.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}