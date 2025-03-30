import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Fetch all reported links
cursor.execute("SELECT * FROM reported_links")
rows = cursor.fetchall()

# Print the data
if rows:
    print("\nReported Links Data:")
    print("--------------------------------------------------")
    for row in rows:
        print(f"ID: {row[0]}, Link: {row[1]}, Timestamp: {row[2]}, Username: {row[3]}, IP: {row[4]}")
else:
    print("No reported links found in the database.")

# Close the database connection
conn.close()
