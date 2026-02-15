import { useEffect, useState } from "react";

function getSavedValue(key, ini) {
  let value = JSON.parse(localStorage.getItem(key));

  if (value) return value;

  return ini;
}

export default function UseLocalStorage(key, ini) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, ini);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
