Terakhir diperbarui: 18 November 2026

Lookie adalah aplikasi melukis untuk anak di iPad. Anak melukis di udara: kamera depan melihat tangan dan lengan, lalu cat muncul di kanvas. Kebijakan ini menjelaskan data apa yang kami pegang, untuk apa, dan bagaimana menghapusnya. Kami menulisnya sesingkat mungkin supaya orang tua bisa membacanya sampai habis.

Pengembang: Filbert Naldo Wijaya, Tangerang, Banten, Indonesia. Kontak: filbertnaldow@gmail.com.

## Ringkasnya

- Gambar dari kamera tidak pernah keluar dari iPad. Tangan dan lengan dikenali di dalam iPad.
- Tanpa akun, semua tetap di iPad ini dan tidak ada yang kami terima.
- Dengan Masuk dengan Apple, lukisan dan statistik gerakan dicadangkan ke server kami.
- Foto yang dipilih anak untuk "Buat Sendiri" dikirim ke Google Gemini untuk diubah menjadi garis gambar, dan tidak kami simpan.
- Tidak ada iklan, pelacak, atau analitik pihak ketiga. Kami tidak menjual data.
- Orang tua bisa menghapus akun dan semua datanya kapan saja dari dalam aplikasi.

## Siapa yang memakai Lookie

Lookie dibuat untuk anak, dipakai bersama orang tua atau wali. Akun dibuat oleh orang tua atau wali, bukan oleh anak. Satu akun dipakai untuk satu anak. Kami tidak meminta nama lengkap, tanggal lahir, alamat, atau nomor telepon anak.

## Tanpa akun (mode tamu)

Anak bisa melukis tanpa akun. Dalam mode ini lukisan, statistik, dan nama panggilan hanya disimpan di iPad. Kami tidak menerima apa pun. Kalau aplikasi dihapus atau iPad diganti, lukisan itu hilang. Hal ini juga tertulis di halaman profil aplikasi.

## Data yang kami simpan setelah Masuk dengan Apple

Setelah orang tua memilih Masuk dengan Apple, kami menyimpan:

| Data | Isi | Untuk apa |
|---|---|---|
| Akun | Pengenal akun dari Apple. Kami tidak meminta nama atau email. | Mengenali akun dan mengembalikan lukisan di iPad baru |
| Persetujuan | Waktu dan versi persetujuan Mulai | Bukti bahwa orang tua sudah setuju |
| Nama panggilan | Opsional, maksimal 20 karakter, diketik oleh keluarga | Ditampilkan di halaman profil |
| Lukisan | Gambar PNG tiap lukisan, tanggal, dan gambar templat yang dipakai | Galeri dan pencadangan |
| Statistik gerakan | Lama melukis, peta panas posisi tangan (satu per tangan), lama mengepal per tangan untuk memperkirakan tangan dominan, dan nilai jangkauan gerak (ROM) | Halaman Laporan |
| Templat buatan anak | Judul dan garis gambar dari "Buat Sendiri" (bukan foto aslinya) | Menampilkan garis gambar itu lagi di iPad mana pun |
| Catatan batas harian | Waktu setiap permintaan "Buat Sendiri" | Membatasi 20 gambar per akun per hari |

Statistik gerakan adalah perkiraan dua dimensi dari kamera. Ini bukan hasil pengukuran medis dan tidak untuk diagnosis.

## Kamera

Lookie memakai kamera depan hanya saat anak melukis, untuk mengenali posisi tangan dan lengan. Pengenalan berjalan di dalam iPad dengan fitur Vision milik Apple. Gambar dari kamera tidak direkam, tidak disimpan, dan tidak dikirim ke mana pun. Yang tersimpan hanya angka-angka hasil gerakan di tabel di atas.

## "Buat Sendiri" dan Google Gemini

"Buat Sendiri" butuh akun yang sudah masuk. Anak bisa memilih foto, mengambil foto, atau mengetik beberapa kata. Foto (diperkecil menjadi JPEG maksimal 768 piksel) atau kata-kata itu dikirim lewat server kami ke Google Gemini, yang mengubahnya menjadi garis gambar untuk diwarnai.

- Kami tidak menyimpan foto atau kata-kata itu. Yang tersimpan hanya garis gambar hasilnya.
- Selama Gemini memprosesnya, ketentuan data Google berlaku. Kami memakai layanan Gemini berbayar, yang menurut Google tidak memakai data masukan untuk melatih model.
- Ini satu-satunya gambar dari dunia anak yang keluar dari iPad. Orang tua sebaiknya mendampingi dan menghindari foto yang memperlihatkan wajah, nama, atau tempat pribadi.

## Pihak ketiga yang menangani data

| Pihak | Peran | Data |
|---|---|---|
| Apple | Masuk dengan Apple | Proses masuk; kami hanya menerima pengenal akun |
| Supabase | Basis data dan penyimpanan file, server di Singapura (ap-southeast-1) | Semua data di tabel di atas |
| Google (Gemini) | Membuat garis gambar | Foto atau kata-kata dari "Buat Sendiri" saat diproses |

Kami tidak memakai iklan, SDK analitik, atau pelacak. Kami tidak menjual atau membagikan data untuk pemasaran.

## Berapa lama disimpan

- Lukisan, statistik, dan templat disimpan sampai orang tua menghapusnya atau menghapus akun.
- Lukisan atau templat yang dihapus ditandai terhapus agar ikut terhapus di iPad lain, lalu dibersihkan permanen dari server setelah 90 hari.
- Catatan batas harian "Buat Sendiri" dihapus otomatis setelah 2 hari.

## Menghapus data

- **Hapus akun** (di halaman profil, untuk akun yang sudah masuk): menghapus akun, semua lukisan, statistik, templat, dan file di penyimpanan kami, serta lukisan di iPad itu.
- **Keluar**: aplikasi menyelesaikan pencadangan dulu, lalu menghapus lukisan di iPad itu supaya iPad bersama tidak menyalinnya ke akun lain. Orang tua diperingatkan kalau ada yang belum tercadang.
- **Mode tamu**: menghapus aplikasi menghapus semuanya, karena kami tidak punya salinannya.
- Bisa juga lewat email ke filbertnaldow@gmail.com.

## Hak orang tua

Orang tua atau wali berhak melihat, meminta salinan, memperbaiki, dan menghapus data anak, serta menarik persetujuan. Kirim email ke filbertnaldow@gmail.com dan kami jawab dalam 7 hari kerja. Menarik persetujuan berarti menghapus akun.

## Keamanan

Data dikirim lewat HTTPS. Lukisan disimpan di penyimpanan pribadi, dan aturan akses di tingkat baris memastikan sebuah akun hanya bisa membaca data miliknya sendiri. Tidak ada sistem yang sepenuhnya kebal; jika terjadi kebocoran yang berdampak pada pengguna, kami akan memberi tahu sesuai hukum yang berlaku.

## Perubahan kebijakan

Jika isi kebijakan ini berubah secara berarti, aplikasi menampilkan layar Mulai lagi sehingga orang tua bisa membacanya dan setuju kembali.

## Hukum yang berlaku

Kebijakan ini mengikuti hukum Republik Indonesia, termasuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

## Kontak

filbertnaldow@gmail.com · Tangerang, Banten, Indonesia
