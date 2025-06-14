export const generateHint = (word = "") => {
  if (!word) return "";

  const chars = word.split("");
  const length = chars.length;

  // Chỉ tính chữ cái (a-z hoặc A-Z)
  const isLetter = (char:string) => /^[a-zA-Z]$/.test(char);

  // Gợi ý ban đầu: dấu "_" cho chữ cái, giữ nguyên các ký tự khác
  let hintArray = chars.map((ch) => {
    if (ch === " ") return " ";
    return isLetter(ch) ? "_" : ch;
  });

  // Lọc ra chỉ những vị trí có chữ cái (để chọn vị trí cần reveal)
  const letterIndices = chars
    .map((ch, idx) => (isLetter(ch) ? idx : null))
    .filter((i) => i !== null);

  // Tính số chữ cái để từ đó xác định số lượng cần reveal
  const letterCount = letterIndices.length;

  let revealCount = 0;
  if (letterCount <= 4) {
    revealCount = 0;
  } else if (letterCount <= 10) {
    revealCount = 2;
  } else {
    revealCount = letterCount - 5;
  }

  // Lấy ngẫu nhiên revealCount vị trí trong số các chữ cái
  const shuffled = letterIndices.sort(() => 0.5 - Math.random());
  const revealIndices = new Set(shuffled.slice(0, revealCount));

  // Áp dụng gợi ý vào hintArray
  for (let i of revealIndices) {
    hintArray[i] = chars[i].toUpperCase();
  }

  return hintArray.join(" ");
};
