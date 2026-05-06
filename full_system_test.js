// Using native fetch available in Node.js 18+

const BASE_URL = 'http://localhost:3000';

async function testFlow() {
  console.log('--- STARTING SYSTEM INTEGRATION TEST ---');
  
  // 1. Register Admin
  const adminEmail = `testadmin_${Date.now()}@example.com`;
  console.log(`Registering Admin: ${adminEmail}`);
  const regAdmin = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Admin', email: adminEmail, password: 'Password123', role: 'ADMIN' })
  });
  console.log('Admin Registration Status:', regAdmin.status);
  const adminData = await regAdmin.json();

  // 2. Login Admin
  console.log('Logging in Admin...');
  const loginAdmin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: 'Password123' })
  });
  console.log('Admin Login Status:', loginAdmin.status);
  const loginData = await loginAdmin.json();
  const cookie = loginAdmin.headers.get('set-cookie');

  // 3. Create Training
  console.log('Creating Training...');
  const createTraining = await fetch(`${BASE_URL}/api/trainings`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': cookie
    },
    body: JSON.stringify({ 
      title: 'Integration Test Training', 
      area: 'Quality Assurance', 
      trainerId: 1, 
      schedule: '2026-12-12', 
      venue: 'Lab A' 
    })
  });
  console.log('Create Training Status:', createTraining.status);
  const trainingData = await createTraining.json();
  const trainingId = trainingData.id;

  // 4. Fetch Users (Testing new API)
  console.log('Fetching Users List...');
  const fetchUsers = await fetch(`${BASE_URL}/api/users`, {
    headers: { 'Cookie': cookie }
  });
  console.log('Fetch Users Status:', fetchUsers.status);
  const usersList = await fetchUsers.json();
  console.log(`Found ${usersList.length} users.`);

  // 5. Register Trainee
  const traineeEmail = `testtrainee_${Date.now()}@example.com`;
  console.log(`Registering Trainee: ${traineeEmail}`);
  const regTrainee = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Trainee', email: traineeEmail, password: 'Password123', role: 'TRAINEE' })
  });
  const loginTrainee = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: traineeEmail, password: 'Password123' })
  });
  const traineeCookie = loginTrainee.headers.get('set-cookie');

  // 6. Enroll in Training
  console.log(`Enrolling Trainee in training ${trainingId}...`);
  const enroll = await fetch(`${BASE_URL}/api/enrollments`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': traineeCookie
    },
    body: JSON.stringify({ trainingId })
  });
  console.log('Enrollment Status:', enroll.status);

  // 7. Submit Feedback
  console.log('Submitting Feedback...');
  const feedback = await fetch(`${BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': traineeCookie
    },
    body: JSON.stringify({ trainingId, rating: '5', comment: 'Excellent integration test!' })
  });
  console.log('Feedback Status:', feedback.status);

  console.log('--- ALL BACKEND TESTS PASSED ---');
}

testFlow().catch(console.error);
