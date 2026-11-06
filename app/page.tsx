"use client";
import React, { useState } from 'react';
import { 
  Home, PenTool, Database, Zap, Flame, Package, Clock, Calculator, CheckCircle2,
  ChevronDown, ChevronRight, BarChart2, Menu, X, ChevronLeft
} from 'lucide-react';

export default function ManufacturingDashboard() {
  const [activeTool, setActiveTool] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>("listrik");
  
  // --- STATE: SIDEBAR RESPONSIVE & COLLAPSE ---
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // --- STATE: HARGA DINAMIS ---
  const [hargaListrik, setHargaListrik] = useState(1500);
  const [hargaGas, setHargaGas] = useState(11000);
  const [hargaMaterial, setHargaMaterial] = useState(15000);

  // --- STATE: INPUT UMUM ---
  const [qtyMesin, setQtyMesin] = useState(3);
  const [qtyPO, setQtyPO] = useState(1000);
  const [ctPerPcs, setCtPerPcs] = useState(45);

  // --- STATE: LISTRIK & GAS ---
  const [ampere, setAmpere] = useState(100);
  const [volt, setVolt] = useState(220);
  const [flowGas, setFlowGas] = useState(15);

  // --- STATE: MATERIAL ---
  const [jenisMaterial, setJenisMaterial] = useState("SPHC");
  const [massaJenis, setMassaJenis] = useState(7.85);
  const [panjang, setPanjang] = useState(2438);
  const [tebal, setTebal] = useState(2.3);
  const [lebar, setLebar] = useState(1219);
  const [outDiameter, setOutDiameter] = useState(50);

  const [hasil, setHasil] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setJenisMaterial(val);
    if (val === "SUS") setMassaJenis(7.75);
    else setMassaJenis(7.85);
  };

  const toggleMenu = (menuId: string) => {
    if (isDesktopCollapsed) setIsDesktopCollapsed(false);
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const hitungKalkulasi = async () => {
    setIsLoading(true);
    let endpoint = "";
    let payload = {};

    switch (activeTool) {
      case 1: endpoint = "/api/kalkulasi/listrik"; payload = { ampere, volt, qty_mesin: qtyMesin, harga_listrik: hargaListrik }; break;
      case 2: endpoint = "/api/kalkulasi/listrik-po"; payload = { ampere, volt, qty_mesin: qtyMesin, harga_listrik: hargaListrik, qty_po: qtyPO, ct_per_pcs: ctPerPcs }; break;
      case 3: endpoint = "/api/kalkulasi/gas"; payload = { flow_gas: flowGas, qty_mesin: qtyMesin, harga_gas: hargaGas }; break;
      case 4: endpoint = "/api/kalkulasi/gas-po"; payload = { flow_gas: flowGas, qty_mesin: qtyMesin, harga_gas: hargaGas, qty_po: qtyPO, ct_per_pcs: ctPerPcs }; break;
      case 5: endpoint = "/api/kalkulasi/material/plate"; payload = { lebar, tebal, panjang, massa_jenis: massaJenis, harga_material: hargaMaterial }; break;
      case 6: endpoint = "/api/kalkulasi/material/pipe"; payload = { out_diameter: outDiameter, tebal, panjang, massa_jenis: massaJenis, harga_material: hargaMaterial }; break;
      case 7: endpoint = "/api/kalkulasi/po"; payload = { qty_po: qtyPO, ct_per_pcs: ctPerPcs }; break;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      setHasil(data);
      if (window.innerWidth < 1024) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      console.error("API Error", err);
    }
    setIsLoading(false);
  };

  const menuCategories = [
    { id: 'listrik', title: 'Kalkulasi Listrik', icon: Zap, submenus: [{ id: 1, name: "Listrik Standar" }, { id: 2, name: "Listrik + Estimasi PO" }] },
    { id: 'gas', title: 'Kalkulasi Gas', icon: Flame, submenus: [{ id: 3, name: "Gas Standar" }, { id: 4, name: "Gas + Estimasi PO" }] },
    { id: 'material', title: 'Berat Material', icon: Package, submenus: [{ id: 5, name: "Plate" }, { id: 6, name: "Pipe" }] },
    { id: 'po', title: 'Menghitung PO', icon: Clock, submenus: [{ id: 7, name: "Kalkulasi Waktu PO" }] }
  ];

  const getActiveToolName = () => {
    for (const cat of menuCategories) {
      const found = cat.submenus.find(s => s.id === activeTool);
      if (found) return found.name;
    }
    return "";
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* OVERLAY MOBILE SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-[#1e3250] text-white flex flex-col transition-all duration-300 lg:static 
        ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} 
        ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className={`p-4 flex items-center border-b border-white/10 ${isDesktopCollapsed ? 'justify-center lg:px-0' : 'justify-between lg:justify-start lg:gap-3'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-green-500 p-1.5 rounded-full shrink-0"><Database size={20} className="text-white"/></div>
            <div className={`transition-opacity duration-300 whitespace-nowrap ${isDesktopCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
              <h1 className="font-bold text-sm leading-tight">Kalkulasi Manufaktur</h1>
              <p className="text-[10px] text-slate-300">Integrated Digital System</p>
            </div>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-300 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden pb-20 lg:pb-4 custom-scrollbar">
          <button className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors ${isDesktopCollapsed ? 'justify-center' : ''}`}>
            <Home size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isDesktopCollapsed ? 'lg:opacity-0 lg:w-0 lg:hidden' : 'opacity-100'}`}>Home</span>
          </button>
          
          <div className="mt-2">
            <div className={`flex items-center bg-blue-600 rounded-lg text-white mb-2 transition-all duration-300 ${isDesktopCollapsed ? 'px-0 py-2 justify-center w-10 mx-auto' : 'px-4 py-2 gap-3 w-full'}`}>
              <PenTool size={18} className="shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isDesktopCollapsed ? 'lg:hidden' : 'block'}`}>Tools Calculation</span>
            </div>
            
            <div className="flex flex-col gap-1">
              {menuCategories.map((category) => (
                <div key={category.id} className="flex flex-col group">
                  <button 
                    onClick={() => toggleMenu(category.id)}
                    className={`flex items-center rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-300 ${isDesktopCollapsed ? 'px-0 py-2.5 justify-center w-10 mx-auto' : 'px-3 py-2.5 justify-between w-full'}`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon size={20} className="shrink-0" />
                      <span className={`whitespace-nowrap transition-all duration-300 ${isDesktopCollapsed ? 'lg:hidden' : 'block'}`}>{category.title}</span>
                    </div>
                    {!isDesktopCollapsed && (openMenu === category.id ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />)}
                  </button>
                  
                  {openMenu === category.id && !isDesktopCollapsed && (
                    <div className="flex flex-col gap-1 pl-10 pr-2 mt-1 mb-2">
                      {category.submenus.map((sub) => (
                        <button 
                          key={sub.id}
                          onClick={() => { setActiveTool(sub.id); setHasil({}); setIsMobileSidebarOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeTool === sub.id ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex p-4 border-t border-white/10 items-center justify-center">
          <button 
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-slate-300 hover:text-white transition-all"
          >
            <ChevronLeft size={20} className={`transition-transform duration-300 ${isDesktopCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white px-4 md:px-8 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-md text-slate-600">
              <Menu size={20} />
            </button>
            <button onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} className="hidden lg:block p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-[#1e3250] leading-tight">Quick Calculation Tools</h2>
              <p className="text-xs md:text-sm text-slate-500">Fast • Accurate • Efficient</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="bg-[#1e3250] text-white p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
                <PenTool size={18} /> {getActiveToolName()}
              </div>
            </div>
            
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
              
              {/* INPUT PANEL */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-semibold text-slate-700 border-b pb-2">
                  <PenTool size={18}/> Parameter Input
                </div>
                
                <div className="space-y-4 text-xs md:text-sm mt-2">
                  {(activeTool === 1 || activeTool === 2) && (
                    <div className="flex justify-between items-center bg-blue-50 p-2 md:p-3 rounded-md">
                      <label className="w-1/2">Harga Listrik (Rp/kWh)</label>
                      <input type="number" value={hargaListrik} onChange={e => setHargaListrik(Number(e.target.value))} className="border border-blue-200 rounded-md px-3 py-1.5 w-1/2 md:w-32 text-right text-blue-700 font-bold" />
                    </div>
                  )}
                  {(activeTool === 3 || activeTool === 4) && (
                    <div className="flex justify-between items-center bg-green-50 p-2 md:p-3 rounded-md">
                      <label className="w-1/2">Harga Gas (Rp/m³)</label>
                      <input type="number" value={hargaGas} onChange={e => setHargaGas(Number(e.target.value))} className="border border-green-200 rounded-md px-3 py-1.5 w-1/2 md:w-32 text-right text-green-700 font-bold" />
                    </div>
                  )}
                  {(activeTool === 5 || activeTool === 6) && (
                    <div className="flex justify-between items-center bg-purple-50 p-2 md:p-3 rounded-md">
                      <label className="w-1/2">Harga Material (Rp/Kg)</label>
                      <input type="number" value={hargaMaterial} onChange={e => setHargaMaterial(Number(e.target.value))} className="border border-purple-200 rounded-md px-3 py-1.5 w-1/2 md:w-32 text-right text-purple-700 font-bold" />
                    </div>
                  )}

                  {(activeTool === 1 || activeTool === 2) && (
                    <>
                      <div className="flex justify-between items-center"><label>Ampere (A)</label><input type="number" value={ampere} onChange={e => setAmpere(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                      <div className="flex justify-between items-center"><label>Volt (V)</label><input type="number" value={volt} onChange={e => setVolt(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                      <div className="flex justify-between items-center"><label>Jumlah Unit Mesin</label><input type="number" value={qtyMesin} onChange={e => setQtyMesin(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                    </>
                  )}

                  {(activeTool === 3 || activeTool === 4) && (
                    <>
                      <div className="flex justify-between items-center"><label>Flow Gas (L/Min)</label><input type="number" value={flowGas} onChange={e => setFlowGas(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                      <div className="flex justify-between items-center"><label>Jumlah Unit Mesin</label><input type="number" value={qtyMesin} onChange={e => setQtyMesin(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                    </>
                  )}

                  {(activeTool === 5 || activeTool === 6) && (
                    <>
                      <div className="flex justify-between items-center">
                        <label>Jenis Material</label>
                        <select value={jenisMaterial} onChange={handleMaterialChange} className="border rounded-md px-3 py-1.5 w-24 md:w-32 bg-white">
                          <option value="SPHC">SPHC</option>
                          <option value="STKM">STKM</option>
                          <option value="SUS">SUS</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <label>Massa Jenis</label>
                        <input type="number" value={massaJenis} disabled className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right bg-slate-100 text-slate-500" />
                      </div>
                      <div className="flex justify-between items-center"><label>Tebal (mm)</label><input type="number" value={tebal} onChange={e => setTebal(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                      <div className="flex justify-between items-center"><label>Panjang (mm)</label><input type="number" value={panjang} onChange={e => setPanjang(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                    </>
                  )}

                  {activeTool === 5 && (
                    <div className="flex justify-between items-center"><label>Lebar (mm)</label><input type="number" value={lebar} onChange={e => setLebar(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                  )}

                  {activeTool === 6 && (
                    <div className="flex justify-between items-center"><label>Out Diameter (mm)</label><input type="number" value={outDiameter} onChange={e => setOutDiameter(Number(e.target.value))} className="border rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                  )}

                  {(activeTool === 2 || activeTool === 4 || activeTool === 7) && (
                    <div className={activeTool !== 7 ? "border-t border-dashed pt-4 mt-2" : ""}>
                      <div className="flex justify-between items-center mb-2"><label className="font-semibold text-slate-700">Jumlah PO (Pcs)</label><input type="number" value={qtyPO} onChange={e => setQtyPO(Number(e.target.value))} className="border border-slate-300 rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                      <div className="flex justify-between items-center"><label className="font-semibold text-slate-700">Cycle Time (Detik/Pcs)</label><input type="number" value={ctPerPcs} onChange={e => setCtPerPcs(Number(e.target.value))} className="border border-slate-300 rounded-md px-3 py-1.5 w-24 md:w-32 text-right" /></div>
                    </div>
                  )}
                </div>

                <button onClick={hitungKalkulasi} disabled={isLoading} className="w-full bg-[#1e3250] hover:bg-slate-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors">
                  <Calculator size={18} /> {isLoading ? "Menghitung..." : "Hitung Sekarang"}
                </button>
              </div>

              {/* OUTPUT PANEL */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-semibold text-[#1e3250] border-b pb-2">
                  <CheckCircle2 size={18}/> Hasil Kalkulasi
                </div>

                <div className="border rounded-xl p-4 md:p-6 mt-2 flex flex-col gap-4 relative overflow-hidden bg-slate-50 shadow-sm h-full min-h-[250px]">
                  {Object.keys(hasil).length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-xs md:text-sm flex-col gap-2 text-center">
                      <BarChart2 size={40} className="opacity-20" />
                      <p>Silakan isi parameter dan klik "Hitung Sekarang"</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:gap-4 w-full">
                      {(activeTool === 1 || activeTool === 3) && (
                        <>
                          <div className="bg-white border rounded-lg p-3 md:p-4 flex justify-between items-center">
                            <span className="text-slate-500 font-medium text-xs md:text-sm">Konsumsi per Jam</span>
                            <span className="text-lg md:text-xl font-bold text-slate-800">{activeTool === 1 ? `${hasil.kwh_per_jam} kWh` : `${hasil.m3_per_jam} m³`}</span>
                          </div>
                          <div className="bg-white border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between md:items-center border-l-4 border-l-blue-500 gap-1">
                            <span className="text-slate-500 font-medium text-xs md:text-sm">Estimasi Biaya / Jam</span>
                            <span className="text-xl md:text-2xl font-bold text-blue-600">Rp {hasil.biaya_per_jam.toLocaleString('id-ID')}</span>
                          </div>
                        </>
                      )}

                      {(activeTool === 2 || activeTool === 4) && (
                        <>
                          <div className="bg-white border rounded-lg p-3 md:p-4 flex justify-between items-center">
                            <span className="text-slate-500 font-medium text-xs md:text-sm">Total Waktu PO</span>
                            <span className="text-base md:text-lg font-bold text-slate-800">{hasil.jam_po} Jam</span>
                          </div>
                          <div className="bg-[#1e3250] border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between md:items-center text-white shadow-md gap-1">
                            <span className="font-medium text-slate-200 text-xs md:text-sm">Total Biaya PO</span>
                            <span className="text-xl md:text-2xl font-bold">Rp {hasil.total_biaya_po.toLocaleString('id-ID')}</span>
                          </div>
                        </>
                      )}

                      {(activeTool === 5 || activeTool === 6) && (
                        <>
                          <div className="bg-white border rounded-lg p-3 md:p-4 flex justify-between items-center">
                            <span className="text-slate-500 font-medium text-xs md:text-sm">Total Berat Material</span>
                            <span className="text-lg md:text-xl font-bold text-slate-800">{hasil.berat_kg} Kg</span>
                          </div>
                          <div className="bg-white border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between md:items-center border-l-4 border-l-purple-500 gap-1">
                            <span className="text-slate-500 font-medium text-xs md:text-sm">Estimasi Harga Pokok</span>
                            <span className="text-xl md:text-2xl font-bold text-purple-600">Rp {hasil.total_biaya.toLocaleString('id-ID')}</span>
                          </div>
                        </>
                      )}

                      {activeTool === 7 && (
                        <div className="bg-white border rounded-lg p-4 md:p-6 flex flex-col gap-2 items-center justify-center border-t-4 border-t-emerald-500">
                           <span className="text-slate-500 font-medium text-xs md:text-sm text-center">Estimasi Total Waktu PO</span>
                           <span className="text-3xl md:text-4xl font-bold text-emerald-600">{hasil.total_jam_po} Jam</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}