// サービスワーカー：アプリをインターネットなしでも動かせるようにする「お助けプログラム」だよ

const CACHE_NAME = 'translation-app-v1';
// 保存しておきたいファイルのリスト
const urlsToCache = [
  'Tasoko　Keito.html',
  'style.css',
  'script.js',
  'icon.png',
  'manifest.json'
];

// アプリがはじめてひらかれたときに、ファイルを保存（キャッシュ）するよ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('ファイルを保存したよ！');
        return cache.addAll(urlsToCache);
      })
  );
});

// ファイルが必要になったときに、保存したところから取り出してくるよ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 保存されていたらそれを返す、なければインターネットから持ってくる
        return response || fetch(event.request);
      })
  );
});
