# Supabase Sync Setup

1. Entra en `Supabase > SQL Editor` y ejecuta el contenido de `supabase-sync-setup.sql`.
2. Ve a `Auth > Providers > Email` y deja activado el acceso por email.
3. Ve a `Auth > URL Configuration` y pon como `Site URL` tu web publicada:
   `https://seniorplaza.github.io/seniorplazapp/`
4. Ve a `Auth > Email Templates` y cambia la plantilla de acceso por email para usar OTP.

Plantilla minima recomendada:

```html
<h2>Codigo de acceso</h2>
<p>Introduce este codigo en seniorplazapp:</p>
<p style="font-size:32px;font-weight:700;letter-spacing:0.18em;">{{ .Token }}</p>
```

5. La primera vez que abras la app o la web, pide el codigo OTP con tu email y entra.
6. No pongas nunca la `secret key` ni la cadena directa de PostgreSQL dentro de `www/` ni en GitHub Pages.

Notas:

- La app usa la `publishable key` en cliente y guarda los binarios en el bucket privado `app-assets`.
- El estado principal se sincroniza en la tabla `public.user_snapshots`.
- La estrategia actual de conflictos es `ultima edicion gana`.