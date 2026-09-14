# Enverse katalog ve sürüm sistemi — adım adım kullanım rehberi

Bu belgeyi baştan sona okuyup sırasıyla uygulayan biri, Enverse'e yeni uygulama ekleyebilir veya mevcut bir uygulamanın APK'sını güncelleyebilir. Teknik ayrıntı bilmeniz gerekmez; alanları tahmin etmeyin ve adımları atlamayın.

## 1. Sistem hangi parçalardan oluşuyor?

İki ayrı GitHub deposu vardır:

1. `Enverse`: uygulamanın kaynak kodudur. Private yapılabilir.
2. `Enverse-Distribution`: telefonların okuduğu katalog ve APK dosyalarıdır. Public kalmalıdır.

Dağıtım deposundaki önemli parçalar:

- `manifest.json`: İnsanların düzenlediği uygulama listesi.
- GitHub Releases: Gerçek `.apk` dosyalarının bulunduğu yer.
- `apps.json`: GitHub Actions'ın otomatik ürettiği ve imzaladığı katalog. Elle değiştirmeyin.
- `Sign application catalog`: APK boyutunu/hash'ini hesaplayan ve kataloğu imzalayan GitHub Actions işi.

Telefon şu sırayla çalışır:

1. Enverse `apps.json` dosyasını indirir.
2. Katalog imzasını uygulamanın içindeki açık anahtarla doğrular.
3. Her uygulamanın telefondaki gerçek `versionCode` değerini Android'den okur.
4. Katalog değeri kurulu değerden büyükse **Güncelle** gösterir.
5. APK indirildiğinde boyut ve SHA-256 doğrulanmadan Android kurucusu açılmaz.
6. Kullanıcı kurulumu onaylayınca Enverse tekrar kurulu sürümü Android'den okur.

## 2. Sürüm alanlarının değişmez kuralı

Her APK'nın iki sürüm alanı vardır:

- `versionName`: Kullanıcıya gösterilen metindir. Örnek: `10.6.5`.
- `versionCode`: Android'in karşılaştırdığı tam sayıdır. Örnek: `23`.

En önemli kural:

> `manifest.json` içindeki `versionName` ve `versionCode`, yüklediğiniz APK'nın içindeki gerçek değerlerle birebir aynı olmalıdır.

Yeni sürümde `versionCode` mutlaka eskisinden büyük olmalıdır. `versionName` değişip `versionCode` değişmezse Enverse güncelleme göstermez. APK değişmeden yalnızca manifest sürümünü yükseltirseniz Enverse sürekli güncelleme gösterir; çünkü kurulumdan sonra Android hâlâ APK'nın eski gerçek sürümünü bildirir.

APK'nın gerçek sürümünü bilgisayarda kontrol etme:

```bash
aapt dump badging uygulama.apk | head -1
```

Örnek çıktı:

```text
package: name='com.maxen.app' versionCode='23' versionName='10.6.5'
```

Manifestte tam olarak `versionCode: 23` ve `versionName: "10.6.5"` yazmalıdır.

## 3. Mevcut uygulamanın yeni sürümünü yayınlama

Örnek olarak Maxen güncellenecek:

1. Maxen projesinde Android `versionCode` değerini artırın ve `versionName` değerini belirleyin.
2. Release APK oluşturun.
3. `aapt dump badging maxen.apk | head -1` ile paket ve sürümü doğrulayın.
4. Dosyanın adını manifestteki `asset` ile aynı yapın. Maxen için ad `maxen.apk` olmalıdır.
5. GitHub'da `Enverse-Distribution` deposunu açın.
6. **Releases** bölümünden en son release'i açın ve eski `maxen.apk` varlığını yeni dosyayla değiştirin.
7. Depodaki `manifest.json` dosyasını düzenleyin.
8. Yalnızca ilgili uygulamanın `versionName`, `versionCode` ve `changelog` alanlarını gerçek APK'ya göre değiştirin.
9. Değişikliği `main` dalına kaydedin.
10. **Actions → Sign application catalog** işinin yeşil tik ile tamamlanmasını bekleyin.
11. Telefonda Enverse'i açıp ekranı aşağı çekin.
12. Kartta **Güncelle · yeni-sürüm** yazdığını kontrol edin.
13. Güncellemeyi kurun. Enverse'e dönünce kart **Güncel** olmalıdır.

## 4. Tamamen yeni bir uygulama ekleme

1. APK'nın paket adını, `versionName` ve `versionCode` değerlerini `aapt dump badging` ile öğrenin.
2. APK'ya kısa, benzersiz ve boşluksuz bir dosya adı verin. Örnek: `notlar.apk`.
3. APK'yı en son `Enverse-Distribution` Release'ine yükleyin.
4. `manifest.json` içindeki `apps` dizisinin sonuna şu biçimde kayıt ekleyin:

