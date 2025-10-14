import React from "react";
import { Typewriter } from "react-simple-typewriter";

const CodeSidebar = () => {
  const code = `
<!DOCTYPE html>
<html>
<head><title>Example</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1><a href="/">Header</a></h1>
<nav>
  <a href="one/">One</a>
  <a href="two/">Two</a>
  <a href="three/">Three</a>
</nav>
</body>
</html>`;

  return (
    <div className="bg-[#1e1e1e] text-[#f8f8f2] rounded-lg p-4 shadow-lg font-mono text-xs leading-relaxed w-[320px] h-[90vh] overflow-hidden border border-[#2e2e2e]">
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#333]">
        <pre className="whitespace-pre-wrap text-[#f8f8f2]">
          <Typewriter
            words={[code]}
            cursor
            cursorStyle="|"
            typeSpeed={25}
            deleteSpeed={0}
            delaySpeed={1000}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeSidebar;
