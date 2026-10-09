# Embla Grid Slider

[Embla Carousel](https://www.embla-carousel.com/) (`embla-carousel-react`, MIT) üzerine kurulmuş, **grid düzeninde ve sütun öncelikli** sıralanan bir React slider bileşeni.

Öğeler sütun sütun yerleşir: önce ilk sütun yukarıdan aşağıya dolar, sonra bir sonrakine geçilir. `rows = 3` için:

```
1  4  7  10
2  5  8  11
3  6  9  12
```

## Çalıştırma

```bash
npm install
npm run dev      # demo sayfası
npm test         # sıralama testleri
npm run build    # tip kontrolü + üretim derlemesi
```

## Kullanım

```tsx
import { GridSlider } from './GridSlider'

<GridSlider
  items={products}
  rows={2}               // 1–4 arası
  columnsPerView={3}     // aynı anda görünen sütun sayısı
  gap={12}               // px
  getKey={(p) => p.id}
  renderItem={(p) => <ProductCard product={p} />}
/>
```

| Prop | Varsayılan | Açıklama |
| --- | --- | --- |
| `items` | — | Gösterilecek öğeler |
| `renderItem` | — | `(item, index) => ReactNode` |
| `getKey` | index | Her öğe için React anahtarı |
| `rows` | `2` | Sütun başına satır (1–4). Geçersiz değer sınırlara çekilir, geliştirme modunda uyarı verir |
| `columnsPerView` | `3` | Görünen sütun sayısı |
| `gap` | `12` | Sütunlar ve satırlar arası boşluk (px) |
| `options` | — | Embla seçenekleri (`loop`, `dragFree`, `slidesToScroll` vb.) |
| `showDots` / `showArrows` | `true` | Sayfa noktaları ve önceki/sonraki okları |
| `ariaLabel` | `"Slider"` | Ekran okuyucu etiketi |
| `onSelect` | — | Seçili sayfa değişince çağrılır |

## Nasıl çalışır

`chunkColumns` öğeleri `rows` boyutunda sütunlara böler ve son sütunu boş hücrelerle tamamlar. Her sütun Embla'ya bir slide olarak verilir, böylece sürükleme ve snap sütun bazında çalışır. Sütun içi düzen CSS grid ile yapılır, bu sayede tüm satırlar aynı yükseklikte kalır.
