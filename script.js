// -----------------定数の宣言-----------------
// HTML内の要素を定数にしておく (操作を簡単にするため)
const gameArea = document.getElementById("game-area");
const startButtonBeginner = document.getElementById("start-btn_beginner");
const startButtonIntermediate = document.getElementById("start-btn_intermediate");
const startButtonAdvanced = document.getElementById("start-btn_advanced");
const overlay = document.getElementById("overlay");
const dialog = document.getElementById("dialog");

// ゲームの難易度
const level_beginner = 0;
const level_intermediate = 1;
const level_advanced = 2;

// ゲームの制限時間
const timeLimit = 10;

// 敵の出現する間隔
const enemySpawnInterval = [1000, 750, 500];

// 敵の消失時間
const enemyFadeInterval = [3000, 2000, 1500];

// -----------------変数の宣言-----------------
// 現在のスコアを記録する変数
let score = 0;

// ハイスコアを記録する変数
let highScore = 0;
let recordName = '';

// 敵の出現とタイマー用の変数  (あとで止めるために必要)
let gameInterval;
let timerInterval;

// ゲームの制限時間カウントする変数
let timeLimitCount;
let timeLimitCount2;

// レア敵を出すタイミング
let rareEnemeyCount;

// 出現した敵の数
let enemyCount;

// -----------------関数の宣言-----------------
// ゲームスタート時に呼ばれる関数
function startGame(level) {

    score = 0;  // スコアを0に戻す
    timeLimitCount = timeLimit;     // ゲームの制限時間を設定
    timeLimitCount2= 0;
    enemyCount = 0;
    startButtonBeginner.disabled = true;    // ボタンを連打できないように無効化
    startButtonIntermediate.disabled = true;
    startButtonAdvanced.disabled = true;
    document.getElementById("record-clear").disabled = true;

    gameArea.innerHTML = "";        // ゲームエリアを空にする
    clearInterval(gameInterval);    // 前回のゲームが動いていたら止める
    clearInterval(timerInterval);

    // 残り時間・スコア・ハイスコアを表示
    document.getElementById("score-area").textContent = `スコア： 0 / ハイスコア： ${highScore}(達成者：${recordName})`;
    document.getElementById("timer-area").textContent = `残り：${timeLimitCount}s`;

    // レア敵を1体だけ必ず出現させる
    let maxEnemy = (timeLimit * 1000 ) / enemySpawnInterval[level] - 1;
    rareEnemeyCount = Math.ceil(Math.random() * maxEnemy);

    // 1秒ごとに敵を出現させる
    gameInterval = setInterval(() => 
        spawnEnemy(level), enemySpawnInterval[level]
    );

    // ★1秒経った場合
    timerInterval = setInterval(() => {

        timeLimitCount2++;
        if (timeLimitCount2 == 10) {

            timeLimitCount2 = 0;
            timeLimitCount--;   //残り秒数を1減らす

            //時間を更新
            document.getElementById("timer-area").textContent = `残り：${timeLimitCount}s`;
        }

        // スコア表示を更新
        document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore}(達成者：${recordName})`;

        // 時間切れになったらゲーム終了
        if (timeLimitCount <= 0) {

            gameArea.innerHTML = "";        // ゲームエリアを空にする
            clearInterval(gameInterval);    // 敵出現を止める
            clearInterval(timerInterval);   // タイマーを止める
            startButtonBeginner.disabled = false;   // スタートボタンを再び有効にする
            startButtonIntermediate.disabled = false;
            startButtonAdvanced.disabled = false;
            document.getElementById("record-clear").disabled = false;

            // 今回のスコアがハイスコアを超えたら保存する
            if (score > highScore) {

                //ダイアログを開く
                overlay.style.display = "block";
                dialog.style.display = "block";

                // highScore = score;
                // localStorage.setItem("highScore", highScore);   // ブラウザに保存
            }

            // 最終結果を表示
            document.getElementById("timer-area").textContent = `🎉 ゲーム終了！`;
            // document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore}(達成者：${name})`;

        }
    }, 100);
}

