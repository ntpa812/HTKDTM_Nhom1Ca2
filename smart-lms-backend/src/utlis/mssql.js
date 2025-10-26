const { poolPromise, sql } = require('../config/database');

class MSSQLHelper {
    /**
     * Execute SELECT query
     */
    static async executeQuery(query, params = []) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            // Bind parameters
            params.forEach(param => {
                request.input(param.name, param.type, param.value);
            });

            const result = await request.query(query);
            return result.recordset;
        } catch (err) {
            console.error('Query Error:', err);
            throw err;
        }
    }

    /**
     * Execute stored procedure
     */
    static async executeProc(procName, params = []) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            params.forEach(param => {
                request.input(param.name, param.type, param.value);
            });

            const result = await request.execute(procName);
            return result.recordset;
        } catch (err) {
            console.error('Procedure Error:', err);
            throw err;
        }
    }

    /**
     * Insert data with auto-generated ID return
     */
    static async insert(table, data) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const columns = Object.keys(data);
            const values = columns.map(col => `@${col}`).join(', ');

            columns.forEach(col => {
                request.input(col, data[col]);
            });

            const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        OUTPUT INSERTED.id
        VALUES (${values})
      `;

            const result = await request.query(query);
            return result.recordset[0];
        } catch (err) {
            console.error('Insert Error:', err);
            throw err;
        }
    }

    /**
     * Update data
     */
    static async update(table, id, data) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const setClause = Object.keys(data)
                .map(col => `${col} = @${col}`)
                .join(', ');

            Object.keys(data).forEach(col => {
                request.input(col, data[col]);
            });
            request.input('id', sql.Int, id);

            const query = `UPDATE ${table} SET ${setClause} WHERE id = @id`;
            const result = await request.query(query);

            return result.rowsAffected[0];
        } catch (err) {
            console.error('Update Error:', err);
            throw err;
        }
    }

    /**
     * Delete data
     */
    static async delete(table, id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`DELETE FROM ${table} WHERE id = @id`);

            return result.rowsAffected[0];
        } catch (err) {
            console.error('Delete Error:', err);
            throw err;
        }
    }

    /**
     * Transaction wrapper
     */
    static async transaction(callback) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (err) {
            await transaction.rollback();
            console.error('Transaction Error:', err);
            throw err;
        }
    }

    /**
     * Check if record exists
     */
    static async exists(table, field, value) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('value', value)
                .query(`SELECT COUNT(*) as count FROM ${table} WHERE ${field} = @value`);

            return result.recordset[0].count > 0;
        } catch (err) {
            console.error('Exists Check Error:', err);
            throw err;
        }
    }
}

module.exports = MSSQLHelper;
