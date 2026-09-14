# Enverse Distribution

Enverse'in public APK dağıtımı ve RSA imzalı uygulama kataloğudur. Kaynak kod burada tutulmaz. Repoya ve Release varlıklarına yalnızca sahibi veya açıkça yetkilendirilmiş collaborator yazabilir.

Yeni uygulama ve sürüm yayınlamanın eksiksiz anlatımı için [`KATALOG_KULLANIM_REHBERI.md`](./KATALOG_KULLANIM_REHBERI.md) dosyasını okuyun.

## Yeni uygulama veya sürüm yayınlama

1. APK dosyasını en son GitHub Release'e yükleyin.
2. `manifest.json` içindeki uygulama kaydını ve `asset`, `versionName`, `versionCode` alanlarını güncelleyin.
3. Değişikliği `main` dalına gönderin veya **Sign application catalog** iş akışını çalıştırın.

İş akışı APK boyutunu ve SHA-256 değerini kendi hesaplar, kataloğu repository secret içindeki özel anahtarla imzalar ve `apps.json` dosyasını günceller. Özel anahtar hiçbir APK'ya veya git geçmişine girmez.