// 敵キャラを1体出現させる関数
function spawnEnemy(level) {

    enemyCount++;

    // レア敵出現タイミングの場合
    if (enemyCount == rareEnemeyCount) {

        // divタグを作って、enemyクラスをつける
        const enemy = document.createElement("div");
        enemy.className = "enemy-rare";

        // サイズをランダムに設定
        const size = Math.floor(Math.random() * 71) + 30; // 30〜100
        enemy.style.width = size + "px";
        enemy.style.height = size + "px";

        // 敵の出現位置 (画面内のランダムな場所)
        const maxX = gameArea.clientWidth - size;     // 敵の幅ぶん引いてる
        const maxY = gameArea.clientHeight - size;
        enemy.style.left = Math.random() * maxX + "px";
        enemy.style.top = Math.random() * maxY + "px";

        // ★敵をクリック (タップ) した場合
        enemy.addEventListener("click", () => {

            gameArea.removeChild(enemy);    // 敵を消す
            score += 10;    // スコアを10加算

            // // ハイスコアを更新
            // if (score > highScore) {
            //     highScore = score;
            //     localStorage.setItem("highScore", highScore);   // 保存
            // }
        });

        // ★3秒経った場合
        setTimeout(() => {

            // タップされなければ自動で消す
            if (gameArea.contains(enemy)) {
                gameArea.removeChild(enemy);
            }
        }, enemyFadeInterval[level]);

        // 敵を画面に追加
        gameArea.appendChild(enemy);
    } else {

        // divタグを作って、enemyクラスをつける
        const enemy = document.createElement("div");
        enemy.className = "enemy";

        // サイズをランダムに設定
        const size = Math.floor(Math.random() * 121) + 30; // 30〜150
        enemy.style.width = size + "px";
        enemy.style.height = size + "px";

        // 敵の出現位置 (画面内のランダムな場所)
        const maxX = gameArea.clientWidth - size;     // 敵の幅ぶん引いてる
        const maxY = gameArea.clientHeight - size;
        enemy.style.left = Math.random() * maxX + "px";
        enemy.style.top = Math.random() * maxY + "px";

        // ★敵をクリック (タップ) した場合
        enemy.addEventListener("click", () => {

            gameArea.removeChild(enemy);    // 敵を消す
            score += Math.floor(6 - Math.floor(size / 30));    // スコアを加算

            // // ハイスコアを更新
            // if (score > highScore) {
            //     highScore = score;
            //     localStorage.setItem("highScore", highScore);   // 保存
            // }
        });

        // ★3秒経った場合
        setTimeout(() => {

            // タップされなければ自動で消す
            if (gameArea.contains(enemy)) {
                gameArea.removeChild(enemy);
            }
        }, enemyFadeInterval[level]);

        // 敵を画面に追加
        gameArea.appendChild(enemy);
    }
}

// -----------------実行時に呼ばれるところ-----------------
// 以前保存したハイスコアを読み込む (localStorageから取得)、無ければ0
let record = JSON.parse(localStorage.getItem("record"));
if (record != null) {

    highScore = record.score || 0;
    recordName = record.name;
} else {

    highScore = 0;
    recordName = '';
}

// ハイスコアを画面に表示
document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore}(達成者：${recordName})`;

// ★「スタート」ボタンが押されたらゲーム開始
startButtonBeginner.addEventListener("click", () => startGame(level_beginner));
startButtonIntermediate.addEventListener("click", () => startGame(level_intermediate));
startButtonAdvanced.addEventListener("click", () => startGame(level_advanced));
document.getElementById("dialog-ok").addEventListener("click", () => {

    recordName = document.getElementById("name").value;
    highScore = score;
    let record = {name: recordName, score: highScore};
    localStorage.setItem("record", JSON.stringify(record));   // ブラウザに保存
    
    // 最終結果を表示
    document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore}(達成者：${recordName})`;

    // ダイアログを閉じる
    overlay.style.display = "none";
    dialog.style.display = "none";
    document.getElementById("name").value = '';
});
document.getElementById("dialog-cancel").addEventListener("click", () => {

    // ダイアログを閉じる
    overlay.style.display = "none";
    dialog.style.display = "none";
    document.getElementById("name").value = '';
});
document.getElementById("record-clear").addEventListener("click", () => {

    recordName = '';
    highScore = 0;
    let record = {name: recordName, score: highScore};
    localStorage.setItem("record", JSON.stringify(record));   // ブラウザに保存
    
    document.getElementById("score-area").textContent = `スコア： ${score} / ハイスコア： ${highScore}(達成者：${recordName})`;
});