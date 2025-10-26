const bcrypt = require('bcryptjs');

async function generatePassword() {
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n--- SQL Script ---');
    console.log(`UPDATE Users SET password = '${hash}' WHERE email = 'student01@test.com';`);
}

generatePassword();
