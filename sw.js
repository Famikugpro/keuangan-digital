<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catat Keuangan | DaffCv Pro</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#111827">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <!-- Firebase SDK (Modular) -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        // ==========================================
        // MASUKKAN KONFIGURASI FIREBASE ANDA DI SINI
        // ==========================================
        const firebaseConfig = {
            apiKey: "AIzaSyDq6ryYiRXF2oDz8wfVoXrROaw8YhBlzA",
            authDomain: "daffcv-keuangan.firebaseapp.com",
            projectId: "daffcv-keuangan",
            storageBucket: "daffcv-keuangan.firebasestorage.app",
            messagingSenderId: "73351594108",
            appId: "1:73351594108:web:6d5cbe27864ae67b99c9f9",
            measurementId: "G-VGGVZ0DXGK"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        window.db = db;
        window.firebaseFuncs = { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp };
    </script>
    <style>
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4b5563; }

        @keyframes logoEnter {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-logo { animation: logoEnter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes pulseAlert {
            0%, 100% { border-color: rgba(239, 68, 68, 1); }
            50% { border-color: rgba(239, 68, 68, 0.2); }
        }
        .extreme-alert { animation: pulseAlert 1s infinite; }
    </style>
</head>
<body class="bg-gray-900 text-gray-200 font-sans antialiased min-h-screen">

    <!-- Splash Screen & Auth (UID Verification) -->
    <div id="splash-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-500 p-4">
        <div id="splash-content" class="text-center transition-opacity duration-500">
            <h1 class="text-5xl md:text-7xl font-bold tracking-wider text-white">
                Daff<span class="text-blue-500">Cv</span>
            </h1>
            <p class="mt-4 text-gray-500 text-sm tracking-[0.3em] uppercase">
                Financial Dev By dxffaa_
            </p>
        </div>

        <!-- Kotak Input UID -->
        <div id="uid-box" class="hidden bg-gray-800 border border-gray-700 p-6 rounded-xl max-w-md w-full shadow-2xl mt-6 animate-logo">
            <h3 class="text-lg font-bold text-white mb-2 text-center">Akses Terbatas</h3>
            <p class="text-xs text-gray-400 mb-4 text-center">Masukkan UID yang telah terdaftar oleh Admin DaffCv untuk melanjutkan.</p>
            <form id="form-uid" class="space-y-4">
                <input type="text" id="input-uid" required placeholder="Masukkan UID Anda (Contoh: daffa-001)" 
                    class="w-full bg-gray-900 border border-gray-700 text-white text-center rounded px-4 py-3 focus:outline-none focus:border-blue-500 font-mono tracking-wider">
                <button type="submit" id="btn-login" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded py-3 transition-colors text-sm">
                    Verifikasi UID
                </button>
            </form>

            <!-- TOMBOL TAMBAHAN: AKSES PREMIUM & BELI VIA WHATSAPP -->
            <div class="mt-3 space-y-2">
                <a href="https://pro-keuangan-digital-daffcv.netlify.app" target="_blank" class="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded py-2.5 transition-colors text-xs text-center">
                    <i class="fas fa-crown mr-1"></i> Akses Premium
                </a>
                <a href="https://wa.me/6288271109247?text=Halo%20Admin%20DaffCv,%20saya%20ingin%20membeli%20atau%20memperpanjang%20akses%20aplikasi%20keuangan." target="_blank" class="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded py-2.5 transition-colors text-xs text-center">
                    <i class="fab fa-whatsapp mr-1"></i> Beli Akses (WhatsApp Admin)
                </a>
            </div>

            <p id="uid-error" class="mt-3 text-xs text-red-400 text-center hidden"></p>
        </div>
    </div>

    <!-- Main Content -->
    <div id="main-content" class="max-w-6xl mx-auto p-4 md:p-6 opacity-0 transition-opacity duration-700 pt-6 hidden">
        
        <!-- Header -->
        <header class="mb-6 flex justify-between items-center border-b border-gray-800 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-white">Dashboard Keuangan Pro</h1>
                <p class="text-gray-400 text-sm">UID Aktif: <span id="display-uid" class="text-blue-400 font-mono font-bold"></span></p>
            </div>
            <div class="text-right flex items-center space-x-4">
                <div>
                    <span class="text-xs text-gray-500 uppercase tracking-widest font-semibold block">Dev by</span>
                    <span class="text-sm font-bold text-white">DaffCv</span>
                </div>
                <button onclick="logoutApp()" class="bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 border border-gray-700 px-3 py-1.5 rounded text-xs transition-colors" title="Keluar UID">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </header>

        <!-- Peringatan Kontrol Ekstrem -->
        <div id="alert-box" class="hidden mb-6 bg-red-950/80 border-2 border-red-600 p-4 rounded-lg flex items-center justify-between extreme-alert">
            <div class="flex items-center space-x-3">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl animate-bounce"></i>
                <div>
                    <h4 class="text-red-400 font-bold">PERINGATAN EKSTREM: Batas Pengeluaran Terlewati!</h4>
                    <p class="text-red-200 text-sm" id="alert-text">Pengeluaran bulan ini telah melewati batas maksimal.</p>
                </div>
            </div>
            <button onclick="matikanAlarm()" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors">
                Matikan Alarm
            </button>
        </div>

        <!-- Summary Cards Utama -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <p class="text-gray-400 text-sm mb-1">Total Saldo</p>
                <h2 class="text-3xl font-bold text-white" id="total-saldo">Rp 0</h2>
            </div>
            <div class="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <p class="text-gray-400 text-sm mb-1">Total Pemasukan Keseluruhan</p>
                <h2 class="text-2xl font-bold text-green-400" id="total-pemasukan">Rp 0</h2>
            </div>
            <div class="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <p class="text-gray-400 text-sm mb-1">Total Pengeluaran Keseluruhan</p>
                <h2 class="text-2xl font-bold text-red-400" id="total-pengeluaran">Rp 0</h2>
            </div>
        </div>

        <!-- Ringkasan Periode (Mingguan & Bulanan) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                <div>
                    <span class="text-xs uppercase tracking-wider text-blue-400 font-semibold">Periode Minggu Ini</span>
                    <div class="flex space-x-6 mt-1">
                        <div><p class="text-xs text-gray-400">Masuk</p><p class="text-sm font-bold text-green-400" id="weekly-in">Rp 0</p></div>
                        <div><p class="text-xs text-gray-400">Keluar</p><p class="text-sm font-bold text-red-400" id="weekly-out">Rp 0</p></div>
                    </div>
                </div>
                <div class="text-right text-gray-500"><i class="fas fa-calendar-week text-2xl"></i></div>
            </div>
            <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                <div>
                    <span class="text-xs uppercase tracking-wider text-purple-400 font-semibold">Periode Bulan Ini</span>
                    <div class="flex space-x-6 mt-1">
                        <div><p class="text-xs text-gray-400">Masuk</p><p class="text-sm font-bold text-green-400" id="monthly-in">Rp 0</p></div>
                        <div><p class="text-xs text-gray-400">Keluar</p><p class="text-sm font-bold text-red-400" id="monthly-out">Rp 0</p></div>
                    </div>
                </div>
                <div class="text-right text-gray-500"><i class="fas fa-calendar-alt text-2xl"></i></div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1 space-y-6">
                <!-- Kontrol Ekstrem -->
                <div class="bg-gray-800 p-5 rounded-lg border border-gray-700">
                    <h3 class="text-base font-semibold text-white mb-3 flex items-center">
                        <i class="fas fa-shield-alt text-red-500 mr-2"></i> Kontrol Ekstrem (Limit Bulanan)
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs text-gray-400 mb-1">Maksimal Pengeluaran (Rp)</label>
                            <input type="text" id="limit-input" placeholder="Contoh: 1.500.000" 
                                class="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-red-500">
                        </div>
                        <button onclick="simpanLimit()" class="w-full bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded transition-colors">
                            Atur Batas Ekstrem
                        </button>
                    </div>
                </div>

                <!-- Scan Struk -->
                <div class="bg-gray-800 p-5 rounded-lg border border-gray-700">
                    <h3 class="text-base font-semibold text-white mb-2 flex items-center">
                        <i class="fas fa-camera text-blue-400 mr-2"></i> Scan / Unggah Struk
                    </h3>
                    <input type="file" id="struk-file" accept="image/*" class="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
                    <div id="ocr-status" class="mt-2 text-xs text-yellow-400 hidden">Memproses gambar struk...</div>
                </div>

                <!-- Form Transaksi -->
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 class="text-lg font-semibold text-white mb-4">Catat Transaksi</h3>
                    <form id="form-transaksi" class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Keterangan</label>
                            <input type="text" id="keterangan" required placeholder="Contoh: Belanja Bulanan" 
                                class="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-2.5 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Nominal (Rp)</label>
                            <input type="text" id="nominal" required placeholder="100.000" 
                                class="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-2.5 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Tipe Transaksi</label>
                            <select id="tipe" class="w-full bg-gray-900 border border-gray-700 text-white rounded px-4 py-2.5 text-sm">
                                <option value="pemasukan">Pemasukan</option>
                                <option value="pengeluaran">Pengeluaran</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded py-2.5 text-sm">
                            Simpan Transaksi
                        </button>
                    </form>
                </div>
            </div>

            <!-- Riwayat -->
            <div class="lg:col-span-2">
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[500px]">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-white">Riwayat Transaksi</h3>
                        <button id="btn-reset" class="text-sm text-red-400 hover:text-red-300">
                            <i class="fas fa-trash-alt mr-1"></i> Hapus Semua
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-gray-700 text-gray-400 text-sm">
                                    <th class="pb-3 font-medium">Tanggal</th>
                                    <th class="pb-3 font-medium">Keterangan</th>
                                    <th class="pb-3 font-medium">Tipe</th>
                                    <th class="pb-3 font-medium text-right">Nominal</th>
                                    <th class="pb-3 font-medium text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="list-transaksi" class="text-sm"></tbody>
                        </table>
                        <div id="empty-state" class="text-center py-10 hidden">
                            <p class="text-gray-500">Belum ada data transaksi.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            const savedUID = localStorage.getItem('daffcv_active_uid');
            const splashScreen = document.getElementById('splash-screen');
            const splashContent = document.getElementById('splash-content');
            const uidBox = document.getElementById('uid-box');
            const mainContent = document.getElementById('main-content');

            if (savedUID) {
                setTimeout(async () => {
                    const db = window.db;
                    const { doc, getDoc } = window.firebaseFuncs;
                    if(db) {
                        try {
                            const docRef = doc(db, "users", savedUID);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists() && docSnap.data().active === true) {
                                const expDate = new Date(docSnap.data().expiredDate);
                                if(new Date() <= expDate) {
                                    bukaAplikasi(savedUID);
                                    return;
                                }
                            }
                        } catch(e) {}
                    }
                    bukaAplikasi(savedUID);
                }, 1500);
            } else {
                setTimeout(() => {
                    splashContent.style.opacity = '0';
                    setTimeout(() => {
                        splashContent.style.display = 'none';
                        uidBox.classList.remove('hidden');
                    }, 500);
                }, 2000);
            }
        });

        document.getElementById('form-uid').addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputUID = document.getElementById('input-uid').value.trim();
            const btnLogin = document.getElementById('btn-login');
            const uidError = document.getElementById('uid-error');
            
            btnLogin.innerText = "Memverifikasi...";
            uidError.classList.add('hidden');

            const db = window.db;
            const { doc, getDoc, updateDoc, increment } = window.firebaseFuncs;

            if(!db) {
                uidError.innerText = "Konfigurasi Firebase belum diatur!";
                uidError.classList.remove('hidden');
                btnLogin.innerText = "Verifikasi UID";
                return;
            }

            try {
                const docRef = doc(db, "users", inputUID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.active !== true) {
                        uidError.innerText = "Akses ditolak: UID ini telah dinonaktifkan oleh Admin.";
                        uidError.classList.remove('hidden');
                        btnLogin.innerText = "Verifikasi UID";
                        return;
                    }

                    const expDate = new Date(data.expiredDate);
                    if (new Date() > expDate) {
                        uidError.innerText = "Masa aktif UID Anda telah kedaluwarsa!";
                        uidError.classList.remove('hidden');
                        btnLogin.innerText = "Verifikasi UID";
                        return;
                    }

                    await updateDoc(docRef, {
                        lastLogin: new Date().toISOString(),
                        accessCount: increment(1)
                    });

                    localStorage.setItem('daffcv_active_uid', inputUID);
                    bukaAplikasi(inputUID);

                } else {
                    uidError.innerText = "UID tidak terdaftar di database Admin DaffCv.";
                    uidError.classList.remove('hidden');
                    btnLogin.innerText = "Verifikasi UID";
                }
            } catch (err) {
                uidError.innerText = "Gagal terhubung ke server verifikasi.";
                uidError.classList.remove('hidden');
                btnLogin.innerText = "Verifikasi UID";
            }
        });

        function bukaAplikasi(uid) {
            const splashScreen = document.getElementById('splash-screen');
            const mainContent = document.getElementById('main-content');
            document.getElementById('display-uid').innerText = uid;

            splashScreen.classList.add('opacity-0');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                mainContent.classList.remove('opacity-0');
                inisialisasiAppKeuangan();
            }, 500);
        }

        window.logoutApp = function() {
            if(confirm('Keluar dari sesi UID ini?')) {
                localStorage.removeItem('daffcv_active_uid');
                location.reload();
            }
        };

        function inisialisasiAppKeuangan() {
            let transaksi = JSON.parse(localStorage.getItem('dataKeuanganDaffCv')) || [];
            let maxLimit = parseFloat(localStorage.getItem('limitKeuanganDaffCv')) || 0;
            let alarmAktif = false;
            let audioInterval = null;

            const formTransaksi = document.getElementById('form-transaksi');
            const inputKeterangan = document.getElementById('keterangan');
            const inputNominal = document.getElementById('nominal');
            const inputTipe = document.getElementById('tipe');
            const listTransaksi = document.getElementById('list-transaksi');
            const emptyState = document.getElementById('empty-state');
            const elTotalSaldo = document.getElementById('total-saldo');
            const elTotalPemasukan = document.getElementById('total-pemasukan');
            const elTotalPengeluaran = document.getElementById('total-pengeluaran');
            const elWeeklyIn = document.getElementById('weekly-in');
            const elWeeklyOut = document.getElementById('weekly-out');
            const elMonthlyIn = document.getElementById('monthly-in');
            const elMonthlyOut = document.getElementById('monthly-out');
            const btnReset = document.getElementById('btn-reset');
            const limitInput = document.getElementById('limit-input');
            const alertBox = document.getElementById('alert-box');
            const alertText = document.getElementById('alert-text');
            const strukFile = document.getElementById('struk-file');
            const ocrStatus = document.getElementById('ocr-status');

            if(maxLimit > 0) limitInput.value = formatRupiahText(maxLimit.toString());

            inputNominal.addEventListener('input', function() {
                let val = this.value.replace(/[^0-9]/g, '');
                if(val) this.value = formatRupiahText(val);
            });

            limitInput.addEventListener('input', function() {
                let val = this.value.replace(/[^0-9]/g, '');
                if(val) this.value = formatRupiahText(val);
            });

            function formatRupiahText(angka) {
                return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }

            const formatRupiah = (angka) => {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
            };

            const formatTanggal = (dateString) => {
                return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            };

            function playAlarmBeep() {
                try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                } catch(e) {}
            }

            function triggerAlarm() {
                if(!alarmAktif) {
                    alarmAktif = true;
                    alertBox.classList.remove('hidden');
                    playAlarmBeep();
                    audioInterval = setInterval(playAlarmBeep, 1000);
                }
            }

            window.matikanAlarm = function() {
                alarmAktif = false;
                clearInterval(audioInterval);
                alertBox.classList.add('hidden');
            };

            window.simpanLimit = function() {
                const raw = limitInput.value.replace(/\./g, '');
                maxLimit = parseFloat(raw) || 0;
                localStorage.setItem('limitKeuanganDaffCv', maxLimit);
                alert('Batas maksimal pengeluaran ekstrem berhasil disimpan!');
                updateUI();
            };

            strukFile.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if(!file) return;
                ocrStatus.classList.remove('hidden');
                ocrStatus.innerText = "Memindai struk...";
                try {
                    const result = await Tesseract.recognize(file, 'ind+eng');
                    const numbers = result.data.text.match(/\b\d{1,3}(?:[.,]\d{3})+\b|\b\d{4,10}\b/g);
                    if(numbers && numbers.length > 0) {
                        const cleaned = numbers.map(n => parseInt(n.replace(/[^0-9]/g, ''))).filter(n => n > 1000);
                        if(cleaned.length > 0) {
                            const maxVal = Math.max(...cleaned);
                            inputNominal.value = formatRupiahText(maxVal.toString());
                            inputKeterangan.value = "Belanja dari Struk Scan";
                            inputTipe.value = "pengeluaran";
                            ocrStatus.innerText = "Berhasil mendeteksi nominal!";
                        } else { ocrStatus.innerText = "Nominal tidak terbaca jelas."; }
                    } else { ocrStatus.innerText = "Gagal mendeteksi angka."; }
                } catch(err) { ocrStatus.innerText = "Gagal memindai gambar."; }
            });

            function updateUI() {
                listTransaksi.innerHTML = '';
                let totalPemasukan = 0, totalPengeluaran = 0;
                let weeklyIn = 0, weeklyOut = 0;
                let monthlyIn = 0, monthlyOut = 0;

                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth();
                const firstDayOfWeek = new Date(now);
                const day = now.getDay();
                firstDayOfWeek.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
                firstDayOfWeek.setHours(0,0,0,0);

                if (transaksi.length === 0) {
                    emptyState.classList.remove('hidden');
                } else {
                    emptyState.classList.add('hidden');
                    transaksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).forEach((item) => {
                        const itemDate = new Date(item.tanggal);
                        if (item.tipe === 'pemasukan') totalPemasukan += item.nominal;
                        if (item.tipe === 'pengeluaran') totalPengeluaran += item.nominal;

                        if (itemDate >= firstDayOfWeek && itemDate <= now) {
                            if (item.tipe === 'pemasukan') weeklyIn += item.nominal;
                            if (item.tipe === 'pengeluaran') weeklyOut += item.nominal;
                        }
                        if (itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth) {
                            if (item.tipe === 'pemasukan') monthlyIn += item.nominal;
                            if (item.tipe === 'pengeluaran') monthlyOut += item.nominal;
                        }

                        const tr = document.createElement('tr');
                        tr.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
                        const warnaNominal = item.tipe === 'pemasukan' ? 'text-green-400' : 'text-red-400';
                        const tanda = item.tipe === 'pemasukan' ? '+' : '-';
                        const badgeClass = item.tipe === 'pemasukan' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';

                        tr.innerHTML = `
                            <td class="py-3 text-gray-400">${formatTanggal(item.tanggal)}</td>
                            <td class="py-3 text-white font-medium">${item.keterangan}</td>
                            <td class="py-3"><span class="px-2 py-1 text-xs rounded border capitalize ${badgeClass}">${item.tipe}</span></td>
                            <td class="py-3 text-right font-semibold ${warnaNominal}">${tanda} ${formatRupiah(item.nominal).replace('Rp', '')}</td>
                            <td class="py-3 text-center">
                                <button onclick="hapusTransaksi(${item.id})" class="text-gray-500 hover:text-red-400 p-1"><i class="fas fa-times"></i></button>
                            </td>
                        `;
                        listTransaksi.appendChild(tr);
                    });
                }

                if (maxLimit > 0 && monthlyOut > maxLimit) {
                    alertText.innerText = `Pengeluaran bulan ini (${formatRupiah(monthlyOut)}) melewati batas maksimal (${formatRupiah(maxLimit)})!`;
                    triggerAlarm();
                } else if(alarmAktif) {
                    matikanAlarm();
                }

                const totalSaldo = totalPemasukan - totalPengeluaran;
                elTotalPemasukan.innerText = formatRupiah(totalPemasukan);
                elTotalPengeluaran.innerText = formatRupiah(totalPengeluaran);
                elTotalSaldo.innerText = formatRupiah(totalSaldo);
                elTotalSaldo.className = totalSaldo < 0 ? "text-3xl font-bold text-red-400" : "text-3xl font-bold text-white";

                elWeeklyIn.innerText = formatRupiah(weeklyIn);
                elWeeklyOut.innerText = formatRupiah(weeklyOut);
                elMonthlyIn.innerText = formatRupiah(monthlyIn);
                elMonthlyOut.innerText = formatRupiah(monthlyOut);

                localStorage.setItem('dataKeuanganDaffCv', JSON.stringify(transaksi));
            }

            formTransaksi.addEventListener('submit', (e) => {
                e.preventDefault();
                const keterangan = inputKeterangan.value.trim();
                const nominal = parseInt(inputNominal.value.replace(/\./g, ''));
                const tipe = inputTipe.value;

                if (!keterangan || isNaN(nominal) || nominal <= 0) {
                    alert('Mohon isi keterangan dan nominal dengan benar!');
                    return;
                }

                transaksi.push({ id: Date.now(), keterangan, nominal, tipe, tanggal: new Date().toISOString() });
                updateUI();
                formTransaksi.reset();
                inputKeterangan.focus();
                strukFile.value = '';
                ocrStatus.classList.add('hidden');
            });

            window.hapusTransaksi = (id) => {
                if(confirm('Hapus transaksi ini?')) {
                    transaksi = transaksi.filter(t => t.id !== id);
                    updateUI();
                }
            };

            btnReset.addEventListener('click', () => {
                if(transaksi.length > 0 && confirm('Hapus SEMUA riwayat?')) {
                    transaksi = [];
                    updateUI();
                }
            });

            updateUI();
        }
    </script>
</body>
</html>
