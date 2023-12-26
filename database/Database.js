import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('mydb.db')

const initDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL, category TEXT, dueDate INTEGER, isPaid INTEGER)',
            [],
        )

        tx.executeSql('CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY AUTOINCREMENT, paycheckAmount REAL)', [])

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS loanData (id INTEGER PRIMARY KEY AUTOINCREMENT, loanTitle TEXT, monthlyPayment REAL, loanAmount REAL, remainingAmount REAL, APR REAL)',
            [],
        )

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS creditCardData (id INTEGER PRIMARY KEY AUTOINCREMENT, cardTitle TEXT, cardBalance REAL, `limit` REAL, monthlyPayment REAL, APR REAL)',
            [],
        )
    })
    console.log('Database initialization complete.')
}

export const getAllTables = (onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table';",
            [],
            (_, { rows }) => {
                const tableNames = rows._array.map((item) => item.name)
                onSuccess(tableNames)
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const getUserData = (onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM userData',
            [],
            (_, { rows }) => {
                const userData = rows.item(0)
                onSuccess(userData)
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const saveUserData = (userData, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            'INSERT OR REPLACE INTO userData (id, paycheckAmount) VALUES (?, ?)',
            [1, userData.paycheckAmount],
            (_, { insertId, rowsAffected }) => {
                if (insertId !== undefined && rowsAffected > 0) {
                    onSuccess(insertId)
                } else {
                    onError({ message: 'No rows were affected during the insert/replace.' })
                }
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const getEntries = (onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM entries ORDER BY dueDate',
            [],
            (_, { rows }) => {
                const entries = rows._array
                onSuccess(entries)
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const saveEntry = (entry, onSuccess, onError) => {
    const { id, title, amount, category, dueDate, isPaid } = entry

    // Check if entryId is available (entry already exists)
    if (id) {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE entries SET title = ?, amount = ?, category = ?, dueDate = ?, isPaid = ? WHERE id = ?',
                [title, parseFloat(amount), category, dueDate, isPaid ? 1 : 0, id],
                (_, { rowsAffected }) => {
                    // Check if any rows were affected (update successful)
                    if (rowsAffected > 0) {
                        onSuccess(id)
                    } else {
                        onError({ message: 'No rows were updated.' })
                    }
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    } else {
        // If entryId is not available, perform insert
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO entries (title, amount, category, dueDate, isPaid) VALUES (?, ?, ?, ?, ?)',
                [title, parseFloat(amount), category, dueDate, isPaid ? 1 : 0],
                (_, { insertId }) => {
                    onSuccess(insertId)
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    }
}

export const deleteEntry = (entryId, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM entries WHERE id = ?', [entryId], (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
                onSuccess()
            } else {
                onError('No entry found for deletion')
            }
        })
    })
}

export const saveLoanEntry = (loanEntry, onSuccess, onError) => {
    const { id, loanTitle, monthlyPayment, loanAmount, remainingAmount, APR } = loanEntry

    // Check if entryId is available (entry already exists)
    if (id) {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE loanData SET loanTitle = ?, monthlyPayment = ?, loanAmount = ?, remainingAmount = ?, APR = ? WHERE id = ?',
                [loanTitle, parseFloat(monthlyPayment), parseFloat(loanAmount), parseFloat(remainingAmount), parseFloat(APR), id],
                (_, { rowsAffected }) => {
                    // Check if any rows were affected (update successful)
                    if (rowsAffected > 0) {
                        onSuccess(id)
                    } else {
                        onError({ message: 'No rows were updated.' })
                    }
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    } else {
        // If entryId is not available, perform insert
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO loanData (loanTitle, monthlyPayment, loanAmount, remainingAmount, APR) VALUES (?, ?, ?, ?, ?)',
                [loanTitle, parseFloat(monthlyPayment), parseFloat(loanAmount), parseFloat(remainingAmount), parseFloat(APR)],
                (_, { insertId }) => {
                    onSuccess(insertId)
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    }
}

export const getLoanEntries = (onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM loanData ORDER BY loanAmount',
            [],
            (_, { rows }) => {
                const entries = rows._array
                onSuccess(entries)
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const deleteLoanEntry = (entryId, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM loanData WHERE id = ?', [entryId], (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
                onSuccess()
            } else {
                onError('No entry found for deletion')
            }
        })
    })
}

export const saveCardEntry = (cardEntry, onSuccess, onError) => {
    const { id, cardTitle, cardBalance, limit, monthlyPayment, APR } = cardEntry

    // Check if entryId is available (entry already exists)
    if (id) {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE creditCardData SET cardTitle = ?, cardBalance = ?, `limit` = ?, monthlyPayment = ?, APR = ? WHERE id = ?',
                [cardTitle, parseFloat(cardBalance), parseFloat(limit), parseFloat(monthlyPayment), parseFloat(APR), id],
                (_, { rowsAffected }) => {
                    // Check if any rows were affected (update successful)
                    if (rowsAffected > 0) {
                        onSuccess(id)
                    } else {
                        onError({ message: 'No rows were updated.' })
                    }
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    } else {
        // If entryId is not available, perform insert
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO creditCardData (cardTitle, cardBalance, `limit`, monthlyPayment, APR) VALUES (?, ?, ?, ?, ?)',
                [cardTitle, parseFloat(cardBalance), parseFloat(limit), parseFloat(monthlyPayment), parseFloat(APR)],
                (_, { insertId }) => {
                    onSuccess(insertId)
                },
                (_, error) => {
                    onError(error)
                },
            )
        })
    }
}

export const getCardEntries = (onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM creditCardData ORDER BY cardBalance',
            [],
            (_, { rows }) => {
                const entries = rows._array
                onSuccess(entries)
            },
            (_, error) => {
                onError(error)
            },
        )
    })
}

export const deleteCardEntry = (entryId, onSuccess, onError) => {
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM creditCardData WHERE id = ?', [entryId], (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
                onSuccess()
            } else {
                onError('No entry found for deletion')
            }
        })
    })
}

initDatabase()
