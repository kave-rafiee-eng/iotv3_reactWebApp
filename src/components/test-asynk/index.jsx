import { useState } from "react";

export default function LongClickButton() {
  const [status, setStatus] = useState("آماده");
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    setStatus("در حال پردازش ..."); // ← UI فوراً تغییر می‌کنه
    setProgress(0);

    for (let i = 1; i <= 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // شبیه‌سازی ۵ ثانیه

      setProgress(i); // ← هر بار UI آپدیت می‌شه
      // یا اگر خواستی کمتر re-render کنی:
      // if (i % 10 === 0) setProgress(i);
    }

    setStatus("تمام شد ✓");
  };

  return (
    <div>
      <button onClick={handleClick} disabled={status !== "آماده"}>
        شروع عملیات طولانی
      </button>

      <p>وضعیت: {status}</p>
      <progress value={progress} max={100} style={{ width: "300px" }} />
      <p>{progress}%</p>
    </div>
  );
}
