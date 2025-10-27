const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

// Helper to run a command in a working directory with timeout
const runCommand = (cmd, options = {}) => new Promise((resolve) => {
  exec(cmd, options, (error, stdout, stderr) => {
    if (error) {
      return resolve({ success: false, stdout: stdout || '', stderr: stderr || error.message });
    }
    resolve({ success: true, stdout: stdout || '', stderr: stderr || '' });
  });
});

// POST /api/code/execute
// body: { language: 'python'|'java'|'cpp', code: '...' }
router.post('/execute', async (req, res) => {
  const { language, code } = req.body || {};

  if (!language || !code) {
    return res.status(400).json({ message: 'language and code are required' });
  }

  // create temp working dir
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bytecode-'));
  const options = { cwd: tmpDir, timeout: 5000, maxBuffer: 200 * 1024 }; // 5s timeout

  try {
    if (language === 'python') {
      const file = path.join(tmpDir, 'script.py');
      fs.writeFileSync(file, code);

  const result = await runCommand('python3 script.py', options);
  const output = `${result.stdout || ''}${result.stderr ? '\n' + result.stderr : ''}`.trim();
  return res.json({ language, success: !!result.success, output, stdout: result.stdout, stderr: result.stderr });
    }

    if (language === 'java') {
      // write to Main.java and expect class Main with main()
      const file = path.join(tmpDir, 'Main.java');
      fs.writeFileSync(file, code);

      // compile
      const compile = await runCommand('javac Main.java', options);
      if (!compile.success) {
        const output = `${compile.stdout || ''}${compile.stderr ? '\n' + compile.stderr : ''}`.trim();
        return res.json({ language, success: false, output, stdout: compile.stdout, stderr: compile.stderr });
      }

      // run
      const run = await runCommand('java -cp . Main', options);
      const output = `${run.stdout || ''}${run.stderr ? '\n' + run.stderr : ''}`.trim();
      return res.json({ language, success: !!run.success, output, stdout: run.stdout, stderr: run.stderr });
    }

    if (language === 'cpp' || language === 'c++') {
      const file = path.join(tmpDir, 'main.cpp');
      fs.writeFileSync(file, code);

      const compile = await runCommand('g++ -std=c++17 -O2 -o main main.cpp', options);
      if (!compile.success) {
        const output = `${compile.stdout || ''}${compile.stderr ? '\n' + compile.stderr : ''}`.trim();
        return res.json({ language, success: false, output, stdout: compile.stdout, stderr: compile.stderr });
      }

      const run = await runCommand('./main', options);
      const output = `${run.stdout || ''}${run.stderr ? '\n' + run.stderr : ''}`.trim();
      return res.json({ language, success: !!run.success, output, stdout: run.stdout, stderr: run.stderr });
    }

    return res.status(400).json({ message: 'Unsupported language' });
  } catch (err) {
    return res.status(500).json({ message: 'Execution error', error: err.message });
  } finally {
    // cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }
});

module.exports = router;
