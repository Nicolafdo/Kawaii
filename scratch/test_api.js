const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/trainings', {
    headers: {
      'Cookie': 'session=...' // I don't have the session cookie here easily
    }
  });
  // Instead of fetching, I'll just check the file content again.
}
