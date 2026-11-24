**Terakhir diperbarui: 18 November 2026**

Lookie adalah aplikasi melukis untuk anak di iPad. Anak bisa melukis di udara: kamera depan mendeteksi gerakan tangan dan lengan, lalu goresan cat muncul di kanvas. Kebijakan ini menjelaskan data apa saja yang kami simpan, tujuan penggunaannya, dan cara menghapusnya. Kami menyusunnya secara ringkas agar mudah dipahami oleh orang tua.

**Pengembang:** Little Crew - Tangerang, Banten, Indonesia.  
**Kontak:** littlecrewproject@gmail.com

## Ringkasan

- Gambar dari kamera tidak pernah keluar dari iPad. Pengenalan gerakan tangan dan lengan dilakukan langsung di perangkat.
- Tanpa akun, semua data tetap tersimpan di iPad dan tidak ada data yang kami terima.
- Dengan Masuk dengan Apple, lukisan dan statistik gerakan dicadangkan ke server kami.
- Foto yang dipilih anak melalui fitur pembuatan template dikirim ke Google Gemini untuk diubah menjadi garis gambar. Kami tidak menyimpan foto tersebut.
- Lookie tidak menggunakan iklan, pelacak, atau analitik pihak ketiga. Kami juga tidak menjual data pengguna.
- Orang tua dapat menghapus akun beserta seluruh datanya kapan saja melalui aplikasi.

## Siapa yang menggunakan Lookie?

Lookie dirancang untuk anak dan digunakan bersama orang tua atau wali. Akun dibuat oleh orang tua atau wali, bukan oleh anak. Satu akun digunakan untuk satu anak.

Kami tidak meminta nama lengkap, tanggal lahir, alamat, atau nomor telepon anak.

## Tanpa akun (Mode Tamu)

Anak tetap bisa melukis tanpa membuat akun. Dalam mode ini, lukisan, statistik, dan nama panggilan hanya disimpan di iPad yang digunakan. Kami tidak menerima data apa pun dari aktivitas tersebut.

Jika aplikasi dihapus atau iPad diganti, lukisan yang tersimpan akan hilang. Informasi ini juga tersedia di halaman profil aplikasi.

## Data yang kami simpan setelah Masuk dengan Apple

Setelah orang tua memilih Masuk dengan Apple, kami menyimpan data berikut:

| Jenis data | Isi | Tujuan penggunaan |
|---|---|---|
| Akun | Pengenal akun dari Apple. Kami tidak meminta nama atau alamat email. | Mengenali akun dan memulihkan lukisan saat menggunakan iPad baru. |
| Persetujuan | Waktu dan versi persetujuan pada layar Mulai. | Sebagai bukti bahwa orang tua telah memberikan persetujuan. |
| Nama panggilan | Opsional, maksimal 20 karakter, dan diisi oleh keluarga. | Ditampilkan di halaman profil. |
| Lukisan | Gambar PNG dari setiap lukisan, tanggal pembuatan, dan gambar template yang digunakan. | Menampilkan lukisan di galeri dan menyediakan pencadangan. |
| Statistik gerakan | Durasi melukis, peta panas posisi tangan (satu untuk setiap tangan), durasi mengepal untuk masing-masing tangan sebagai perkiraan tangan dominan, dan nilai jangkauan gerak (ROM). | Ditampilkan di halaman Laporan. |
| Template buatan anak | Judul dan garis gambar yang dihasilkan melalui fitur pembuatan template, bukan foto aslinya. | Agar garis gambar tersebut dapat ditampilkan kembali di iPad mana pun. |
| Catatan batas harian | Waktu setiap permintaan pembuatan template. | Membatasi pembuatan hingga 2 gambar per akun setiap hari. |

Statistik gerakan merupakan perkiraan dua dimensi berdasarkan kamera. Data ini bukan hasil pengukuran medis dan tidak ditujukan untuk diagnosis.

## Kamera

Lookie menggunakan kamera depan hanya saat anak melukis untuk mengenali posisi tangan dan lengan. Proses pengenalan dilakukan langsung di iPad menggunakan framework Vision dari Apple.

Gambar dari kamera tidak direkam, tidak disimpan, dan tidak dikirim ke mana pun. Data yang disimpan hanya berupa angka hasil pengenalan gerakan seperti yang dijelaskan pada tabel di atas.

