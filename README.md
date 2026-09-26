# Vizid Decor - Production Admin Dashboard

A dedicated, secure Admin Control Panel for **Vizid Decor**, built as a standalone frontend web application for deployment on `admin.viziddecors.com`.

---

## 📐 Architecture Overview

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS (Dark Slate & Gold Luxury Aesthetic)
- **Database & Auth**: Shared Supabase backend (`profiles`, `products`, `orders` tables & `product-images` storage bucket)
- **Routing**: React Router (`/login`, `/`, `/products`, `/orders`)
- **State & Real-time**: Custom React hooks + Supabase real-time subscriptions

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `admin` directory with the following variables:

```env
VITE_SUPABASE_URL=https://mdauahhfttledidxqtsl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 🚀 Running Locally

1. **Navigate to the `admin` directory**:
   ```bash
   cd admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Access the dashboard locally at `http://localhost:3001`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The production static bundle will be generated in `admin/dist`.

---

## 🔑 How to Create the First Admin User

All users authenticate via Supabase Auth. Access to the Admin Dashboard is strictly granted only if the user's corresponding row in the `profiles` table has `role = 'admin'`.

### Step 1: Sign up or Register the User Account
Have the admin user sign up via the website or create the user directly in **Supabase Dashboard -> Authentication -> Users**.

### Step 2: Elevate Account Role in Supabase SQL Editor
Open the **Supabase SQL Editor** and execute the following query:

```sql
-- Update an existing user profile to 'admin'
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

Or insert directly if a profile row does not exist yet:

```sql
INSERT INTO profiles (id, email, role)
VALUES (
  'USER_UUID_FROM_AUTH_USERS',
  'your-admin-email@example.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Multiple admins are supported by repeating this step for any email.

---

## 🌐 Deploying to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)

1. Connect your GitHub repository to Cloudflare Pages.
2. Select **Vite** framework preset.
3. Configure the build settings:
   - **Root directory**: `admin`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Add **Environment Variables** in Cloudflare Pages settings:
   - `VITE_SUPABASE_URL` = `https://mdauahhfttledidxqtsl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
5. Click **Save and Deploy**.
6. Under **Custom Domains**, add `admin.viziddecors.com`.

### Option B: Via Wrangler CLI

1. Build the static bundle:
   ```bash
   cd admin
   npm run build
   ```

2. Deploy using Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name=vizid-decor-admin
   ```

---

## 🗄️ Database & Storage Schema Reference

### `products` table
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `name` | `text` | Required |
| `category` | `text` | Required |
| `price` | `numeric` | Nullable |
| `description` | `text` | Nullable |
| `image_url` | `text` | Storage public URL |
| `created_by` | `uuid` | Foreign key to auth.users |
| `created_at` | `timestamp` | Default `now()` |

### `orders` table
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | Customer UUID |
| `items` | `jsonb` | Array of ordered items |
| `total_amount` | `numeric` | Total order price |
| `delivery_address` | `text` | Shipping location |
| `phone_number` | `text` | Customer phone |
| `status` | `text` | `pending`, `paid`, `shipped`, etc. |
| `paystack_reference` | `text` | Paystack transaction ref |
| `created_at` | `timestamp` | Default `now()` |

### `profiles` table
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `email` | `text` | Unique |
| `role` | `text` | `'customer'` or `'admin'` |
| `created_at` | `timestamp` | Default `now()` |

### Storage Bucket: `product-images`
- Bucket Name: `product-images`
- Permissions: Public read access, Admin write/delete access.
