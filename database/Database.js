import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL, category TEXT, dueDate INTEGER, isPaid INTEGER)',
      []
    );

    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY AUTOINCREMENT, paycheckAmount REAL)',
        []
      );
      
  });
};

export const getUserData = (onSuccess, onError) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM userData',
        [],
        (_, { rows }) => {
          const userData = rows.item(0);
          onSuccess(userData);
        },
        (_, error) => {
          onError(error);
        }
      );
    });
  };
  
  export const saveUserData = (userData, onSuccess, onError) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR REPLACE INTO userData (id, paycheckAmount) VALUES (?, ?)',
        [1, userData.paycheckAmount],
        (_, { insertId, rowsAffected }) => {
          if (insertId !== undefined && rowsAffected > 0) {
            onSuccess(insertId);
          } else {
            onError({ message: 'No rows were affected during the insert/replace.' });
          }
        },
        (_, error) => {
          onError(error);
        }
      );
    });
  };

export const getEntries = (onSuccess, onError) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM entries ORDER BY dueDate', [], (_, { rows }) => {
        const entries = rows._array;
        onSuccess(entries);
      }, (_, error) => {
        onError(error);
      });
    });
  };

  export const saveEntry = (entry, onSuccess, onError) => {
    const { id, title, amount, category, dueDate, isPaid } = entry;
  
    // Check if entryId is available (entry already exists)
    if (id) {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE entries SET title = ?, amount = ?, category = ?, dueDate = ?, isPaid = ? WHERE id = ?',
          [title, parseFloat(amount), category, dueDate, isPaid ? 1 : 0, id],
          (_, { rowsAffected }) => {
            // Check if any rows were affected (update successful)
            if (rowsAffected > 0) {
              onSuccess(id);
            } else {
              onError({ message: 'No rows were updated.' });
            }
          },
          (_, error) => {
            onError(error);
          }
        );
      });
    } else {
      // If entryId is not available, perform insert
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO entries (title, amount, category, dueDate, isPaid) VALUES (?, ?, ?, ?, ?)',
          [title, parseFloat(amount), category, dueDate, isPaid ? 1 : 0],
          (_, { insertId }) => {
            onSuccess(insertId);
          },
          (_, error) => {
            onError(error);
          }
        );
      });
    }
  };
  

export const deleteEntry = (entryId, onSuccess, onError) => {
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM entries WHERE id = ?', [entryId], (_, { rowsAffected }) => {
      if (rowsAffected > 0) {
        onSuccess();
      } else {
        onError('No entry found for deletion');
      }
    });
  });
};

initDatabase();