```json
{
  "id": "notlar",
  "name": "Notlar",
  "description": "Kısa açıklama",
  "category": "Araçlar",
  "packageName": "com.ornek.notlar",
  "asset": "notlar.apk",
  "versionName": "1.0.0",
  "versionCode": 1,
  "accent": "#4F7DF3",
  "changelog": ["İlk sürüm"]
}
```

Alan açıklamaları:

- `id`: Katalog içindeki benzersiz kimlik. Küçük harf, rakam ve tire kullanın.
- `name`: Kartta görünen isim.
- `description`: Tek satırlık kısa açıklama.
- `category`: Filtrelerde görünecek kategori.
- `packageName`: APK içindeki gerçek Android paket adı. Tahmin etmeyin.
- `asset`: Release'e yüklenen dosyanın birebir adı.
- `versionName`: APK içindeki gerçek görünen sürüm.
- `versionCode`: APK içindeki gerçek Android sürüm sayısı.
- `accent`: `#RRGGBB` biçiminde kart vurgu rengi.
- `changelog`: Detay ekranında gösterilecek yenilik maddeleri.

Kaydettikten sonra Actions işinin tamamlanmasını bekleyin ve Enverse ekranını aşağı çekin. Yeni uygulama otomatik görünür; Enverse APK'sını yeniden derlemek gerekmez.

## 5. Neleri elle değiştirmemelisiniz?

- `apps.json` dosyasını elle değiştirmeyin. İmza geçersiz olur veya bir sonraki Actions çalışmasında değişiklik silinir.
- SHA-256 ve dosya boyutunu elle yazmayın. Actions bunları gerçek APK'dan hesaplar.
- APK'yı değiştirmeden katalog sürümünü yükseltmeyin.
- `versionCode` değerini düşürmeyin veya daha önce kullanılan değeri tekrar kullanmayın.
- `CATALOG_PRIVATE_KEY` GitHub secret değerini kaynak koda, issue'ya veya mesaja yapıştırmayın.
- Dağıtım reposunu private yapmayın. Private olursa telefonlar katalog ve APK indiremez.

## 6. Durum yazıları ne anlama gelir?

- **Kur**: Paket telefonda bulunamadı.
- **Güncel**: Kurulu `versionCode`, katalog değerine eşit veya daha büyük.
- **Güncelle**: Katalogdaki `versionCode`, kurulu değerden büyük.
- **İndiriliyor**: APK indiriliyor; yüzde, hız ve kalan süre görünür.
- **Duraklatıldı**: İndirme devam ettirilebilir veya iptal edilebilir.
- **Doğrulanıyor**: Dosya boyutu ve SHA-256 kontrol ediliyor.
- **Kurulum bekleniyor**: Android'in kurucu ekranı açıldı. Kurucu kapatılınca bu geçici durum temizlenir ve gerçek kurulu sürüm tekrar okunur.
- **Dosya doğrulanamadı**: İndirilen APK katalogdaki SHA-256 ile eşleşmedi; dosya silinir ve kurulmaz.

## 7. Sorun çözme

### Güncelleme kuruldu ama hâlâ Güncelle yazıyor

APK'nın gerçek `versionCode` değeri manifesttekinden küçüktür. `aapt dump badging` ile APK'yı kontrol edin. Manifesti gerçek değere geri alın veya gerçekten daha yüksek `versionCode` taşıyan yeni APK üretin.

### Kurulum bekleniyor yazısı kalıyor

Enverse'in güncel sürümünde kurucu açıldıktan sonra geçici iş otomatik temizlenir. Uygulamayı tekrar açın veya ekranı aşağı çekin. Devam ediyorsa kurduğunuz APK'nın paket adı ve gerçek sürümünü kontrol edin.

### Yeni uygulama görünmüyor

1. Actions işinin yeşil olduğundan emin olun.
2. Dağıtım reposunun public olduğunu kontrol edin.
3. `asset` adı ile Release dosya adının birebir aynı olduğunu kontrol edin.
4. Enverse ekranını aşağı çekin.
5. Actions logunda imza veya eksik APK hatası olup olmadığına bakın.

### Actions kırmızı oldu

En sık nedenler: manifestte yazan APK dosyasının Release'te olmaması, bozuk JSON veya `CATALOG_PRIVATE_KEY` secret değerinin silinmesidir. Hata satırını Actions logundan okuyup düzeltin; `apps.json` dosyasını elle kurtarmaya çalışmayın.

## 8. Yetki ve güvenlik

Public repo herkes tarafından okunabilir ama herkes yazamaz. Uygulama ekleme, manifest değiştirme ve Release'e APK yükleme yetkisi yalnızca repo sahibinde ve sahibin açıkça collaborator yaptığı hesaplarda bulunur.

Özel katalog anahtarının yerel yedeği güvenli yerde tutulmalıdır. Anahtar kaybolursa mevcut Enverse sürümleri yeni katalog imzalarını doğrulayamaz ve yeni açık anahtarla bir Enverse APK güncellemesi yayınlamak gerekir.
