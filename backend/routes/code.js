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
// body: { language: 'python'|'java'|'cpp'|'c', code: '...' }
router.post('/execute', async (req, res) => {
  const { language, code } = req.body || {};

  if (!language || !code) {
    return res.status(400).json({ message: 'language and code are required' });
  }

  // create temp working dir
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bytecode-'));
  const options = { cwd: tmpDir, timeout: 10000, maxBuffer: 200 * 1024 }; // 10s timeout

  try {
    // C Language Support
    if (language === 'c') {
      const file = path.join(tmpDir, 'main.c');
      fs.writeFileSync(file, code);

      // Compile C code
      const compile = await runCommand('gcc -std=c17 -O2 -o main main.c', options);
      if (!compile.success) {
        const output = `${compile.stdout || ''}${compile.stderr ? '\n' + compile.stderr : ''}`.trim();
        return res.json({ language, success: false, output, stdout: compile.stdout, stderr: compile.stderr });
      }

      // Run compiled executable
      const run = await runCommand('./main', options);
      const output = `${run.stdout || ''}${run.stderr ? '\n' + run.stderr : ''}`.trim();
      return res.json({ language, success: !!run.success, output, stdout: run.stdout, stderr: run.stderr });
    }

    // C++ Language Support
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

    // Python Language Support
    if (language === 'python') {
      const file = path.join(tmpDir, 'script.py');
      fs.writeFileSync(file, code);

      const result = await runCommand('python3 script.py', options);
      const output = `${result.stdout || ''}${result.stderr ? '\n' + result.stderr : ''}`.trim();
      return res.json({ language, success: !!result.success, output, stdout: result.stdout, stderr: result.stderr });
    }

    // Java Language Support
    if (language === 'java') {
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

// Health check endpoint to verify compilers are installed
// Health check endpoint
router.get('/health', async (req, res) => {
  const compilers = {
    'C Compiler (gcc)': 'gcc --version',
    'C++ Compiler (g++)': 'g++ --version', 
    'Python (python3)': 'python3 --version',
    'Java Compiler (javac)': 'javac -version'
  };

  const results = {};
  let allAvailable = true;

  for (const [name, command] of Object.entries(compilers)) {
    try {
      const result = await runCommand(command);
      results[name] = result.success ? 'Available' : 'Not Available';
      if (!result.success) allAvailable = false;
      
      if (result.stdout) {
        results[`${name}_version`] = result.stdout.split('\n')[0];
      }
    } catch (error) {
      results[name] = 'Not Available';
      allAvailable = false;
    }
  }

  res.json({
    status: allAvailable ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    compilers: results,
    message: allAvailable ? 
      'All compilers are available' : 
      'Some compilers are missing. Check server setup.'
  });
});

module.exports = router;