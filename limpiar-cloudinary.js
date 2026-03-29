const fs = require('fs');
const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const CLOUDINARY_CLOUD = 'dtzcrlyod'; // Preconfigurado según tu aplicación

function prompt(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    console.log("==================================================");
    console.log("   🧹 LIMPIADOR DE ARCHIVOS HUÉRFANOS - SENIOR PLAZA APP");
    console.log("==================================================\n");
    
    // 1. Pedir el archivo
    console.log("PASO 1: Genera y localiza la Copia de Seguridad");
    console.log("-> Ve a tu teléfono o navegador web local de la app.");
    console.log("-> Ve a Ajustes > Sistema > 'Exportar y descargar todos los datos'.");
    console.log("-> Eso descargará un fichero .json.");
    const file = await prompt("\nArrastra tu último archivo .json descargado aquí (o escribe la ruta) y pulsa Enter:\n> ");
    
    // Quita las comillas si se arrastró el archivo en PowerShell
    const cleanPath = file.trim().replace(/^['"]|['"]$/g, '');
    
    let fileContent;
    try {
        fileContent = fs.readFileSync(cleanPath, 'utf8');
        console.log(`\n✅ Archivo leído correctamente (${(fileContent.length / 1024).toFixed(2)} KB).`);
    } catch(e) {
        console.error("❌ No se pudo leer el archivo. Lanza el script otra vez.");
        console.error("Detalle:", e.message);
        process.exit(1);
    }
    
    // 2. Obtener credenciales
    console.log("\nPASO 2: Identificación con Cloudinary");
    console.log("Necesito la Key y el Secret (búscalos en tu panel principal de Cloudinary).");
    console.log("-> Tranquilo, estos datos solo se usan desde tu propio ordenador y no se guardan.");
    const apiKey = await prompt("Introduce API KEY: ");
    const apiSecret = await prompt("Introduce API SECRET: ");
    
    // 3. Obtener todos los resources de Cloudinary
    console.log("\n🔄 Descargando el listado en vivo desde el servidor Cloudinary... (esto puede tardar)");
    
    let allResources = [];
    
    // Buscar tipo 'image' y tipo 'raw' (por los PDFs o Gpx)
    for (const type of ['image', 'raw']) {
        let nextCursor = null;
        try {
            do {
                const auth = Buffer.from(apiKey.trim() + ':' + apiSecret.trim()).toString('base64');
                const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/${type}?max_results=500${nextCursor ? '&next_cursor='+nextCursor : ''}`;
                
                const res = await fetch(url, { headers: { 'Authorization': 'Basic ' + auth } });
                if(!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt);
                }
                const data = await res.json();
                allResources = allResources.concat(data.resources || []);
                nextCursor = data.next_cursor;
            } while (nextCursor);
        } catch(e) {
            console.error(`❌ Error conectando con la sección '${type}' en Cloudinary. Revisa la Key y el Secret.`);
            console.error("Error:", e.message);
            process.exit(1);
        }
    }
    
    console.log(`✅ ¡Hecho! Tienes un total de ${allResources.length} archivos subidos al servidor.`);

    // 4. Detectar huérfanos
    // Hacemos el cruce buscando textualmente si el 'public_id' está en el json nativo guardado (prueba infalible)
    const huerfanos = allResources.filter(res => {
        // En tu JSON se guardan URLs "secure_url". El public_id a veces se guarda, pero a simple vista el secure_url
        // es lo que importa. Buscaremos simplemente si el código base de la imagen (public_id puro) figura textual 
        // en algún lugar del documento de seguridad de la app.
        return !fileContent.includes(res.public_id);
    });
    
    console.log(`\n📊 ANÁLISIS COMPLETADO:`);
    console.log(`   - En Servidor: ${allResources.length} archivos totales.`);
    console.log(`   - En la App: ${allResources.length - huerfanos.length} archivos en uso.`);
    console.log(`   - 🗑️ Basura Detectada: ${huerfanos.length} archivos 'huérfanos' (Listos para eliminar)`);
    
    if(huerfanos.length === 0) {
        console.log("\n🎉 ¡Tu servidor ya está perfectamente limpio! No hay nada de basura que borrar.");
        await prompt("Pulsa Enter para salir.");
        process.exit(0);
    }
    
    const confirmar = await prompt(`\n⚠️ ¿Quieres ELIMINAR definitivamente estos ${huerfanos.length} archivos para siempre? (escribe exactamente 'SI'): \n> `);
    
    if(confirmar.trim() !== 'SI') {
        console.log("Vale, operación cancelada. Ningún archivo ha sido borrado.");
        process.exit(0);
    }
    
    console.log("\n🗑️ Procediendo a limpiar el servidor Cloudinary en bloque...");
    let borrados = 0;
    
    const auth = Buffer.from(apiKey.trim() + ':' + apiSecret.trim()).toString('base64');
    
    // Cloudinary Admin API deletion max bundle is 100 per request.
    const imageOrphans = huerfanos.filter(r => r.resource_type === 'image');
    const rawOrphans = huerfanos.filter(r => r.resource_type === 'raw');

    async function processDeleteList(orphansList, resourceType) {
        for (let i = 0; i < orphansList.length; i += 100) {
            const chunk = orphansList.slice(i, i + 100).map(r => r.public_id);
            const urlDel = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/${resourceType}/upload`;
            
            const params = new URLSearchParams();
            chunk.forEach(id => Object.defineProperty(params, 'public_ids[]', { value: id, enumerable: true }));
            // Manual URLEncoding para arrays public_ids[]
            let rawBody = chunk.map(id => `public_ids[]=${encodeURIComponent(id)}`).join('&') + `&type=upload`;
            
            try {
                const res = await fetch(urlDel, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': 'Basic ' + auth,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: rawBody
                });
                if(res.ok) {
                    borrados += chunk.length;
                    console.log(`  -> Borrados ${borrados} de ${huerfanos.length}...`);
                } else {
                    console.log(`  -> Hubo un micro-bloqueo al borrar parte de los [${resourceType}], continuando:`, await res.text());
                }
            } catch(er) {
                console.error("  -> Alerta de conexión con Cloudinary, saltando bloque:", er.message);
            }
        }
    }

    if (imageOrphans.length > 0) await processDeleteList(imageOrphans, 'image');
    if (rawOrphans.length > 0) await processDeleteList(rawOrphans, 'raw');
    
    console.log(`\n🎉 ¡PROCESO FINALIZADO CON ÉXITO! Has limpiado un total de ${borrados} imágenes innecesarias de la nube.`);
    await prompt("Pulsa Enter para salir.");
    process.exit(0);
})();
