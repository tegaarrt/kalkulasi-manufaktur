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
  jumlahUnit: number;
  massaJenis: number;
  hargaMaterial: number;
  // Machining
  qtyLubang: number;
  dalam: number;
  diameterPoket: number;
  panjangPoket: number;
  lebarPoket: number;
  putaranPerMm: number;
  waktuPerMm: number;
  pemakananPerPass: number;
  waktuPerPass: number;
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

// Waktu machining dalam detik, ditampilkan juga dalam menit dan jam.
const waktuMachining = (detik: number) => ({
  waktu_detik: bulatkan(detik, 2),
  waktu_menit: bulatkan(detik / 60, 2),
  waktu_jam: bulatkan(detik / 3600, 2),
});

// Berat dan harga satu unit, lalu dikalikan jumlah unit.
const hasilMaterial = (beratUnit: number, d: InputKalkulasi) => ({
  jumlah_unit: d.jumlahUnit,
  berat_unit_kg: bulatkan(beratUnit, 2),
  biaya_unit: bulatkan(beratUnit * d.hargaMaterial, 2),
  berat_kg: bulatkan(beratUnit * d.jumlahUnit, 2),
  total_biaya: bulatkan(beratUnit * d.hargaMaterial * d.jumlahUnit, 2),
});

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
      return hasilMaterial(berat, d);
    }
    case 6: {
      const keliling = d.outDiameter * 3.14 - d.tebal;
      const berat = (keliling * d.tebal * d.panjang * d.massaJenis) / 1_000_000;
      return hasilMaterial(berat, d);
    }
    case 7:
      return { total_jam_po: bulatkan(jamPO(d), 2) };
    case 8: {
      // Poket bulat: keliling lubang x depth x putaran per mm x qty lubang
      const bentangan = d.diameterPoket * 3.14;
      const total = bentangan * d.dalam * d.putaranPerMm * d.qtyLubang;
      return {
        bentangan_mm: bulatkan(bentangan, 2),
        total_length_mm: bulatkan(total, 2),
        ...waktuMachining(total * d.waktuPerMm),
      };
    }
    case 9: {
      // Poket kotak: panjang x lebar x depth x qty lubang
      const total = d.panjangPoket * d.lebarPoket * d.dalam * d.qtyLubang;
      return {
        total_length_mm: bulatkan(total, 2),
        ...waktuMachining(total * d.waktuPerMm),
      };
    }
    case 10: {
      // Drill: (qty lubang x depth) / pemakanan per langkah x waktu per langkah
      const total = d.qtyLubang * d.dalam;
      const jumlahPemakanan = total / d.pemakananPerPass;
      return {
        total_length_mm: bulatkan(total, 2),
        jumlah_pemakanan: bulatkan(jumlahPemakanan, 2),
        ...waktuMachining(jumlahPemakanan * d.waktuPerPass),
      };
    }
    default:
      return {};
  }
}
