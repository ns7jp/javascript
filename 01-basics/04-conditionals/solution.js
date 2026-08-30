// 解答例: 条件分岐
//
// README.md の解説と合わせて読んでください。

/**
 * 点数に応じて評価("優"/"良"/"可"/"不可")を返す。
 * @param {number} score - 0〜100の点数
 * @returns {string} "優" | "良" | "可" | "不可"
 */
function classifyScore(score) {
  // なぜこの順番で書くのか:
  // if / else if は上から順に評価され、最初にtrueになった条件だけが実行される。
  // そのため、範囲が「広い条件」を先に書いてしまうと、
  // 本来「優」であるべき点数まで先に判定されてしまう可能性がある。
  // ここでは「一番厳しい条件(高い点数)」から先に判定することで、
  // 各条件が正しく独立した範囲を表すようにしている。
  if (score >= 90) {
    return "優";
  } else if (score >= 70) {
    return "良";
  } else if (score >= 50) {
    return "可";
  } else {
    return "不可";
  }
}

/**
 * 曜日番号(0=日曜日〜6=土曜日)から曜日名を返す。
 * @param {number} dayNumber - 0〜6の整数
 * @returns {string} 曜日名(日本語)。範囲外なら"不正な曜日番号です"
 */
function judgeWithSwitch(dayNumber) {
  let dayName;

  switch (dayNumber) {
    case 0:
      dayName = "日曜日";
      break;
    case 1:
      dayName = "月曜日";
      break;
    case 2:
      dayName = "火曜日";
      break;
    case 3:
      dayName = "水曜日";
      break;
    case 4:
      dayName = "木曜日";
      break;
    case 5:
      dayName = "金曜日";
      break;
    case 6:
      dayName = "土曜日";
      break;
    default:
      // なぜdefaultが必要なのか:
      // 0〜6以外の値(例: 7や-1、文字列など)が渡された場合に備えて、
      // どのcaseにも一致しなかったときの処理を必ず用意しておく。
      // これがないと dayName が undefined のまま返ってしまい、
      // 呼び出し側が原因を追跡しづらいバグになる。
      dayName = "不正な曜日番号です";
  }

  // 各caseの末尾にbreakを書いているのは、
  // 一致したcaseの処理が終わったら次のcaseに処理が
  // そのまま流れ落ちてしまう「フォールスルー」を防ぐため。
  return dayName;
}

module.exports = { classifyScore, judgeWithSwitch };
