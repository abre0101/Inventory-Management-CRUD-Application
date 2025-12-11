# Enable Supabase Realtime

To enable real-time updates, you need to configure Supabase:

## Steps:

1. Go to your Supabase Dashboard
2. Click on **Database** in the left sidebar
3. Click on **Replication** (or **Publications**)
4. Find the `supabase_realtime` publication
5. Click on it and make sure the **inventory** table is checked/enabled
6. If not visible, create a new publication:
   - Click "Create Publication"
   - Name it `supabase_realtime`
   - Select the `inventory` table
   - Enable all events: INSERT, UPDATE, DELETE

## Alternative: Run this SQL

Go to **SQL Editor** and run:

```sql
-- Enable realtime for inventory table
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
```

## Test It:

1. Open your app in two browser windows
2. Add/edit/delete an item in one window
3. Watch it update automatically in the other window!

## How It Works:

- Supabase uses PostgreSQL's built-in replication feature
- Changes are broadcast via WebSocket to all connected clients
- Your app subscribes to the `inventory` table changes
- When any change occurs (INSERT, UPDATE, DELETE), all clients refresh automatically
