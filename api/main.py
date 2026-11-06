from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class ListrikInput(BaseModel):
    ampere: float
    volt: float
    qty_mesin: int
    harga_listrik: float

class ListrikPOInput(BaseModel):
    ampere: float
    volt: float
    qty_mesin: int
    harga_listrik: float
    qty_po: int
    ct_per_pcs: float

class GasInput(BaseModel):
    flow_gas: float
    qty_mesin: int
    harga_gas: float

class GasPOInput(BaseModel):
    flow_gas: float
    qty_mesin: int
    harga_gas: float
    qty_po: int
    ct_per_pcs: float

class PlateInput(BaseModel):
    lebar: float
    tebal: float
    panjang: float
    massa_jenis: float
    harga_material: float

class PipeInput(BaseModel):
    out_diameter: float
    tebal: float
    panjang: float
    massa_jenis: float
    harga_material: float

class POInput(BaseModel):
    qty_po: int
    ct_per_pcs: float

# --- ENDPOINTS ---

@app.post("/api/kalkulasi/listrik")
def kalkulasi_listrik(data: ListrikInput):
    # Rumus 1: ((Ampere * Volt)/1000) * Qty Mesin
    kwh_total_jam = ((data.ampere * data.volt) / 1000) * data.qty_mesin
    biaya_jam = kwh_total_jam * data.harga_listrik
    
    return {
        "kwh_per_jam": round(kwh_total_jam, 2),
        "biaya_per_jam": round(biaya_jam, 2)
    }

@app.post("/api/kalkulasi/listrik-po")
def kalkulasi_listrik_po(data: ListrikPOInput):
    # Rumus 1
    kwh_total_jam = ((data.ampere * data.volt) / 1000) * data.qty_mesin
    
    # Rumus 4: Waktu PO (Jam)
    jam_po = (data.qty_po * data.ct_per_pcs) / 3600
    
    # Kombinasi
    total_kwh_po = kwh_total_jam * jam_po
    total_biaya_po = total_kwh_po * data.harga_listrik

    return {
        "jam_po": round(jam_po, 2),
        "total_kwh_po": round(total_kwh_po, 2),
        "total_biaya_po": round(total_biaya_po, 2)
    }

@app.post("/api/kalkulasi/gas")
def kalkulasi_gas(data: GasInput):
    # Rumus 2: (Flow gas L / Min * 60) * 85% -> konversi m3 (dibagi 1000) * Qty Mesin
    liter_per_jam_efektif = (data.flow_gas * 60) * 0.85
    m3_per_jam_total = (liter_per_jam_efektif / 1000) * data.qty_mesin
    biaya_jam = m3_per_jam_total * data.harga_gas
    
    return {
        "m3_per_jam": round(m3_per_jam_total, 3),
        "biaya_per_jam": round(biaya_jam, 2)
    }

@app.post("/api/kalkulasi/gas-po")
def kalkulasi_gas_po(data: GasPOInput):
    # Rumus 2
    liter_per_jam_efektif = (data.flow_gas * 60) * 0.85
    m3_per_jam_total = (liter_per_jam_efektif / 1000) * data.qty_mesin
    
    # Rumus 4: Waktu PO (Jam)
    jam_po = (data.qty_po * data.ct_per_pcs) / 3600
    
    # Kombinasi
    total_m3_po = m3_per_jam_total * jam_po
    total_biaya_po = total_m3_po * data.harga_gas

    return {
        "jam_po": round(jam_po, 2),
        "total_m3_po": round(total_m3_po, 3),
        "total_biaya_po": round(total_biaya_po, 2)
    }

@app.post("/api/kalkulasi/material/plate")
def kalkulasi_plate(data: PlateInput):
    # Rumus 3 Plate: Lebar * Tebal * Panjang * Massa Jenis / 1.000.000
    berat_kg = (data.lebar * data.tebal * data.panjang * data.massa_jenis) / 1_000_000
    biaya = berat_kg * data.harga_material
    
    return {
        "berat_kg": round(berat_kg, 2),
        "total_biaya": round(biaya, 2)
    }

@app.post("/api/kalkulasi/material/pipe")
def kalkulasi_pipe(data: PipeInput):
    # Rumus 3 Pipe: ((Out Diameter * 3,14) - 50% Tebal ) * 3,14 * Tebal * Panjang * Massa Jenis / 1.000.000
    komponen_diameter = (data.out_diameter * 3.14) - (data.tebal)
    berat_kg = (komponen_diameter  * data.tebal * data.panjang * data.massa_jenis) / 1_000_000
    biaya = berat_kg * data.harga_material
    
    return {
        "berat_kg": round(berat_kg, 2),
        "total_biaya": round(biaya, 2)
    }

@app.post("/api/kalkulasi/po")
def kalkulasi_waktu_po(data: POInput):
    # Rumus 4: Waktu PO (Jam)
    jam_po = (data.qty_po * data.ct_per_pcs) / 3600
    
    return {
        "total_jam_po": round(jam_po, 2)
    }