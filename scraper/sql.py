import sqlite3

conn = sqlite3.connect("example.db")
cursor = conn.cursor()

cursor.execute(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, age INTEGER)")
cursor.execute("INSERT INTO users VALUES (?, ?, ?)", (1, "Alice", 30))

cursor.execute("SELECT id, name FROM users WHERE age > ?", (18,))
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.commit()
conn.close()
