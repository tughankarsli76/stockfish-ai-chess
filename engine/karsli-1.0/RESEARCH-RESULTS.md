# Karsli: Horsie’ye kadar birleşik araştırma paketi, revizyon 9

Kullanıcının ekran görüntüsündeki sırayla, Horsie 1.1 dahil **23 turuncu motor için inceleme ve entegrasyon kararı tamamlandı**. Stockfish 19 temelindeki önceki Karsli değişiklikleri korundu; Cinder, Obsidian, Alexandria, Hobbes ve Halogen’den seçilen beş yeni uyarlama eklendi. Apple Silicon Mac motoru `../../build/karsli-orange`; etkin birleşik araştırma ayarları [combined-profile.json](combined-profile.json) ve UCI komutları [combined-profile.uci](combined-profile.uci).

Bu sonuç, 23 motorun bütün kodlarını birleştirmek veya her birinden yeni bir özellik eklemek anlamına gelmez. 21 motorun raporlarda belirtilen implementation bölümleri karşılaştırıldı; Coda ve Integral incelemeleri kayıtlı yeniden kullanım/lisans kısıtları nedeniyle kamu belgeleriyle sınırlı kaldı. Aynı işi yapan mekanizmalar tekrar eklenmedi. Her motorun güçlü mekanizmaları, Karsli’deki karşılığı, seçilmeyen adayları ve nedenleri [motor matrisi](ENGINE-MATRIX.md) ile bağlantılı ayrı raporlarda yer alıyor. Bu, her depo satırının veya her motorun güvenliğinin kapsamlı denetimi değildir.

## Eklenen beş uyarlama

| Kaynak | Karsli’de yapılan değişiklik | Denenen değer / varsayılan |
| --- | --- | --- |
| Cinder 0.6.1 | Önceki ve mevcut konum anahtarından tek-ply transition correction; worker başına 16 KiB öğrenme tablosu; yalnızca uygun correction-training düğümleri | 128 / 0 |
| Obsidian 16.0 | Sığ non-PV düğümde yalnızca ilk quiet hamle denenmişse pozitif quiet-history öğrenmesini bastırma; capture ve alternatif hamle cezaları korunur | true / false |
| Alexandria 9.0.0 | Öğrenilmiş correction’ın statik değerlendirmeye göre oranıyla pozitif quiet LMR azaltımını en fazla yarım ply indirme | 256 / 0 |
| Hobbes 3.0 | Gerçek capture hamleleri için worker başına 16 KiB from/to history; mevcut piece/to/victim history’ye sınırlı ek sıralama puanı | 128 / 0 |
| Halogen 16 | Bizim yüksek değerli materyalimiz daha düşük değerli rakip taşın saldırısındaysa mevcut RFP marjına sınırlı ek koruma | 32 / 0 |

Cinder lookup ölçeği `/8192`, çalışma profili 128’de en fazla ±16 iç değerlendirme birimi verir. Alexandria oranı sıfıra bölünmeye karşı korunur; mevcut Stockfish correction katkısı da durduğu için birlikte etkinleşmeleri ayrı kalibrasyon gerektirir. Hobbes ek puanı en fazla ±2048; öğrenme bonusları ve cezaları ±2048’e sıkıştırılır, history girişi ±8192 sınırındadır. Quiet promotion’lar capture history yoluna girmez. Halogen marjı 0–64 aralığında; Plenty’nin improving-discount korumasıyla birlikte çalışabilir. Geometrik saldırı göstergesi, kazançlı veya yasal capture’ın ispatı değildir.

Yeni beş seçenek **varsayılan kapalıdır**; maçlarda ve materyal testlerinde birleşik profil açıkça yüklendi. Önceki Reckless grupları, Plenty materyal koruması/capture LMR, pawnocchio razor/pawn-escape ve bağımsız Coda yakın-alpha LMP fikri profilde etkin. Bunlar yeni ağ veya doğrudan materyal-farkı değerlendirme bonusu değildir. Materyal odağı, capture sıralaması ve ilgili arama yollarının erken budanmasını azaltma üzerinden uygulanır. Stockfish ağı değişmedi.

## Tamamlanan doğrulama

