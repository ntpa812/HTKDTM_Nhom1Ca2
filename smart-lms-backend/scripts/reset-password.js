const { poolPromise } = require('../config/database');
const bcrypt = require('bcryptjs');

async function resetTestPasswords() {
    try {
        const pool = await poolPromise;

        // Hash passwords
        const password123Hash = await bcrypt.hash('password123', 10);
        const admin123Hash = await bcrypt.hash('admin123', 10);

        // Update student01
        await pool.request()
            .input('email', 'student01@test.com')
            .input('password', password123Hash)
            .query('UPDATE Users SET password = @password WHERE email = @email');

        // Update instructor1
        await pool.request()
            .input('email', 'instructor1@smartlms.com')
            .input('password', password123Hash)
            .query('UPDATE Users SET password = @password WHERE email = @email');

        // Update admin
        await pool.request()
            .input('email', 'admin@smartlms.com')
            .input('password', admin123Hash)
            .query('UPDATE Users SET password = @password WHERE email = @email');

        console.log('✅ Test passwords updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating passwords:', error);
        process.exit(1);
    }
}

resetTestPasswords();
