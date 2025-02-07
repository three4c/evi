import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e.key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <div>🦐</div>;
};

export default App;
