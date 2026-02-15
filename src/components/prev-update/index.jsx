import { useState } from "react";

function PrevUpdate() {
  const [count, setCount] = useState(0);

  const handleIncrementWrong = () => {
    // این روش اشتباهه وقتی چند بار پشت سر هم صدا زده بشه
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // نتیجه: فقط +۱ می‌شه، نه +۳ ! (چون همه از count قدیمی استفاده می‌کنن)
  };

  const handleIncrementCorrect = () => {
    // شکل درست با functional update
    setCount((prev) => prev + 1); // prev همیشه آخرین مقدار معتبره
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    // نتیجه: دقیقاً +۳ می‌شه، حتی اگر React batch کنه
  };

  return (
    <div style={{ fontSize: "1.4rem", margin: "2rem" }}>
      <h2>شمارنده: {count}</h2>

      <button
        onClick={handleIncrementWrong}
        style={{ marginRight: "1rem", padding: "8px 16px" }}
      >
        +۳ (روش اشتباه)
      </button>

      <button onClick={handleIncrementCorrect} style={{ padding: "8px 16px" }}>
        +۳ (روش درست ✓)
      </button>
    </div>
  );
}

export default PrevUpdate;
