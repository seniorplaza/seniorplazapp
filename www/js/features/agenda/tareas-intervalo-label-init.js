
                    (function(){
                        var el = document.getElementById('tareas-intervalo-label');
                        if(el){ var now = new Date(); var m = now.toLocaleDateString('es-ES',{month:'long',year:'numeric'}); el.textContent = m.charAt(0).toUpperCase()+m.slice(1); }
                    })();
                
