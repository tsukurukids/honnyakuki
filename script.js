// HTMLにある部品（ボタンやテキストボックス）を見つけて、プログラムで使えるようにするよ！
const sourceLangSelect = document.getElementById('source-lang'); // 翻訳もとの言葉を選ぶメニュー
const targetLangSelect = document.getElementById('target-lang'); // 翻訳先の言葉を選ぶメニュー
const inputText = document.getElementById('input-text'); // 入力するテキストボックス
const outputText = document.getElementById('output-text'); // 結果が出るテキストボックス
const translateBtn = document.getElementById('translate-btn'); // 翻訳ボタン
const speakInputBtn = document.getElementById('speak-input-btn'); // 入力側の聞くボタン
const speakOutputBtn = document.getElementById('speak-output-btn'); // 出力側の聞くボタン

// 「翻訳する！」ボタンが押されたときのルール
translateBtn.addEventListener('click', async () => {
    // 1. 入力された文字を読み取る
    const text = inputText.value;

    // もし何も入力されていなかったら、注意して終わる
    if (text === '') {
        alert('翻訳したい言葉を入力してね！');
        return;
    }

    // 2. どの言葉から、どの言葉に翻訳するかを調べる
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;

    // 翻訳中という文字を出すよ
    outputText.value = '翻訳しているよ... 少し待ってね！';

    try {
        // 3. もっと賢いインターネットの無料翻訳サービス（Google翻訳の仕組み）にお願いをする
        // インターネットの住所（URL）を作るよ
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        // お願いをして、返事を待つ（fetchという機能を使うよ）
        const response = await fetch(url);
        const data = await response.json(); // 返事をプログラムで読める形（JSON）にする

        // 4. 翻訳された言葉を、結果のテキストボックスに入れる
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            outputText.value = data[0][0][0];
        } else {
            outputText.value = 'ごめんね、うまく翻訳できなかったみたい。';
        }

    } catch (error) {
        // もしインターネットにつながらなかったり、エラーが起きたらここに来るよ
        outputText.value = 'エラーが起きたよ。インターネットにつながっているか確認してね！';
    }
});

// 声を出して読み上げるための特別な命令（関数：かんすう）を作るよ
function speakText(text, lang) {
    // もし文字がなかったら何もしない
    if (text === '') return;

    // 声を出すための準備
    const utterance = new SpeechSynthesisUtterance(text);

    // どの言葉のなまり（発音）で読むかを決める
    utterance.lang = lang;

    // 声の高さを少し高くして、聞きやすくするよ（1が普通）
    utterance.pitch = 1.2;
    // しゃべるスピードを少しゆっくりにするよ（1が普通）
    utterance.rate = 0.9;

    // パソコンに「しゃべって！」と命令する
    speechSynthesis.speak(utterance);
}

// 入力側の「声で聞く」ボタンが押されたときのルール
speakInputBtn.addEventListener('click', () => {
    const text = inputText.value; // 入力された文字
    const lang = sourceLangSelect.value; // 選ばれている言葉
    speakText(text, lang); // 作った命令を呼び出すよ
});

// 出力側の「声で聞く」ボタンが押されたときのルール
speakOutputBtn.addEventListener('click', () => {
    const text = outputText.value; // 翻訳された文字
    const lang = targetLangSelect.value; // 選ばれている言葉
    speakText(text, lang); // 作った命令を呼び出すよ
});

// --- ここから新しく追加した「検索（けんさく）」のルール ---

// メニューから言葉をさがす機能
function setupSearch(searchId, selectId, resultsId) {
    const searchInput = document.getElementById(searchId);
    const select = document.getElementById(selectId);
    const resultsDiv = document.getElementById(resultsId);
    // 全ての言葉のリストを最初に覚えておくよ
    const allOptions = Array.from(select.options);

    // 検索ボックスに文字が入力されたら動くルール
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase(); // 入力された文字

        // 検索結果のボタンを一旦きれいに消す
        resultsDiv.innerHTML = '';

        // メニューの中身も一旦空っぽにする（絞り込みのため）
        select.innerHTML = '';

        // もし何も入力されていなかったら、全部の言葉をメニューに戻して終わる
        if (query === '') {
            allOptions.forEach(opt => select.appendChild(opt));
            return;
        }

        // 覚えているリストの中から、入力した文字が含まれるものだけを探す
        allOptions.forEach(option => {
            if (option.text.toLowerCase().includes(query)) {
                // 1. メニューに言葉を戻す（絞り込み）
                select.appendChild(option);

                // 2. 検索結果のボタンを作る
                const btn = document.createElement('button');
                btn.textContent = option.text;
                btn.className = 'result-btn';

                // ボタンが押されたときのルール
                btn.onclick = () => {
                    select.value = option.value; // その言葉を選ぶ
                    resultsDiv.innerHTML = ''; // ボタンを消す
                    searchInput.value = ''; // 検索欄を空にする
                    // メニューを全部見えるように戻しておく
                    select.innerHTML = '';
                    allOptions.forEach(opt => select.appendChild(opt));
                    select.value = option.value; // もう一度選び直す
                };
                resultsDiv.appendChild(btn);
            }
        });
    });
}

// 左側（翻訳もと）と右側（翻訳先）の両方に検索機能をセットするよ
setupSearch('source-search', 'source-lang', 'source-results');
setupSearch('target-search', 'target-lang', 'target-results');
