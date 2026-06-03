# Free eCommerce Template for Next.js - NextMerce

The free Next.js eCommerce template is a lite version of the NextMerce Next.js eCommerce boilerplate, designed to streamline the launch and management of your online store.

![NextMerce](https://github.com/user-attachments/assets/57155689-a756-4222-8af7-134e556acae2)


While NextMerce Pro features advanced functionalities, seamless integration, and customizable options, providing all the essential tools needed to build and expand your business, the lite version offers a basic Next.js template specifically crafted for eCommerce websites. Both versions ensure superior performance and flexibility, all powered by Next.js.

### NextMerce Free VS NextMerce Pro

| ✨ Features                         | 🎁 NextMerce Free                 | 🔥 NextMerce Pro                        |
|----------------------------------|--------------------------------|--------------------------------------|
| Next.js Pages                    | Static                         | Dynamic Boilerplate Template         |
| Components                       | Limited                        | All According to Demo                |
| eCommerce Functionality          | Included                       | Included                             |
| Integrations (DB, Auth, etc.)    | Not Included                   | Included                             |
| Community Support                | Included                       | Included                             |
| Premium Email Support            | Not Included                   | Included                             |
| Lifetime Free Updates            | Included                       | Included                             |


#### [🚀 Live Demo](https://demo.nextmerce.com/)

#### [🌐 Visit Website](https://nextmerce.com/)

## Update Logs

Version 0.1.2 - [Mar 16, 2026]
- Update Next.js, React, and React DOM dependencies, add baseline-browser-mapping

## Backend Login Test

Use this request to verify the Django SimpleJWT login endpoint:

```bash
curl -X POST https://ecommerce.schoolsoft.online/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_PASSWORD"}'
```

Expected success:

```json
{
  "refresh": "...",
  "access": "..."
}
```

Expected failure:

```json
{
  "detail": "No active account found with the given credentials"
}
```

## API Troubleshooting

Backend local test:

```bash
cd ecommerce_project
source venv/bin/activate
python manage.py check
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

CORS preflight test:

```bash
curl -i -X OPTIONS http://127.0.0.1:8000/api/auth/token/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,authorization"
```

Expected header:

```text
access-control-allow-origin: http://localhost:3000
```

Token test:

```bash
curl -i -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_PASSWORD"}'
```

Frontend local test:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Production build reminder: `NEXT_PUBLIC_*` variables are baked into the client bundle during `next build`, so set `NEXT_PUBLIC_API_BASE_URL` before building:

```bash
NEXT_PUBLIC_API_BASE_URL=https://ecommerce.schoolsoft.online/api npm run build
```
