// utils/stringUtils.js
export const replaceSpecialCharacters = (name) => {
    const characterMap = [
      { from: /�/g, to: "\uFFFD" },
      { from: /\?/g, to: "\u203D" },
    ];
  
    return characterMap.reduce(
      (processedName, { from, to }) => processedName.replace(from, to),
      name
    );
  };
  