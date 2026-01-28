import React, { useState, useMemo, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, addDoc, 
  updateDoc, deleteDoc, onSnapshot, query 
} from 'firebase/firestore';
import { 
  Users, DollarSign, ClipboardList, Calendar, 
  UserPlus, CheckCircle2, Clock, MapPin, Download,
  PlusCircle, TrendingUp, AlertCircle, X, Save,
  Pencil, Check, Trash2, Cloud, RefreshCw,
  Wallet, ListChecks, Sparkles, MessageSquare, 
  Music, Utensils, Send, Loader2, ChevronDown,
  Database, Code, AlertTriangle, Baby, Armchair,
  PieChart, ArrowRight, Coins, FileSpreadsheet, Printer
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDDLlT_HC9nEStYvGNIQYssFd6p9nx1SIU",
  authDomain: "fiesta-zara-70.firebaseapp.com",
  projectId: "fiesta-zara-70",
  storageBucket: "fiesta-zara-70.firebasestorage.app",
  messagingSenderId: "1027241707454",
  appId: "1:1027241707454:web:382096fde30bc2bfa69bef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : '70-years-zara-planner-v2';
const apiKey = ""; 

// --- UTILIDADES DE CARGA DE SCRIPTS ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// --- MOTOR DE EXPORTACIÓN (EXCEL & PDF) ---
const exportEngine = {
  // Generar Excel .xlsx
  async toExcel(data, sheetName, fileName) {
    try {
      await loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js");
      const XLSX = window.XLSX;
      
      // Crear hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Ajustar ancho de columnas automáticamente
      const wscols = Object.keys(data[0] || {}).map(k => ({ wch: 20 }));
      ws['!cols'] = wscols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error exportando a Excel:", error);
      alert("Hubo un error generando el Excel. Por favor intenta de nuevo.");
    }
  },

  // Generar PDF con diseño
  async toPDF(title, columns, rows, fileName) {
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Encabezado Corporativo del Evento
      doc.setFillColor(49, 46, 129); // Indigo 900
      doc.rect(0, 0, 210, 40, 'F'); // Barra superior
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("70 Años de Mamá Zara", 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Reporte: ${title}`, 105, 30, { align: 'center' });
      doc.text(`Fecha de impresión: ${new Date().toLocaleDateString()}`, 105, 36, { align: 'center' });

      // Tabla con estilos modernos
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 45,
        theme: 'grid',
        headStyles: { 
          fillColor: [79, 70, 229], // Indigo 600
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: { 
          fillColor: [243, 244, 246] // Gray 100
        },
        styles: { 
          fontSize: 10, 
          cellPadding: 4,
          lineColor: [229, 231, 235],
          lineWidth: 0.1
        },
        columnStyles: {
          0: { fontStyle: 'bold' } // Primera columna en negrita
        }
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Organizado con amor por Jose, Luis y Carlos', 105, 290, { align: 'center' });
      }

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error exportando a PDF:", error);
      alert("Hubo un error generando el PDF.");
    }
  }
};

// --- COMPONENTE DE ESTADO PERSONALIZADO (FIXED POSITIONING) ---
const StatusSelect = ({ current, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  const options = [
    { value: 'Pendiente', label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    { value: 'Confirmado', label: 'Confirmado', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
    { value: 'Cancelado', label: 'Cancelado', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' }
  ];

  const currentOption = options.find(o => o.value === current) || options[0];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: `${rect.bottom + 6}px`,
        left: `${rect.left}px`,
        zIndex: 9999,
        minWidth: '160px'
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => { if(isOpen) setIsOpen(false); };
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target) && !e.target.closest('.status-menu-dropdown')) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${currentOption.color.split(' hover')[0]} w-32 justify-between shadow-sm`}
      >
        <span className="truncate">{currentOption.label}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="status-menu-dropdown bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-4 ring-black/5"
          style={menuStyle}
        >
          <div className="p-1.5 space-y-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-colors flex items-center justify-between group ${opt.color}`}
              >
                <span>{opt.label}</span>
                {current === opt.value && <Check size={12} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('invitados');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalType, setModalType] = useState('invitado');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE DATOS ---
  const [invitados, setInvitados] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [tareas, setTareas] = useState([]);

  // --- ESTADOS DE GEMINI ---
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiPromptType, setAiPromptType] = useState("");

  const RESPONSABLES_LISTA = ["Jose", "Luis", "Carlos", "Zara"];
  const RESPONSABLES_GASTOS = ["Jose", "Luis", "Carlos"]; 
  const GRUPOS_LISTA = ["Hermanos Zara", "Sobrinos", "Familia Directa", "Tíos", "Vecinos", "Amigos"];

  // 1. Autenticación (REGLA 3 - CORREGIDA PARA FALLBACK)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Intentar usar token del entorno si existe (para desarrollo interno)
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(auth, __initial_auth_token);
          } catch (tokenError) {
            // Si el token falla (porque usas tu propio proyecto), usar login anónimo
            console.log("Token mismatch (Using custom project), falling back to anonymous auth");
            await signInAnonymously(auth);
          }
        } else {
          // Si no hay token, usar login anónimo directo
          await signInAnonymously(auth);
        }
      } catch (err) { 
        console.error("Error Auth:", err); 
        setLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sincronización en Tiempo Real
  useEffect(() => {
    if (!user) return;

    const unsubGuests = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'invitados'), (s) => {
      setInvitados(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => console.error("Error Guests:", err));

    const unsubExpenses = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'gastos'), (s) => {
      setGastos(s.docs.map(d => {
        const data = d.data();
        return { 
          id: d.id, 
          ...data,
          responsable: Array.isArray(data.responsable) ? data.responsable : (data.responsable ? [data.responsable] : []),
          pagos: data.pagos || {} 
        };
      }));
    }, (err) => console.error("Error Expenses:", err));

    const unsubTasks = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'tareas'), (s) => {
      setTareas(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error Tasks:", err));

    return () => { unsubGuests(); unsubExpenses(); unsubTasks(); };
  }, [user]);

  // --- LÓGICA DE GEMINI ---
  const callGemini = async (prompt, type) => {
    setAiLoading(true);
    setAiPromptType(type);
    setAiResponse("");

    const systemPrompt = `Eres un experto organizador de eventos en Lima. Ayudas a Jose, Luis y Carlos con los 70 años de Zara en el Rímac el 23 de mayo de 2026.`;

    const fetchWithRetry = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta.");
      } catch (err) {
        if (retries > 0) {
          await new Promise(res => setTimeout(res, delay));
          return fetchWithRetry(retries - 1, delay * 2);
        }
        setAiResponse("Error de conexión con el asistente.");
      } finally { setAiLoading(false); }
    };
    fetchWithRetry();
  };

  // --- LÓGICA DE FORMULARIOS ---
  const [formData, setFormData] = useState({});

  const openModal = (type, data = null) => {
    setModalType(type);
    if (data) {
      setFormData({ 
        ...data, 
        responsable: Array.isArray(data.responsable) ? data.responsable : (data.responsable ? [data.responsable] : []),
        pagos: data.pagos || {}
      });
      setEditingId(data.id);
    } else {
      setEditingId(null);
      setFormData(
        type === 'invitado' ? { nombre: '', vinculo: '', grupo: GRUPOS_LISTA[0], adultos: 1, ninos: 0, responsable: [], estado: 'Pendiente' } :
        type === 'gasto' ? { item: '', categoria: 'Otros', costo: 0, responsable: [], pagos: {} } :
        { descripcion: '', responsable: 'Jose', completada: false }
      );
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    const colName = modalType === 'invitado' ? 'invitados' : modalType === 'gasto' ? 'gastos' : 'tareas';
    const colRef = collection(db, 'artifacts', appId, 'public', 'data', colName);

    try {
      if (editingId) {
        await updateDoc(doc(colRef, editingId), formData);
      } else {
        await addDoc(colRef, formData);
      }
      setIsModalOpen(false);
    } catch (err) { console.error("Error Save:", err); }
  };

  const handleDelete = async (id, type) => {
    if (!user) return;
    const colName = type === 'invitado' ? 'invitados' : type === 'gasto' ? 'gastos' : 'tareas';
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, id));
  };

  const toggleResponsableSelection = (nombre) => {
    const currentResps = formData.responsable || [];
    let newResps;
    let newPagos = { ...formData.pagos };

    if (currentResps.includes(nombre)) {
      newResps = currentResps.filter(r => r !== nombre);
    } else {
      newResps = [...currentResps, nombre];
      if (!newPagos[nombre]) newPagos[nombre] = 0;
    }
    setFormData({ ...formData, responsable: newResps, pagos: newPagos });
  };

  const handlePagoChange = (nombre, valor) => {
    setFormData(prev => ({
      ...prev,
      pagos: {
        ...prev.pagos,
        [nombre]: parseFloat(valor) || 0
      }
    }));
  };

  const getResponsableStyle = (nombre) => {
    const styles = {
      'Jose': 'bg-blue-50 text-blue-700 border-blue-100',
      'Luis': 'bg-violet-50 text-violet-700 border-violet-100',
      'Carlos': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Zara': 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return styles[nombre] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // --- CÁLCULOS MEJORADOS ---
  const resumen = useMemo(() => {
    const listaValida = invitados.filter(i => i.estado !== 'Cancelado');
    const totalAdultosLista = listaValida.reduce((acc, i) => acc + (Number(i.adultos) || 0), 0);
    const totalNinosLista = listaValida.reduce((acc, i) => acc + (Number(i.ninos) || 0), 0);
    const totalLista = totalAdultosLista + totalNinosLista;
    const confirmados = listaValida.filter(i => i.estado === 'Confirmado');
    const totalConfirmados = confirmados.reduce((acc, i) => acc + (Number(i.adultos) || 0) + (Number(i.ninos) || 0), 0);
    const pendientes = listaValida.filter(i => i.estado === 'Pendiente');
    const totalPendientes = pendientes.reduce((acc, i) => acc + (Number(i.adultos) || 0) + (Number(i.ninos) || 0), 0);
    
    let presupuestoTotal = 0;
    let presupuestoPagado = 0;

    gastos.forEach(g => {
      const costo = parseFloat(g.costo) || 0;
      presupuestoTotal += costo;
      
      const pagosItem = Object.values(g.pagos || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      presupuestoPagado += Math.min(pagosItem, costo); 
    });

    const presupuestoPendiente = presupuestoTotal - presupuestoPagado;
    
    return { 
      totalLista, totalAdultosLista, totalNinosLista, 
      totalConfirmados, totalPendientes,
      presupuestoTotal, presupuestoPagado, presupuestoPendiente
    };
  }, [invitados, gastos]);

  // --- HANDLERS DE EXPORTACIÓN ---
  const handleExportInvitadosExcel = () => {
    const data = invitados.map(i => ({
      'Invitado': i.nombre,
      'Vínculo': i.vinculo,
      'Grupo Familiar': i.grupo,
      'Adultos': i.adultos,
      'Niños': i.ninos,
      'Estado': i.estado,
      'Responsables': (i.responsable || []).join(', ')
    }));
    exportEngine.toExcel(data, "Asistencia", "Control_Asistencia_Zara70");
  };

  const handleExportInvitadosPDF = () => {
    const columns = ['Invitado', 'Grupo', 'Adultos', 'Niños', 'Estado', 'Resp.'];
    const rows = invitados.map(i => [
      i.nombre,
      i.grupo,
      i.adultos,
      i.ninos,
      i.estado,
      (i.responsable || []).join(', ')
    ]);
    exportEngine.toPDF("Control de Asistencia", columns, rows, "Control_Asistencia_Zara70");
  };

  const handleExportPresupuestoExcel = () => {
    const data = gastos.map(g => {
      const costo = parseFloat(g.costo) || 0;
      const pagado = Object.values(g.pagos || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      const pendiente = Math.max(0, costo - pagado);
      const estado = pagado >= costo ? 'Pagado' : pagado > 0 ? 'En Proceso' : 'Pendiente';
      return {
        'Concepto': g.item,
        'Categoría': g.categoria,
        'Costo Total': costo,
        'Abonado': pagado,
        'Saldo Pendiente': pendiente,
        'Estado Pago': estado,
        'Responsables': (g.responsable || []).join(', ')
      };
    });
    exportEngine.toExcel(data, "Finanzas", "Presupuesto_Zara70");
  };

  const handleExportPresupuestoPDF = () => {
    const columns = ['Concepto', 'Costo', 'Abonado', 'Pendiente', 'Estado'];
    const rows = gastos.map(g => {
      const costo = parseFloat(g.costo) || 0;
      const pagado = Object.values(g.pagos || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      const pendiente = Math.max(0, costo - pagado);
      const estado = pagado >= costo ? 'Pagado' : pagado > 0 ? 'En Proceso' : 'Pendiente';
      return [
        g.item,
        `S/ ${costo.toFixed(2)}`,
        `S/ ${pagado.toFixed(2)}`,
        `S/ ${pendiente.toFixed(2)}`,
        estado
      ];
    });
    exportEngine.toPDF("Reporte Financiero", columns, rows, "Presupuesto_Zara70");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <RefreshCw className="animate-spin mx-auto mb-4 text-indigo-600" size={48} />
        <p className="uppercase font-bold tracking-widest text-xs text-slate-400">Sincronizando Lista de Zara...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header Premium con Dashboard */}
      <header className="bg-indigo-900 text-white p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        {/* Título y Fecha */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-8">
          <div className="flex items-center gap-5">
            <div className="bg-amber-400 p-3 rounded-2xl text-indigo-900 shadow-xl shadow-amber-400/20 transform -rotate-3">
              <Calendar size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">Zara: 70 Años</h1>
              <p className="text-indigo-200 text-xs md:text-sm font-bold mt-1 flex items-center gap-2 opacity-80">
                <MapPin size={14} /> Rímac, Lima • 23 Mayo 2026
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de Métricas */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/20 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="bg-indigo-500/30 p-2 rounded-xl text-indigo-100"><Users size={20} /></div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Total Lista</span>
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">{resumen.totalLista}</span>
              <p className="text-[10px] font-bold text-indigo-200 mt-1">Personas en lista</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex flex-col justify-center gap-3 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2"><Armchair size={16} className="text-indigo-300" /><span className="text-xs font-bold text-indigo-100">Adultos</span></div>
              <span className="text-xl font-black text-white">{resumen.totalAdultosLista}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2"><Baby size={16} className="text-amber-400" /><span className="text-xs font-bold text-amber-100">Niños</span></div>
              <span className="text-xl font-black text-amber-400">{resumen.totalNinosLista}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/20 transition-colors">
            <div className="flex gap-2 mb-2"><span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">Confirmados</span></div>
            <div className="flex items-end gap-3">
              <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tighter leading-none">{resumen.totalConfirmados}</span>
              <div className="text-right flex-1 border-l border-white/10 pl-3">
                 <span className="block text-xl font-bold text-amber-400 leading-none">{resumen.totalPendientes}</span>
                 <span className="text-[9px] font-bold text-amber-200/70 uppercase">Pendientes</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/90 to-teal-800/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/30 flex flex-col justify-between shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="bg-white/20 p-2 rounded-xl text-white"><DollarSign size={20} /></div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100">Presupuesto</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">S/ {resumen.presupuestoTotal.toFixed(2)}</span>
              <p className="text-[10px] font-bold text-emerald-100 mt-1 opacity-80">Estimado total</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto -mt-6 px-4 relative z-20 mb-8">
        <nav className="bg-white rounded-3xl shadow-xl p-2 flex gap-1 border border-slate-100 overflow-x-auto no-scrollbar">
          {[
            { id: 'invitados', label: 'Invitados', icon: Users },
            { id: 'presupuesto', label: 'Presupuesto', icon: DollarSign },
            { id: 'logistica', label: 'Logística', icon: ClipboardList },
            { id: 'asistente', label: 'Asistente ✨', icon: Sparkles },
            { id: 'consola', label: 'Base de Datos 🛠️', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* --- VISTA INVITADOS --- */}
        {activeTab === 'invitados' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-4">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Users size={20} className="text-indigo-600" /> Control de Asistencia
              </h2>
              <div className="flex gap-2">
                <button onClick={handleExportInvitadosExcel} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                  <FileSpreadsheet size={18} /> Excel (.xlsx)
                </button>
                <button onClick={handleExportInvitadosPDF} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                  <Printer size={18} /> PDF
                </button>
                <button onClick={() => openModal('invitado')} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 font-bold text-xs px-5">
                  <PlusCircle size={20} /> Añadir
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[900px] table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                    <th className="px-8 py-5 w-1/4">Invitado</th>
                    <th className="px-4 py-5 text-center w-24">Adultos</th>
                    <th className="px-4 py-5 text-center w-24">Niños</th>
                    <th className="px-6 py-5 w-1/4">Responsables</th>
                    <th className="px-6 py-5 w-40">Estado</th>
                    <th className="px-8 py-5 text-right w-32">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invitados.length === 0 ? (
                    <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-300 font-medium italic">La lista está vacía. ¡Empieza a añadir a la familia!</td></tr>
                  ) : (
                    invitados.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/40 transition-all group overflow-visible">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-800 text-sm mb-1 uppercase">{inv.nombre}</p>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{inv.vinculo} • {inv.grupo}</p>
                        </td>
                        <td className="px-4 py-6 text-center font-bold text-slate-600">{inv.adultos}</td>
                        <td className="px-4 py-6 text-center">
                          <span className={`font-bold ${inv.ninos > 0 ? 'text-amber-500 bg-amber-50 px-2 py-1 rounded-lg' : 'text-slate-200'}`}>{inv.ninos > 0 ? inv.ninos : '-'}</span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-wrap gap-1.5">
                            {inv.responsable?.map(r => (
                              <span key={r} className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-tight border shadow-sm ${getResponsableStyle(r)}`}>{r}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-6 overflow-visible">
                          <StatusSelect current={inv.estado} onChange={(val) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invitados', inv.id), { estado: val })} />
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal('invitado', inv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(inv.id, 'invitado')} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- VISTA PRESUPUESTO --- */}
        {activeTab === 'presupuesto' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Panel de Control Financiero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Pagado */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg relative overflow-hidden flex flex-col justify-center gap-4">
                <div className="absolute right-0 top-0 p-6 opacity-5"><PieChart size={120} /></div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1 rounded-lg w-fit">Pagado Total</p>
                    <span className="text-xs font-bold text-emerald-600">
                      {resumen.presupuestoTotal > 0 ? Math.round((resumen.presupuestoPagado / resumen.presupuestoTotal) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">S/ {resumen.presupuestoPagado.toFixed(2)}</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-50">
                  <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out" style={{ width: `${resumen.presupuestoTotal > 0 ? (resumen.presupuestoPagado / resumen.presupuestoTotal) * 100 : 0}%` }}></div>
                </div>
              </div>
              {/* Card Pendiente */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-inner flex flex-col justify-center gap-4 relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-6 opacity-5 text-indigo-900"><Wallet size={120} /></div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-100 px-3 py-1 rounded-lg w-fit">Pendiente Total</p>
                    <span className="text-xs font-bold text-indigo-400">
                      {resumen.presupuestoTotal > 0 ? Math.round((resumen.presupuestoPendiente / resumen.presupuestoTotal) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-4xl font-black text-indigo-900 tracking-tighter">S/ {resumen.presupuestoPendiente.toFixed(2)}</p>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full transition-all duration-1000 ease-out" style={{ width: `${resumen.presupuestoTotal > 0 ? (resumen.presupuestoPendiente / resumen.presupuestoTotal) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-4">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-600" /> Detalle de Gastos
              </h2>
              <div className="flex gap-2">
                <button onClick={handleExportPresupuestoExcel} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                  <FileSpreadsheet size={18} /> Excel (.xlsx)
                </button>
                <button onClick={handleExportPresupuestoPDF} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                  <Printer size={18} /> PDF
                </button>
                <button onClick={() => openModal('gasto')} className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 font-bold text-xs px-5">
                  <PlusCircle size={20} /> Añadir
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[800px] table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 tracking-wider border-b border-slate-100">
                    <th className="px-8 py-5 w-1/4">Concepto</th>
                    <th className="px-6 py-5 w-1/4">Avance de Pago</th>
                    <th className="px-6 py-5 text-center w-32">Costo Total</th>
                    <th className="px-6 py-5 w-32 text-center">Estado</th>
                    <th className="px-8 py-5 text-right w-24">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {gastos.map(g => {
                    const costoTotal = parseFloat(g.costo) || 0;
                    const pagado = Object.values(g.pagos || {}).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
                    const pendiente = Math.max(0, costoTotal - pagado);
                    const porcentaje = costoTotal > 0 ? (pagado / costoTotal) * 100 : 0;
                    const esPagadoCompleto = pagado >= costoTotal && costoTotal > 0;
                    const enProceso = pagado > 0 && pagado < costoTotal;

                    return (
                      <tr key={g.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-800 text-sm mb-0.5">{g.item}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{g.categoria}</p>
                          {/* Desglose por hermano */}
                          <div className="flex flex-wrap gap-2">
                            {g.responsable?.map(r => {
                              const aporte = g.pagos?.[r] || 0;
                              return (
                                <div key={r} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                  <span className={`w-2 h-2 rounded-full ${getResponsableStyle(r).includes('blue') ? 'bg-blue-400' : r === 'Luis' ? 'bg-violet-400' : 'bg-emerald-400'}`}></span>
                                  <span className="text-[9px] font-bold uppercase text-slate-500">{r}:</span>
                                  <span className="text-[9px] font-black text-slate-700">S/ {aporte}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-6 align-middle">
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                            <div className={`h-full transition-all duration-700 ${esPagadoCompleto ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[9px] font-bold uppercase">
                            <span className="text-emerald-600">Pagado: S/ {pagado.toFixed(2)}</span>
                            <span className="text-rose-500">Falta: S/ {pendiente.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center font-black text-slate-700 text-lg">S/ {costoTotal.toFixed(2)}</td>
                        <td className="px-6 py-6 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            esPagadoCompleto ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                            enProceso ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                            'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>
                            {esPagadoCompleto ? 'Pagado' : enProceso ? 'En Proceso' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openModal('gasto', g)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => handleDelete(g.id, 'gasto')} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-6 flex justify-center border-t border-slate-50">
                 <button onClick={() => openModal('gasto')} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    <PlusCircle size={18} /> Añadir Requerimiento
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* --- CONSOLA, LOGISTICA, ASISTENTE (Sin cambios) --- */}
        {activeTab === 'consola' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
             <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative shadow-2xl overflow-hidden">
                <div className="relative z-10"><h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Consola Raw</h2><p className="text-indigo-200 text-xs font-bold uppercase tracking-widest max-w-xl">Visualización directa de los documentos en la nube para auditoría técnica.</p></div>
                <Code size={160} className="absolute -right-5 -bottom-5 text-white/5 rotate-12" />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100"><div className="p-6 bg-slate-50 border-b flex justify-between items-center font-bold text-[10px] uppercase text-slate-500 tracking-widest"><span>Invitados JSON</span><span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">{invitados.length} DOCS</span></div><div className="p-6 max-h-[400px] overflow-auto bg-slate-900 font-mono text-[10px] text-emerald-400"><pre>{JSON.stringify(invitados, null, 2)}</pre></div></div>
                <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100"><div className="p-6 bg-slate-50 border-b flex justify-between items-center font-bold text-[10px] uppercase text-slate-500 tracking-widest"><span>Presupuesto JSON</span><span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">{gastos.length} DOCS</span></div><div className="p-6 max-h-[400px] overflow-auto bg-slate-900 font-mono text-[10px] text-indigo-300"><pre>{JSON.stringify(gastos, null, 2)}</pre></div></div>
             </div>
          </div>
        )}

        {activeTab === 'logistica' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="bg-indigo-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="text-center md:text-left z-10"><h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Checklist de Tareas</h2><p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Coordinación en vivo entre Jose, Luis y Carlos.</p></div>
               <ListChecks size={80} className="text-white/10 hidden sm:block" />
            </div>
            <div className="flex justify-end px-4"><button onClick={() => openModal('tarea')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2"><PlusCircle size={16} /> Nueva Tarea</button></div>
            <div className="grid gap-3">
              {tareas.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group shadow-sm transition-all hover:border-indigo-100">
                  <div className="flex items-center gap-6">
                    <button onClick={() => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tareas', t.id), { completada: !t.completada })} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${t.completada ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-200'}`}>{t.completada && <Check size={16} strokeWidth={4} />}</button>
                    <div><p className={`font-bold text-sm uppercase tracking-tight ${t.completada ? 'line-through text-slate-300' : 'text-slate-700'}`}>{t.descripcion}</p><span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Responsable: {t.responsable}</span></div>
                  </div>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity"><button onClick={() => openModal('tarea', t)} className="p-2 text-slate-200 hover:text-indigo-600"><Pencil size={16} /></button><button onClick={() => handleDelete(t.id, 'tarea')} className="p-2 text-slate-200 hover:text-rose-500"><Trash2 size={16} /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISTA ASISTENTE AI (Sin cambios) --- */}
        {activeTab === 'asistente' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* ... */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 text-center md:text-left"><div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0"><Sparkles size={24} className="text-amber-300" /></div><h2 className="text-3xl font-black uppercase tracking-tighter">Planificación Inteligente ✨</h2><p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-2 max-w-lg leading-relaxed mx-auto md:mx-0">Utiliza el poder de Gemini para optimizar los detalles de los 70 años de Zara.</p></div>
              <Sparkles className="absolute top-1/2 right-10 -translate-y-1/2 text-white/5 w-64 h-64 rotate-12 hidden md:block" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Menú Inteligente ✨", desc: "Buffet sugerido por IA.", icon: Utensils, color: "bg-orange-500", prompt: `Sugiere un menú criollo premium para ${resumen.totalAdultosLista} adultos y ${resumen.totalNinosLista} niños en el Rímac.` },
                { title: "Redactar Invitación ✨", desc: "Textos para WhatsApp.", icon: MessageSquare, color: "bg-blue-500", prompt: "Redacta invitaciones emotivas para los 70 años de Zara." },
                { title: "Playlist Temática ✨", desc: "Música 60s, 70s y más.", icon: Music, color: "bg-indigo-500", prompt: "Lista de 20 canciones para fiesta de 70 años (nació en 1954)." }
              ].map((feature, idx) => (
                <button key={idx} onClick={() => callGemini(feature.prompt, feature.title)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-left flex flex-col items-start group">
                  <div className={`${feature.color} text-white p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}><feature.icon size={24} /></div><h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm mb-1">{feature.title}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feature.desc}</p>
                </button>
              ))}
            </div>
            {(aiLoading || aiResponse) && (<div className="bg-white rounded-[3rem] shadow-2xl border border-indigo-50 overflow-hidden animate-in slide-in-from-top-4 duration-500"><div className="bg-indigo-50 p-6 flex items-center justify-between border-b border-indigo-100 font-black text-[10px] uppercase tracking-widest text-indigo-900"><div className="flex items-center gap-3"><Sparkles size={18} className="text-indigo-600" /><span>Sugerencia: {aiPromptType}</span></div>{aiLoading && <Loader2 className="animate-spin" size={18} />}</div><div className="p-10 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">{aiLoading ? "Gemini está pensando en la mejor opción..." : aiResponse}{!aiLoading && <button onClick={() => navigator.clipboard.writeText(aiResponse)} className="mt-8 block bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Copiar Respuesta</button>}</div></div>)}
          </div>
        )}
      </main>

      {/* MODAL MULTIPROPÓSITO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 my-8 border border-white/20">
            <div className="bg-indigo-900 p-8 text-white flex justify-between items-center">
              <h3 className="font-bold text-xl uppercase tracking-widest flex items-center gap-3 italic">
                {editingId ? 'Editar Registro' : 'Añadir Registro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              {modalType === 'invitado' && (
                <>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</label><input type="text" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50/50 uppercase" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Adultos</label><input type="number" min="1" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-indigo-500 transition-all bg-slate-50/50" value={formData.adultos} onChange={(e) => setFormData({...formData, adultos: Number(e.target.value)})} /></div><div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Niños</label><input type="number" min="0" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-indigo-500 transition-all bg-slate-50/50" value={formData.ninos} onChange={(e) => setFormData({...formData, ninos: Number(e.target.value)})} /></div></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Vínculo</label><input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50/50 outline-none focus:border-indigo-500 transition-all" value={formData.vinculo} onChange={(e) => setFormData({...formData, vinculo: e.target.value})} /></div><div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Grupo</label><select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-indigo-500 transition-all bg-slate-50/50" value={formData.grupo} onChange={(e) => setFormData({...formData, grupo: e.target.value})}>{GRUPOS_LISTA.map(g => <option key={g} value={g}>{g}</option>)}</select></div></div>
                  <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Responsables (Múltiple)</label><div className="grid grid-cols-2 gap-2">{RESPONSABLES_LISTA.map(nombre => (<button key={nombre} type="button" onClick={() => toggleResponsableSelection(nombre)} className={`py-3.5 rounded-2xl border-2 font-bold text-[10px] transition-all flex items-center justify-center gap-2 uppercase tracking-tight ${formData.responsable?.includes(nombre) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>{formData.responsable?.includes(nombre) && <Check size={12} strokeWidth={4} />} {nombre}</button>))}</div></div>
                </>
              )}

              {modalType === 'gasto' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Concepto del Gasto</label>
                    <input type="text" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-700 bg-slate-50/50" value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Monto Estimado</label><input type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-indigo-500 transition-all bg-slate-50/50" value={formData.costo} onChange={(e) => setFormData({...formData, costo: Number(e.target.value)})} /></div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Categoría</label>
                        <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold focus:border-indigo-500 transition-all bg-slate-50/50" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                           <option value="Catering">Catering</option><option value="Música">Música</option><option value="Local">Local</option><option value="Decoración">Decoración</option><option value="Otros">Otros</option>
                        </select>
                     </div>
                  </div>
                  
                  {/* SELECCIÓN DE RESPONSABLES (SOLO HERMANOS) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-indigo-600">Responsables del Pago</label>
                    <div className="grid grid-cols-3 gap-2">
                      {RESPONSABLES_GASTOS.map(nombre => (
                        <button key={nombre} type="button" onClick={() => toggleResponsableSelection(nombre)} className={`py-3.5 rounded-2xl border-2 font-bold text-[10px] transition-all flex items-center justify-center gap-2 uppercase tracking-tight ${formData.responsable?.includes(nombre) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                          {formData.responsable?.includes(nombre) && <Check size={12} strokeWidth={4} />} {nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUTS DE ADELANTOS DINÁMICOS */}
                  {formData.responsable && formData.responsable.length > 0 && (
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
                        <Coins size={14} /> Registro de Abonos
                      </div>
                      {formData.responsable.map(nombre => (
                        <div key={nombre} className="flex items-center gap-4">
                          <span className={`w-24 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl border bg-white ${getResponsableStyle(nombre)}`}>{nombre}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">S/</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0"
                              placeholder="0.00"
                              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all bg-white"
                              value={formData.pagos?.[nombre] || ''}
                              onChange={(e) => handlePagoChange(nombre, e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {modalType === 'tarea' && (
                <>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Descripción de Tarea</label><textarea required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold outline-none h-32 bg-slate-50/50 focus:border-indigo-500 transition-all" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})}></textarea></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Asignar a:</label><select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold bg-white outline-none focus:border-indigo-500" value={formData.responsable} onChange={(e) => setFormData({...formData, responsable: e.target.value})}>{RESPONSABLES_LISTA.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                </>
              )}

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Cerrar</button>
                <button type="submit" className="flex-1 py-5 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-100 uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"><Save size={14} /> Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;