## Fitur custom template

Fitur pembuatan template membutuhkan akun yang sudah masuk. Anak dapat memilih foto dari galeri, mengambil foto langsung, atau mengetik beberapa kata untuk membuat template.

Foto yang dipilih (diperkecil menjadi JPEG dengan ukuran maksimal 768 piksel) atau teks yang dimasukkan akan dikirim melalui server kami ke Google Gemini. Layanan ini mengubah foto atau teks tersebut menjadi garis gambar yang dapat diwarnai.

- Kami tidak menyimpan foto maupun teks yang dikirim. Data yang disimpan hanya berupa garis gambar hasilnya.
- Selama Google Gemini memproses permintaan, ketentuan pengelolaan data dari Google berlaku.
- Ini adalah satu-satunya gambar dari lingkungan anak yang dikirim keluar dari iPad. Orang tua sebaiknya mendampingi anak saat menggunakan fitur ini dan menghindari foto yang menampilkan wajah, nama, atau tempat pribadi.

## Pihak ketiga yang menangani data

| Pihak | Peran | Data yang ditangani |
|---|---|---|
| Apple | Masuk dengan Apple | Proses autentikasi. Kami hanya menerima pengenal akun. |
| Supabase | Basis data dan penyimpanan file. | Seluruh data yang tercantum pada tabel di atas. |
| Google (Gemini) | Membuat garis gambar. | Foto atau teks dari fitur pembuatan template selama proses berlangsung. |

Kami tidak menggunakan iklan, SDK analitik, atau pelacak. Kami juga tidak menjual data atau membagikannya untuk kepentingan pemasaran.

## Berapa lama data disimpan?

- Lukisan, statistik, dan template disimpan sampai orang tua menghapusnya atau menghapus akun.
- Lukisan atau template yang dihapus akan ditandai sebagai terhapus agar penghapusan tersinkron ke iPad lain. Data tersebut kemudian dihapus secara permanen dari server setelah 90 hari.
- Catatan penggunaan batas harian fitur pembuatan template dihapus secara otomatis setelah 2 hari.

## Menghapus data

Orang tua dapat menghapus data melalui beberapa cara:

- **Hapus akun:** Tersedia di halaman profil untuk akun yang sudah masuk. Tindakan ini menghapus akun, seluruh lukisan, statistik, template, dan file di penyimpanan kami, termasuk lukisan yang tersimpan di iPad tersebut.
- **Keluar dari akun:** Aplikasi akan menyelesaikan proses pencadangan terlebih dahulu, lalu menghapus lukisan dari iPad tersebut. Langkah ini mencegah data dari iPad bersama tersalin ke akun lain. Orang tua akan mendapat peringatan jika masih ada data yang belum dicadangkan.
- **Mode Tamu:** Menghapus aplikasi akan menghapus seluruh data karena kami tidak menyimpan salinannya.
- **Melalui email:** Orang tua juga dapat meminta penghapusan data dengan menghubungi littlecrewproject@gmail.com.

## Hak orang tua

Orang tua atau wali berhak untuk melihat, meminta salinan, memperbaiki, dan menghapus data anak, serta menarik persetujuan yang telah diberikan.

Kirim permintaan melalui littlecrewproject@gmail.com. Kami akan membalas dalam 7 hari kerja.

Menarik persetujuan berarti menghapus akun.

## Keamanan

Data dikirim melalui koneksi HTTPS. Lukisan disimpan di penyimpanan pribadi, dan aturan akses pada tingkat baris (row-level security) memastikan setiap akun hanya dapat membaca datanya sendiri.

Tidak ada sistem yang sepenuhnya aman dari risiko kebocoran. Jika terjadi kebocoran data yang berdampak pada pengguna, kami akan memberikan pemberitahuan sesuai hukum yang berlaku.

## Perubahan kebijakan

Jika terdapat perubahan penting pada kebijakan ini, aplikasi akan menampilkan kembali layar Mulai agar orang tua dapat membaca dan memberikan persetujuan ulang.

## Hukum yang berlaku

Kebijakan ini mengikuti hukum Republik Indonesia, termasuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

## Kontak

littlecrewproject@gmail.com  
Tangerang, Banten, Indonesia.
