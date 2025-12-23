const URL = 'http://localhost:5000';

async function run() {
    try {
        // 1. Register/Login
        console.log('1. Authenticating...');
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        let res = await fetch(`${URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password, role: 'manager' })
        });

        let data;
        const text = await res.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON');
            console.error('Status:', res.status);
            console.error('Text:', text);
            throw e;
        }
        if (!res.ok) {
            // If user already exists (rare due to timestamp), try login
            console.log('   Register failed (may exist), trying login...');
            res = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            data = await res.json();
            if (!res.ok) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
        }

        const token = data.token;
        if (!token) throw new Error('No token received');
        console.log('   Token received.');

        // 2. Create Team
        console.log('2. Creating Team...');
        res = await fetch(`${URL}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ name: 'Alpha Team' })
        });
        data = await res.json();
        if (!res.ok) {
            console.error('Create Team failed:', JSON.stringify(data));
            throw new Error(`Create Team failed: ${JSON.stringify(data)}`);
        }
        const teamId = data._id;
        console.log('   Team created:', teamId);

        // 3. Create Task
        console.log('3. Creating Task...');
        res = await fetch(`${URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                title: 'Fix Bug',
                description: 'Fix the login bug',
                status: 'todo',
                teamId: teamId
            })
        });
        data = await res.json();
        if (!res.ok) throw new Error(`Create Task failed: ${JSON.stringify(data)}`);
        const taskId = data._id;
        console.log('   Task created:', taskId);

        // 4. Get Tasks
        console.log('4. Fetching Tasks...');
        res = await fetch(`${URL}/tasks?teamId=${teamId}`, {
            headers: { 'x-auth-token': token }
        });
        data = await res.json();
        if (!data.find(t => t._id === taskId)) {
            throw new Error('Task not found in list');
        }
        console.log('   Task verified in list.');

        // 5. Update Task
        console.log('5. Updating Task...');
        res = await fetch(`${URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status: 'in-progress' })
        });
        data = await res.json();
        if (data.status !== 'in-progress') throw new Error('Task update failed');
        console.log('   Task updated to in-progress.');

        console.log('SUCCESS: All checks passed!');
    } catch (err) {
        console.error('FAILURE:', err.message);
        process.exit(1);
    }
}

run();