| Kayıt | Sonuç |
| --- | --- |
| [Rev9 optimize motor](validation.json) | 22/22 geçti |
| [Rev9 ASan + UBSan](sanitized-validation.json) | 22/22 geçti; runtime sanitizer hata çıktısı yok |
| [Yeni iki özellik kapalıyken rev8 regresyonu](first10-regression.json) | 19/19 geçti |
| [Tam birleşik profil materyal/saat testleri](material-validation.json) | 20/20 geçti: her motor için 7 materyal/pat pozisyonu ve 1/3/5 dakikalık saatle 3 arama |
| [Tam birleşik profil sanitizer materyal testleri](material-sanitized-validation.json) | 14/14 geçti: aynı 7 pozisyon, iki motor |
| [Rev8 normal](../first10-blend/validation.json) / [sanitizer](../first10-blend/sanitized-validation.json) | 19/19 ve 19/19 geçti |
| [Rev8 önceki Coda paketi regresyonu](../first10-blend/coda-regression.json) | 17/17 geçti |

Perft başlangıç konumunda depth 4: 197281; Kiwipete depth 3: 97862. Özel hamleler, en passant, underpromotion, normal ve Chess960 rok, iki renkte ücretsiz vezir kazanımı, zorunlu mat, yasal PV’ler, MultiPV, dört worker, stop/reset/reuse ve seçenek üst sınırları kontrol edildi. Yeni özelliklerin tek tek etkinleşmesi sayaçlarla doğrulandı. Normal toplamlar: capture-route-read 862935, capture-route-update 109097, material-threat 113623, rfp-saved 3042; transition-read 453978, transition-update 41701, shallow-suppressed 9759, relative-lmr 361156. Bunlar arama olayı sayılarıdır; oynanmış hamle veya materyal kazancı sayıları değildir.

Yedi materyal pozisyonu iki renkte vezir alma, korunmuş veziri piyonla alma, veziri korunmuş piyona vermekten kaçınma ve vezire terfiyle pat yaratmama davranışını kapsar. Her iki motor son durumda kaleye terfi etti. Bunlar küçük, önceden belirlenmiş regresyon testleridir; geniş taktik üstünlüğü göstermez. 1/3/5 dakika testleri Kiwipete’den tek aramanın gerçek UCI saatlerine uymasını denetler; bu sürelerde oynanmış tam maçlar değildir.

İlk materyal testinin 30 saniyelik harness zaman aşımı, Stockfish’in 5 dakikalık saatle 53 saniyelik yasal aramasını kesti. Harness sınırı verilen saat +5 saniye yapıldı ve son koşu bütünüyle geçti. İlk kayıt [ayrı dosyada korunuyor](material-validation-initial-timeout.json); son başarılı sayılara dahil edilmedi. Motor kaynak kodunda bu nedenle bir değişiklik yapılmadı.

Özellikler kapalıyken eski kontrol benchmark’ları 170203, 147915 ve 158239 düğümü yeniden üretti. Rev8 etkin profil ve yeni iki özellik kapalıyken 170914 düğüm korunmuş rev8 ile eşleşti. İzole aktif özellik benchmark’ları [feature-controls.json](feature-controls.json) içinde; düğüm sayısı artışı veya azalması güç kazanımı kanıtı değildir.

## Maç sonuçları

Maçlar bir worker, 64 MB hash, 5 saniye başlangıç + hamle başına 50 ms ek süreyle oynandı. Sekiz açılış iki renkte kullanıldı; 32 oyunlu seriler aynı sekiz çifti iki tur tekrar eder. Ağ ortaktır. Motorların saatleri hostta ölçülen yanıt süresiyle azaltıldı. Yapay değerlendirme adjudication’ı kullanılmadı; doğal mat, pat, tekrar, 50 hamle veya yetersiz materyal bitişleri kaydedildi. Test/build işleri maçlarla paralel çalıştırılmadı.

