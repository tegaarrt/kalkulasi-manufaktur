// Rumus dari api/main.py, sekarang dijalankan langsung di perangkat.

export type Hasil = Record<string, number>;

export type InputKalkulasi = {
  ampere: number;
  volt: number;
  qtyMesin: number;
  hargaListrik: number;
  flowGas: number;
  hargaGas: number;
  qtyPO: number;
  ctPerPcs: number;
  lebar: number;
  tebal: number;
  panjang: number;
  outDiameter: number;
  massaJenis: number;
  hargaMaterial: number;
};

// Sama dengan round() Python: nilai yang tepat di tengah dibulatkan ke angka genap.
export function bulatkan(x: number, digit: number): number {
  if (!Number.isFinite(x) || Math.abs(x) >= 1e21) return x;
  const [bulat, pecahan] = Math.abs(x).toFixed(100).split(".");
  const sisa = pecahan.slice(digit);
  const tepatDiTengah = sisa[0] === "5" && /^0*$/.test(sisa.slice(1));
  if (!tepatDiTengah) return Number(x.toFixed(digit));

  const terpotong = bulat + pecahan.slice(0, digit);
  const genap = Number(terpotong[terpotong.length - 1]) % 2 === 0;
  if (!genap) return Number(x.toFixed(digit));
  return Number(`${x < 0 ? "-" : ""}${bulat}.${pecahan.slice(0, digit)}`);
}

const jamPO = (d: InputKalkulasi) => (d.qtyPO * d.ctPerPcs) / 3600;
const kwhPerJam = (d: InputKalkulasi) => ((d.ampere * d.volt) / 1000) * d.qtyMesin;
const m3PerJam = (d: InputKalkulasi) => ((d.flowGas * 60 * 0.85) / 1000) * d.qtyMesin;

export function hitung(tool: number, d: InputKalkulasi): Hasil {
  switch (tool) {
    case 1: {
      const kwh = kwhPerJam(d);
      return {
        kwh_per_jam: bulatkan(kwh, 2),
        biaya_per_jam: bulatkan(kwh * d.hargaListrik, 2),
      };
    }
    case 2: {
      const kwh = kwhPerJam(d);
      const jam = jamPO(d);
      const totalKwh = kwh * jam;
      return {
        kwh_base: bulatkan(kwh, 2),
        biaya_base: bulatkan(kwh * d.hargaListrik, 2),
        jam_po: bulatkan(jam, 2),
        total_kwh_po: bulatkan(totalKwh, 2),
        total_biaya_po: bulatkan(totalKwh * d.hargaListrik, 2),
      };
    }
    case 3: {
      const m3 = m3PerJam(d);
      return {
        m3_per_jam: bulatkan(m3, 3),
        biaya_per_jam: bulatkan(m3 * d.hargaGas, 2),
      };
    }
    case 4: {
      const m3 = m3PerJam(d);
      const jam = jamPO(d);
      const totalM3 = m3 * jam;
      return {
        m3_base: bulatkan(m3, 3),
        biaya_base: bulatkan(m3 * d.hargaGas, 2),
        jam_po: bulatkan(jam, 2),
        total_m3_po: bulatkan(totalM3, 3),
        total_biaya_po: bulatkan(totalM3 * d.hargaGas, 2),
      };
    }
    case 5: {
      const berat = (d.lebar * d.tebal * d.panjang * d.massaJenis) / 1_000_000;
      return {
        berat_kg: bulatkan(berat, 2),
        total_biaya: bulatkan(berat * d.hargaMaterial, 2),
      };
    }
    case 6: {
      const keliling = d.outDiameter * 3.14 - d.tebal;
      const berat = (keliling * d.tebal * d.panjang * d.massaJenis) / 1_000_000;
      return {
        berat_kg: bulatkan(berat, 2),
        total_biaya: bulatkan(berat * d.hargaMaterial, 2),
      };
    }
    case 7:
      return { total_jam_po: bulatkan(jamPO(d), 2) };
    default:
      return {};
  }
}
