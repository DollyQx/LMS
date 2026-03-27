import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { generateCertificate, getCertificate } from '../services/courses.service';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    const fetchOrGenerate = async () => {
      try {
        // Attempt fetch specifically first
        const existing = await getCertificate(id);
        setCertData(existing.data.certificate);
      } catch (err) {
        // If 404, logically try to mathematically generate it as a fallback securely!
        if (err.response?.status === 404) {
          try {
             const created = await generateCertificate(id);
             setCertData(created.data.certificate);
          } catch (genErr) {
             setErrorLocal(genErr.response?.data?.message || 'Not eligible for certificate generation yet.');
          }
        } else {
          setErrorLocal('Failed to fetch certificate validation data.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrGenerate();
  }, [id]);

  if (loading) return <div className="h-screen bg-dark flex justify-center items-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-dark text-gray-900 dark:text-white pb-20">
      <Navbar />

      <main className="flex-1 max-w-4xl flex flex-col items-center justify-center mx-auto px-4 w-full py-8 text-center">
        
        {errorLocal ? (
          <div className="bg-red-50 dark:bg-red-900/10 p-10 rounded-3xl border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
            <p className="text-gray-700 dark:text-gray-300">{errorLocal}</p>
            <button 
               onClick={() => navigate(`/course/${id}`)}
               className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
            >
              Return to Course Player
            </button>
          </div>
        ) : (
          <div className="w-full">
            <CheckCircle className="w-16 h-16 text-brand mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold mb-8">Your Certificate is Ready!</h1>
            
            <div className="bg-white dark:bg-darkLayer p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden relative">
               <object 
                 data={`http://localhost:5000${certData?.certificateUrl}`} 
                 type="application/pdf" 
                 className="w-full h-[500px] rounded-lg border border-gray-100 dark:border-gray-800"
               >
                 <p className="p-4">Your browser does not cleanly support embedded PDFs generically. <a href={`http://localhost:5000${certData?.certificateUrl}`} className="text-brand absolute z-50">Download it manually right here</a></p>
               </object>
            </div>

            <a 
               href={`http://localhost:5000${certData?.certificateUrl}`}
               download
               target="_blank"
               rel="noreferrer"
               className="px-10 py-4 bg-brand hover:bg-brandHover text-white font-bold rounded-lg shadow-xl shadow-brand/20 transition-all text-lg"
            >
               Download Official PDF Document
            </a>
          </div>
        )}

      </main>
    </div>
  );
};

export default Certificate;
