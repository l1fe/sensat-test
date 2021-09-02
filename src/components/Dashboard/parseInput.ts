const parseInput = (str: string): Array<object> => {
  const parsed = str.split('\n').map((str) => {
    let json = {};
    try {
      json = JSON.parse(str);
    } catch (err) {
      json = {};
    }
    return json;
  });

  return parsed;
};

export default parseInput;
