
                    (function(){
                        var el = document.getElementById('gym-fecha-hoy');
                        if(el){
                            var now = new Date();
                            var label = now.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
                            el.textContent = label.charAt(0).toUpperCase()+label.slice(1);
                        }
                    })();
                