| Seri | Oyun | Karsli galibiyet / mağlubiyet / beraberlik | Kayıt |
| --- | --- | --- | --- |
| Rev8 → Stockfish 19 | 32 | 0 / 1 / 31 | [JSON](../first10-blend/combined-vs-stockfish.json), [PGN](../first10-blend/combined-vs-stockfish.pgn) |
| Rev8 → rev7 Karsli | 16 | 1 / 0 / 15 | [JSON](../first10-blend/combined-vs-revision7.json), [PGN](../first10-blend/combined-vs-revision7.pgn) |
| Rev9 → Stockfish 19 | 32 | 2 / 0 / 30 | [JSON](combined-vs-stockfish.json), [PGN](combined-vs-stockfish.pgn) |
| Rev9 → rev8 Karsli | 16 | 2 / 0 / 14 | [JSON](combined-vs-first10.json), [PGN](combined-vs-first10.pgn) |

Toplam 96 oyun tamamlandı; süre aşımı ve ply-limit truncation yok. Her seri ayrı değerlendirilmelidir; farklı rakiplere karşı skorlar tek bir güç/Elo ölçümü olarak toplanmadı.

Az sayıdaki sonuç, tekrarlanan açılışlar ve çok yüksek beraberlik oranı nedeniyle **Elo artışı veya Stockfish’ten üstünlük kanıtlanmış değildir**. Özellikle bu ultra kısa kontrol, kullanıcının 1–20 dakikalık internet oyunlarını doğrudan temsil etmez. Daha büyük bağımsız açılış setiyle, hedef sürelerde ve yeni seçeneklerin tek tek çıkarıldığı maçlarla kalibrasyon gerekir. Bu nedenle yeni beş özelliğin varsayılanları otomatik yükseltilmedi.

## Kaynak, lisans ve yeniden üretim

Cinder/Obsidian/Alexandria için 187 ve sonraki 14 motor için 954 seçilmiş kaynak/build/belge dosyası Git blob SHA-1 ve SHA-256 ile doğrulandı. Kaynak commit’leri ayrı manifestlerde sabit; ekran görüntüsündeki rating’ler güncel canlı CCRL doğrulaması sayılmaz. Triumviratus v6.0 etiketinin kendi README’si development yazıyor; bu kaynağın listedeki ölçülmüş binary ile birebir aynı olduğu iddia edilmez. Tarnished v6.0 kaynak kimliği “Eternal” olarak doğrulandı. Önceki Clover quiet-check fikri 9.1’den geldi; yeni 9.0 incelemesi onu yeni import diye göstermiyor.

Yeni beş uyarlamanın kaynakları `../../source/src/karsli_first10.h`, `../../source/src/karsli_orange.h` ve ilgili search/history/movepick bağlantılarıdır. [Rev8→rev9 kaynak farkı](revision9.patch), [build kaydı](build.json), [sanitizer build kaydı](sanitized-build.json), [karşılık gelen kaynak manifesti](corresponding-source-manifest.json) ve [bağımsız artifact/maç denetimi](artifact-audit.json) yeniden üretim kaydını tamamlar. Eski binary’ler ve kaynak snapshot’ları korundu. Normal binary SHA-256: `6441f59222f148b49c1e952b24a2e17e8c5a5bbf86cc108ca43243f094dabef9`.

Stockfish GPL, Reckless AGPL ve diğer bileşenlerin kayıtlı koşulları [NOTICE.md](../../NOTICE.md) içinde; Hobbes MIT metni ve Halogen GPL metni eklenip upstream byte’larıyla karşılaştırıldı. Atıflarda Obsidian Gabriele Lombardo, Hobbes Dan Kelsey, Halogen Kieren Pearson ve Ethereal katkı zinciri korunuyor. İncelenen motorlardan yeni ağ veya eğitim verisi alınmadı. Mac prototipi tamamlandı; iOS uygulaması bu çalışmada değiştirilmedi.

Çalışma alanı kökünde `python3 experiments/karsli/build.py --jobs 4` ile build alınabilir. Kullanılan Node yolu ve temel komutlar [README.md](../../README.md) içinde. `tools/compare.mjs`, `tools/validate-orange.mjs`, `tools/validate-material.mjs` ve `tools/audit-orange.mjs` koşul/kanıtları kaydeder. Profil değişikliklerini motor idle iken uygulayıp `ucinewgame` ile öğrenilmiş worker tablolarını sıfırlayın.
