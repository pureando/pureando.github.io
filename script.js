// -----------------定数の宣言-----------------
// HTML内の要素を定数にしておく (操作を簡単にするため)
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");

// -----------------変数の宣言-----------------

// -----------------関数の宣言-----------------
// ゲームスタート時に呼ばれる関数
function startGame() {

    startButton.disabled = true;    // ボタンを連打できないように無効化

    gameArea.innerHTML = "";        // ゲームエリアを空にする

    // 敵キャラを1体出現させる
    spawnEnemy();
}

// 敵キャラを1体出現させる関数
function spawnEnemy() {

    // divタグを作って、enemyクラスをつける
    const enemy = document.createElement("div");
    enemy.className = "enemy";

    // 敵の出現位置 (画面内のランダムな場所)
    const maxX = gameArea.clientWidth - 60;     // 敵の幅ぶん引いてる
    const maxY = gameArea.clientHeight - 60;
    enemy.style.left = maxX + "px";
    enemy.style.top = maxY + "px";

    // ★敵をクリック (タップ) した場合
    enemy.addEventListener("click", () => {

        gameArea.removeChild(enemy);    // 敵を消す
    });

    // 敵を画面に追加
    gameArea.appendChild(enemy);
}

// -----------------実行時に呼ばれるところ-----------------
// ★「スタート」ボタンが押されたらゲーム開始
startButton.addEventListener("click", startGame);