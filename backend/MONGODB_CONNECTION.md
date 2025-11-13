# MongoDB Atlas Connection String

## Your Connection String Format

Your connection string from MongoDB Atlas needs to be formatted correctly for the `.env` file.

### Important Notes:
1. **Password with `@` symbol**: If your password contains `@`, it must be URL-encoded as `%40`
2. **Database name**: Add the database name to the connection string
3. **Connection options**: Add retry options for better reliability

## Steps to Update:

1. Open `backend/.env` file
2. Update the `MONGO_URI` line with the corrected connection string above
3. Make sure `DB_NAME=portfolio_db` is set
4. Save the file
5. Restart your backend server

## URL Encoding Reference:

If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

## Test Connection:

After updating, restart your backend:
```powershell
cd backend
python app.py
```

You should see: `✓ MongoDB connected successfully`

