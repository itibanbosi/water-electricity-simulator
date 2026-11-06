# 高さでわかる 電圧と電流 / Water & Electricity Simulator

水流と電気回路を並べて、電圧・電流・抵抗・発熱の関係を操作しながら学べる教材です。画面だけで使えます。ESP32の対応ファームウェアを使用すると、実機の可変抵抗・OLED・NeoPixelともUSBシリアルで連動します。

**アプリを開く → https://itibanbosi.github.io/water-electricity-simulator/**

## 使い方

「回路の種類」で「抵抗1個」「直列抵抗2個」「並列抵抗2個」「直列＋並列」から1つ選び、電源電圧と使用する抵抗値を変更します。不要な抵抗は自動的にOPEN／0 Ωに設定され、操作できなくなります。使う抵抗値は正の値から選びます。USB接続中は実機の条件が優先され、回路選択は受信値に合わせて表示されます。「日本語／English」のチェックを入れると日本語、外すと英語です。起動直後は日本語です。

回路の基本構成は **（抵抗1 ∥ 抵抗3）＋ 抵抗2** です。抵抗3は並列の追加枝、抵抗2は合流後の直列部分です。

| 表示したい回路 | 抵抗1 | 抵抗3（並列の枝） | 抵抗2（合流後） |
| --- | --- | --- | --- |
| 抵抗1個 | 必要な値 | OPEN | 0 Ω |
| 抵抗2個の直列 | 必要な値 | OPEN | 必要な値 |
| 抵抗2個の並列 | 必要な値 | 必要な値 | 0 Ω |
| 並列＋直列 | 必要な値 | 必要な値 | 必要な値 |

- **抵抗1個**では、並列の抵抗3をOPEN、直列の抵抗2を0 Ωにすると、抵抗1だけの図になります。
- **直列の抵抗2個**では、並列の抵抗3をOPENにすると、抵抗1・2が一本の斜面上に並びます。
- **並列の抵抗2個**では、直列の抵抗2を0 Ωにすると、抵抗1・3が並列に並び、抵抗2の記号が消えます。
- 抵抗1をOPENにすると、抵抗3・2の直列図になります。
- 直列図では0 Ωの抵抗は記号・ラベル・水車が消え、導線として表示されます。

OPENは導通なし、0 Ωは導線を表します。電源を短絡する理想回路ではSHORT、理想的な0 Ωの枝どうしへの電流分配などが決まらない場合は「—」を表示します。

## 図の見方

- 高さは0 Vを基準とした電位を表し、水側では高さ（水圧）として示します。
- 点の流れは電流または流量に対応します。
- 水車の回転は各抵抗が受け取る電力に対応します。
- 電気回路の抵抗の色は灰色からオレンジ、白みのあるオレンジへ変わります。
- 図中のW表示は「発熱量（W）を表示」で切り替えられます。Wは1秒あたりの発熱量、すなわち電力です。
- 並列部を合わせた抵抗値と、回路全体の抵抗値をそれぞれ表示します。

図の上下はエネルギーの違いを表す模式表現です。枝の重なりを避けるために位置をずらす場合があります。水車は抵抗の電力を発電機に置き換えた模型です。

## ESP32とのUSB連動

1. 対応ファームウェアを書き込んだESP32をUSBデータケーブルで接続します。
2. Arduino IDEのシリアルモニター・プロッターを閉じます。
3. PC版ChromeまたはEdgeでこのHTTPSページを開きます。
4. 「ESP32に接続」を押し、ESP32のシリアルポートを選択します。
5. 接続中は実機の操作が画面へ反映されます。切断後は最後の値を引き継ぎ、画面で操作できます。

画面は115200 baudで1行ごとのJSONを受信します。通信は利用者のPCとESP32の間で行います。ESP32用ファームウェアはこのWebアプリの公開ファイルには含めていません。

## ローカルで使う

このリポジトリをダウンロードし、フォルダ内で `python -m http.server 8766 --bind 127.0.0.1` を実行して、http://localhost:8766/ を開きます。

## English

An interactive teaching model of voltage, current, resistance, and heating power, shown as water flow alongside an electric circuit. It works on screen and can receive USB serial data from an ESP32 running compatible firmware.

Uncheck the **日本語 / English** checkbox for English. Japanese is selected at startup.

Choose **One resistor**, **Two in series**, **Two in parallel**, or **Series + parallel**. Unused resistors are automatically set to OPEN or 0 Ω. Adjust the active resistors using positive resistance values. While USB is connected, the circuit selection follows the device. The circuit is **(R1 ∥ R3) + R2**.

| Circuit | R1 | R3 (parallel branch) | R2 (after merge) |
| --- | --- | --- | --- |
| One resistor | Desired resistance | OPEN | 0 Ω |
| Two in series | Desired resistance | OPEN | Desired resistance |
| Two in parallel | Desired resistance | Desired resistance | 0 Ω |
| Parallel plus series | Desired resistance | Desired resistance | Desired resistance |

Setting R3 to OPEN hides its branch. In series diagrams, zero-ohm resistors are drawn as wires, with their symbols and labels hidden. Setting R2 to 0 Ω shows the two parallel branches and hides R2. Setting R1 to OPEN similarly shows R3 and R2 in series.

For USB, use desktop Chrome or Edge over HTTPS, close the Arduino Serial Monitor, and click **Connect ESP32**. The protocol is newline-delimited JSON at 115200 baud. The ESP32 firmware is distributed separately.

## License

MIT License — Copyright (c) 2026 itibanbosi.

改変・再配布・商用利用ができます。配布時は著作権表示とMITライセンス全文を含めてください。詳細は [LICENSE](LICENSE) を参照してください。
