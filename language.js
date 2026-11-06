'use strict';
const englishText = {
 "回路の種類": "Circuit type",
 "直列抵抗2個": "Two in series",
 "並列抵抗2個": "Two in parallel",
 "直列＋並列": "Series + parallel",
 "画面上の「回路の種類」で1つ選ぶだけで、不要な抵抗はOPENまたは0 Ωに自動設定されます。使う抵抗の値を変更してください。USB接続中は実機の設定に合わせて選択が切り替わります。": "Choose one circuit type. Unused resistors are automatically set to OPEN or 0 Ω. Adjust the active resistors. While connected by USB, the selection follows the physical device.",
 "高さでわかる 電圧と電流 — USB連動版": "Voltage and Current through Height — USB Edition",
 "水と電気の実験室 / USB": "Water & Electricity Lab / USB",
 "高さでわかる 電圧と電流": "Voltage and Current through Height",
 "ESP32に接続": "Connect ESP32",
 "切断": "Disconnect",
 "画面操作モード・電源と抵抗値を画面で変更できます": "Screen mode · Adjust voltage and resistors on screen",
 "表示を一時停止": "Pause animation",
 "表示を再生": "Resume animation",
 "電源": "Supply",
 "抵抗1・枝1": "Resistor 1 · Branch 1",
 "抵抗2・合流後": "Resistor 2 · After merge",
 "抵抗3・枝2": "Resistor 3 · Branch 2",
 "抵抗1": "Resistor 1",
 "抵抗2": "Resistor 2",
 "抵抗3": "Resistor 3",
 "回路：": "Circuit:",
 "（抵抗1 ∥ 抵抗3）＋ 抵抗2": "(Resistor 1 ∥ Resistor 3) + Resistor 2",
 "／　抵抗1または3をOPEN → 直列のみ　／　抵抗2を0Ω → 並列のみ": "/ R1 or R3 OPEN → Series only / R2 = 0 Ω → Parallel only",
 "電源電圧": "Supply voltage",
 "全体の抵抗": "Total resistance",
 "並列部 R1∥R3": "Parallel R1∥R3",
 "全電流": "Total current",
 "01 水の流れ": "01 Water flow",
 "02 電流と電位": "02 Current and potential",
 "発熱量（W）を表示": "Show heating power (W)",
 "抵抗ごとの表示 — 実機のOLEDと同じ値": "Resistor readings — Same values as the OLEDs",
 "模型の読み方・USB接続": "Model guide & USB connection",
 "細い管ほど大きい抵抗。高さは電位、粒の通過頻度は流量に対応します。水車の回転は、抵抗が受け取る電力に対応します。": "Narrower pipes represent higher resistance. Height represents potential, particle frequency represents flow, and water-wheel rotation represents power.",
 "青い光の明るさは電位、抵抗の色（灰色→オレンジ→白みのあるオレンジ）とWの値は発熱の電力。枝電流の和が全電流になります。": "Blue brightness represents potential. Resistor color (gray → orange → pale orange) and watts represent heating power. Branch currents add up to total current.",
 "Arduino IDEのシリアルモニターを閉じてから、ESP32のポートを選択してください。": "Close the Arduino IDE Serial Monitor, then select the ESP32 port.",
 "並列は常に2本です。OPENは導通なし、0Ωは導線として扱います。画面の一時停止は実機を止めません。": "There are two parallel branches. OPEN breaks conduction. A 0 Ω resistor acts as a wire. Pausing the screen pauses only its animation.",
 "電流・電力は小数2桁、電圧は小数1桁。Wは1秒あたりの発熱量（J/s）です。0Vでも流れを示す薄い青色を残します。接続にはUSB通信対応ケーブルが必要です。": "Current and power use two decimal places; voltage uses one. Watts represent heat energy per second (J/s). A faint blue trace shows flow at 0 V. Use a USB data cable.",
 "高さは0Vを基準にした電位です。理想導線は水平で、抵抗の両端で高さを失います。並列の2本は同じ電位差です。上下方向はエネルギーの違いを示す模式表現で、水道管の実際の形ではありません。0Ωの枝どうしの電流分配や理想電源の短絡電流は一意に計算できないため、該当値を「—」で表示します。": "Height represents potential relative to 0 V. Ideal wires are level, and resistors reduce potential. Parallel branches have the same potential difference. Vertical positions illustrate energy differences. Indeterminate currents in ideal zero-ohm branches or shorts are shown as “—”.",
 "PC版Chrome / EdgeでHTTPSまたはlocalhostから開いてください。接続後は実機のつまみが設定を決めます。接続はデータ受信専用で、画面操作から実機へ設定を送りません。切断後は最後の設定を引き継いで画面だけで操作できます。": "Open via HTTPS or localhost in desktop Chrome or Edge. Once connected, the physical controls set the circuit. The screen receives data from the device. After disconnecting, you can adjust the last received settings on screen.",
 "電源が短絡しています。理想回路の電流は計算できません。": "The supply is shorted. Current is undefined in this ideal circuit.",
 "両方の回路部分がOPENのため、中間点の電位は決まりません。": "Both circuit sections are OPEN. The midpoint potential is undefined.",
 "並列の両枝が0Ωです。全電流は計算できますが、枝への配分は決まりません。": "Both parallel branches are 0 Ω. Total current is known, but its division is undefined.",
 "OPEN：回路全体の電流は0 Aです。": "OPEN: Total current is 0 A.",
 "ポンプ": "Pump",
 "高さ（水圧）": "Head (pressure)",
 "合流後の高さ": "Head after merge",
 "高さ不定": "Head undefined",
 "電位不定": "Potential undefined",
 "枝の間隔は模式表示（両端は同じ高さ）": "Branch spacing is schematic (equal head at both ends)",
 "枝の間隔は模式表示（両端の電位差は0 V）": "Branch spacing is schematic (voltage drop = 0 V)",
 "基準の高さ：エネルギーを渡した後": "Reference head: after delivering energy",
 "0 V：エネルギーを渡した後": "0 V: after delivering energy",
 "実機連動モード・USB接続中・実機のつまみで操作": "Device mode · USB connected · Use physical controls",
 "最終受信 ": "Last received ",
 "ESP32のUSBポートを選択してください": "Select the ESP32 USB port",
 "USB接続済み・実機からのデータを待っています": "USB connected · Waiting for device data",
 "画面操作モード・接続をキャンセルしました": "Screen mode · Connection canceled",
 "画面操作モード・USBを切断しました": "Screen mode · USB disconnected",
 "画面操作モード・USB接続が切れました": "Screen mode · USB connection lost",
 "通信が途切れました：": "Connection interrupted: ",
 "接続できません：": "Unable to connect: ",
 "USB接続済み・データ待ち。ESP32の連動版プログラムを確認してください": "USB connected · Waiting for data. Check the ESP32 USB-link firmware.",
 "受信が止まっています。数値は最後に受信した値です。": "Data reception stopped. Values show the last received readings.",
 "USB接続にはPC版Chrome / EdgeでHTTPSまたはlocalhostから開いてください。画面だけの操作はできます。": "For USB, open HTTPS or localhost in desktop Chrome or Edge. Screen-only controls are available.",
 "USB接続": "USB connection",
 "回路の設定": "Circuit settings",
 "回路の数値": "Circuit readings",
 "2本の並列の水道管と合流後の細管": "Two parallel water pipes and a restriction after merging",
 "抵抗1と③の並列と抵抗2の直列の電位模型": "Potential model of parallel R1 and R3 followed by R2",
 "回路の切り替え方": "Choosing a circuit",
 "OPENは導通なし、0 Ωは導線です。下の設定にすると、図の不要な枝や0 Ωの抵抗が自動的に消えます。": "OPEN breaks conduction; 0 Ω acts as a wire. The settings below automatically hide unused branches and zero-ohm resistors.",
 "実験したい回路": "Circuit to explore",
 "抵抗3（並列の枝）": "Resistor 3 (parallel branch)",
 "抵抗2（合流後）": "Resistor 2 (after merging)",
 "図の表示": "Diagram",
 "抵抗1個": "One resistor",
 "直列の抵抗2個": "Two resistors in series",
 "並列の抵抗2個": "Two resistors in parallel",
 "必要な抵抗値": "Desired resistance",
 "抵抗1だけが表示されます。": "Only Resistor 1 is shown.",
 "抵抗1と抵抗2を一本の斜面上に表示します。": "Resistors 1 and 2 appear on a single slope.",
 "抵抗1と抵抗3の並列図になり、抵抗2は消えます。": "Resistors 1 and 3 appear in parallel; Resistor 2 is hidden.",
 "抵抗1をOPENにすると、抵抗3と抵抗2の直列図になります。直列図では、0 Ωにした抵抗の記号・ラベル・水車が消え、導線として描かれます。": "Setting Resistor 1 to OPEN shows Resistors 3 and 2 in series. In series diagrams, the symbol, label, and water wheel of a zero-ohm resistor disappear, leaving a wire.",
 "この教材はMITライセンスで公開しています。改変・再配布・商用利用ができます。配布時は著作権表示とライセンス全文を含めてください。": "This project is released under the MIT License. Modification, redistribution, and commercial use are permitted. Include the copyright and full license text in distributed copies.",
 "MITライセンス全文": "Full MIT License",
 "GitHubでソースを見る": "View source on GitHub"
};
let englishMode = false;
const staticTranslations = [];
const translatableAttributes = [];
function translate(message) {
 if (!englishMode) return message;
 if (Object.hasOwn(englishText, message)) return englishText[message];
 for (const prefix of ['通信が途切れました：', '接続できません：']) {
  if (message.startsWith(prefix)) return englishText[prefix] + message.slice(prefix.length);
 }
 return message;
}
const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
 const node = walker.currentNode;
 if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) continue;
 const original = node.textContent;
 const trimmed = original.trim();
 if (Object.hasOwn(englishText, trimmed)) staticTranslations.push({node, original, trimmed});
}
for (const element of document.querySelectorAll('[aria-label]')) {
 const original = element.getAttribute('aria-label');
 if (Object.hasOwn(englishText, original)) translatableAttributes.push({element, original});
}
function applyLanguage() {
 englishMode = !document.getElementById('japaneseMode').checked;
 document.querySelector('.language-toggle').title = englishMode ? 'Check for Japanese. Unchecked: English.' : 'チェックありで日本語、なしで英語';
 document.documentElement.lang = englishMode ? 'en' : 'ja';
 for (const {node, original, trimmed} of staticTranslations) {
  node.textContent = englishMode ? original.replace(trimmed, englishText[trimmed]) : original;
 }
 for (const {element, original} of translatableAttributes) element.setAttribute('aria-label', translate(original));
 document.dispatchEvent(new Event('languagechange'));
}
document.getElementById('japaneseMode').addEventListener('change', applyLanguage);
function startInJapanese() {
 document.getElementById('japaneseMode').checked = true;
 applyLanguage();
}
document.addEventListener('DOMContentLoaded', startInJapanese, {once:true});
window.addEventListener('pageshow', startInJapanese);
