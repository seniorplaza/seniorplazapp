
                let scene360, camera360, renderer360, sphere360, material360;
                let isUserInteracting360 = false;
                let lon360 = 0, lat360 = 0, phi360 = 0, theta360 = 0;
                let onPointerDownPointerX360 = 0, onPointerDownPointerY360 = 0;
                let onPointerDownLon360 = 0, onPointerDownLat360 = 0;
                let visor360Initialized = false;
                window.rooms360 = [{ texture: null, textureData: null, name: 'Sin foto', lon: 0, lat: 0 }];
                window.currentRoomIndex = 0;
                window.init360Visor = function() {
                    if (!visor360Initialized) {
                        init360();
                        visor360Initialized = true;
                        animate360();
                    }
                };

                function init360() {
                    const container = document.getElementById('canvas-container-360');
                    if (!container) {
                        return;
                    }
                    
                    const containerWidth = container.offsetWidth || 800;
                    const containerHeight = container.offsetHeight || 600;
                    scene360 = new THREE.Scene();
                    camera360 = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 1, 1100);
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    const segments = isMobile ? 32 : 60;
                    const rings = isMobile ? 24 : 40;
                    const geometry = new THREE.SphereGeometry(500, segments, rings);
                    geometry.scale(-1, 1, 1); // Invertir para ver desde dentro
                    material360 = new THREE.MeshBasicMaterial({ 
                        color: 0x000000,
                        transparent: true,
                        opacity: 0,
                        side: THREE.DoubleSide // Renderiza ambas caras
                    });
                    sphere360 = new THREE.Mesh(geometry, material360);
                    scene360.add(sphere360);
                    renderer360 = new THREE.WebGLRenderer({ 
                        antialias: !isMobile, // Sin antialiasing en móvil para mejor rendimiento
                        alpha: true,
                        powerPreference: 'high-performance'
                    });
                    renderer360.outputColorSpace = THREE.SRGBColorSpace;
                    renderer360.setClearColor(0x000000, 0); // Transparente
                    renderer360.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
                    renderer360.setSize(containerWidth, containerHeight);
                    renderer360.domElement.style.position = 'absolute';
                    renderer360.domElement.style.top = '0';
                    renderer360.domElement.style.left = '0';
                    renderer360.domElement.style.width = '100%';
                    renderer360.domElement.style.height = '100%';
                    renderer360.domElement.style.display = 'block';
                    renderer360.domElement.style.background = 'transparent';
                    renderer360.domElement.style.borderRadius = '24px'; // Bordes redondeados
                    renderer360.domElement.style.touchAction = isMobile ? 'pan-y' : 'none';
                    renderer360.domElement.style.pointerEvents = 'auto';
                    renderer360.domElement.classList.add('interactive'); // Permitir interacción
                    
                    container.appendChild(renderer360.domElement);
                    renderer360.domElement.addEventListener('pointerdown', onPointerDown360, { passive: true });
                    window.addEventListener('pointermove', onPointerMove360, { passive: false });
                    window.addEventListener('pointerup', onPointerUp360, { passive: true });
                    container.addEventListener('wheel', onDocumentMouseWheel360, { passive: false });
                    window.addEventListener('resize', onWindowResize360, { passive: true });

                    const fileInput = document.getElementById('file-input-360');
                    if (fileInput) {
                        fileInput.addEventListener('change', function(e) {
                            if(e.target.files[0]) {
                                loadFile360(e.target.files[0]);
                                setTimeout(() => {
                                    e.target.value = '';
                                }, 100);
                            }
                        });
                    }
                    
                    updateNavigationButtons();
                    updateRoomInfo();
                    if (window.needsVisor360Init && window.rooms360 && window.rooms360.length > 0) {
                        window.needsVisor360Init = false;
                        window.currentRoomIndex = 0;
                        loadRoom(0);
                    }
                }

                function loadFile360(file) {
                    const loader360 = document.getElementById('loader360');
                    const initialPrompt = document.getElementById('initial-prompt-360');
                    
                    if (loader360) loader360.style.display = 'flex';
                    if (initialPrompt) initialPrompt.style.display = 'none';

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        
                        img.onload = function() {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const maxWidth = 2048;
                            let width = img.width;
                            let height = img.height;
                            
                            if (width > maxWidth) {
                                height = (height * maxWidth) / width;
                                width = maxWidth;
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
                            const texture = new THREE.Texture(img);
                            texture.generateMipmaps = false;
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            texture.wrapS = THREE.ClampToEdgeWrapping;
                            texture.wrapT = THREE.ClampToEdgeWrapping;
                            texture.colorSpace = THREE.SRGBColorSpace;
                            texture.needsUpdate = true;
                            if (!window.rooms360) {
                                window.rooms360 = [];
                            }
                            if (!window.rooms360[window.currentRoomIndex]) {
                                window.rooms360[window.currentRoomIndex] = {
                                    texture: null,
                                    textureData: null,
                                    name: 'Sin foto',
                                    lon: 0,
                                    lat: 0
                                };
                            }
                            
                            window.rooms360[window.currentRoomIndex].texture = texture;
                            window.rooms360[window.currentRoomIndex].textureData = compressedData; // Usar comprimida
                            window.rooms360[window.currentRoomIndex].name = file.name;
                            material360.map = texture;
                            material360.color.set(0xffffff);
                            material360.transparent = false;
                            material360.opacity = 1;
                            material360.needsUpdate = true;
                            const dropZone = document.getElementById('drop-zone-360');
                            if (dropZone) {
                                dropZone.style.display = 'none';
                                dropZone.style.zIndex = '1';
                            }
                            const canvasContainer = document.getElementById('canvas-container-360');
                            if (canvasContainer) {
                                canvasContainer.style.display = 'block';
                                canvasContainer.style.visibility = 'visible';
                                canvasContainer.style.opacity = '1';
                                canvasContainer.style.zIndex = '1';
                            }
                            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                            const mobileHint = document.getElementById('mobile-fullscreen-hint');
                            if (isMobile && mobileHint) {
                                const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                                       document.mozFullScreenElement || document.msFullscreenElement);
                                mobileHint.style.display = isFullscreen ? 'none' : 'block';
                            }
                            window.visor360Initialized = true;
                            if (renderer360 && scene360 && camera360) {
                                renderer360.render(scene360, camera360);
                            }
                            
                            const background = document.getElementById('visor-background');
                            if (background) background.style.opacity = '1';
                            if (loader360) loader360.style.display = 'none';
                            
                            updateRoomInfo();
                            updateNavigationButtons();
                            if (window.rooms360 && window.rooms360[window.currentRoomIndex]) {
                            }
                            try {
                                guardarDatos();
                            } catch (e) {
                            }
                        };
                        
                        img.onerror = function(error) {
                            if (loader360) loader360.style.display = 'none';
                        };
                        
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
                
                let addRoomDebounce = false;
                function addNewRoom() {
                    const rooms360 = window.rooms360;
                    let currentRoomIndex = window.currentRoomIndex;
                    
                    if (addRoomDebounce) return;
                    addRoomDebounce = true;
                    setTimeout(() => addRoomDebounce = false, 500);
                    rooms360[currentRoomIndex].lon = lon360;
                    rooms360[currentRoomIndex].lat = lat360;
                    rooms360.push({ 
                        texture: null,
                        textureData: null,
                        name: 'Sin foto',
                        lon: 0,
                        lat: 0
                    });
                    window.currentRoomIndex = rooms360.length - 1;
                    currentRoomIndex = window.currentRoomIndex;
                    lon360 = 0;
                    lat360 = 0;
                    loadRoom(currentRoomIndex);
                }
                
                function nextRoom() {
                    if (currentRoomIndex < rooms360.length - 1) {
                        rooms360[currentRoomIndex].lon = lon360;
                        rooms360[currentRoomIndex].lat = lat360;
                        
                        currentRoomIndex++;
                        loadRoom(currentRoomIndex);
                    }
                }
                
                function prevRoom() {
                    if (currentRoomIndex > 0) {
                        rooms360[currentRoomIndex].lon = lon360;
                        rooms360[currentRoomIndex].lat = lat360;
                        
                        currentRoomIndex--;
                        loadRoom(currentRoomIndex);
                    }
                }
                
                function deleteCurrentRoom360() {
                    const currentIndex = window.currentRoomIndex;
                    if (window.rooms360 && window.rooms360[currentIndex]) {
                        window.rooms360[currentIndex] = {
                            texture: null,
                            textureData: null,
                            name: 'Sin foto',
                            lon: 0,
                            lat: 0
                        };
                    } else {
                    }
                    if (material360) {
                        material360.map = null;
                        material360.transparent = true;
                        material360.opacity = 0;
                        material360.needsUpdate = true;
                    }
                    const visorBackground = document.getElementById('visor-background');
                    if (visorBackground) {
                        visorBackground.style.opacity = '0';
                    }
                    if (typeof window.loadRoom === 'function') {
                        window.loadRoom(currentIndex);
                    } else {
                    }
                    if (typeof guardarDatos === 'function') {
                        guardarDatos();
                    } else {
                    }
                }
                window.deleteCurrentRoom360 = deleteCurrentRoom360;
                
                window.loadRoom = function(index) {
                    const rooms360 = window.rooms360;
                    if (!rooms360 || !rooms360[index]) {
                        return;
                    }
                    
                    const room = rooms360[index];
                    lon360 = room.lon;
                    lat360 = room.lat;
                    
                    const initialPrompt = document.getElementById('initial-prompt-360');
                    const background = document.getElementById('visor-background');
                    const dropZone = document.getElementById('drop-zone-360');
                    const filename = document.getElementById('filename360');
                    if (!room.texture && room.textureData && typeof THREE !== 'undefined') {
                        const loader = new THREE.TextureLoader();
                        room.texture = loader.load(room.textureData);
                    }
                    
                    if (room.texture) {
                        material360.map = room.texture;
                        material360.color.set(0xffffff);
                        material360.transparent = false;
                        material360.opacity = 1;
                        material360.needsUpdate = true;
                        
                        if (background) background.style.opacity = '1';
                        if (initialPrompt) initialPrompt.style.display = 'none';
                        if (dropZone) dropZone.style.display = 'none';
                        const deleteBtn = document.getElementById('deleteBtn360');
                        if (deleteBtn) deleteBtn.style.display = 'flex';
                        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                        const mobileHint = document.getElementById('mobile-fullscreen-hint');
                        if (isMobile && mobileHint) {
                            const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                                   document.mozFullScreenElement || document.msFullscreenElement);
                            mobileHint.style.display = isFullscreen ? 'none' : 'block';
                        }
                    } else {
                        material360.map = null;
                        material360.transparent = true;
                        material360.opacity = 0;
                        material360.needsUpdate = true;
                        
                        if (background) background.style.opacity = '0';
                        if (initialPrompt) initialPrompt.style.display = 'block';
                        if (dropZone) dropZone.style.display = 'flex';
                        const deleteBtn = document.getElementById('deleteBtn360');
                        if (deleteBtn) deleteBtn.style.display = 'none';
                        const mobileHint = document.getElementById('mobile-fullscreen-hint');
                        if (mobileHint) mobileHint.style.display = 'none';
                    }
                    if (filename) {
                        filename.textContent = room.name;
                    }
                    const prevBtn = document.getElementById('prevRoomBtn');
                    const nextBtn = document.getElementById('nextRoomBtn');
                    const currentRoomIndex = window.currentRoomIndex;
                    
                    if (prevBtn) {
                        prevBtn.style.display = currentRoomIndex > 0 ? 'flex' : 'none';
                    }
                    
                    if (nextBtn) {
                        nextBtn.style.display = rooms360.length > 1 && currentRoomIndex < rooms360.length - 1 ? 'flex' : 'none';
                    }
                }
                const loadRoom = window.loadRoom; // Alias local
                
                function updateRoomInfo() {
                    const filename = document.getElementById('filename360');
                    if (filename) {
                        const currentRoom = rooms360[currentRoomIndex];
                        if (filename) { filename.textContent = currentRoom.name; }
                    }
                }
                
                function updateNavigationButtons() {
                    const prevBtn = document.getElementById('prevRoomBtn');
                    const nextBtn = document.getElementById('nextRoomBtn');
                    const deleteBtn = document.getElementById('deleteBtn360');
                    if (deleteBtn) {
                        deleteBtn.style.display = rooms360 && rooms360.length > 0 ? 'flex' : 'none';
                    }
                    if (prevBtn) {
                        prevBtn.style.display = currentRoomIndex > 0 ? 'flex' : 'none';
                    }
                    if (nextBtn) {
                        nextBtn.style.display = rooms360.length > 1 && currentRoomIndex < rooms360.length - 1 ? 'flex' : 'none';
                    }
                }

                function onPointerDown360(event) {
                    if (event.isPrimary === false) return;
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                                           document.mozFullScreenElement || document.msFullscreenElement);
                    if (isMobile && !isFullscreen) {
                        return; // No capturar el evento, permitir que pase al scroll
                    }
                    isUserInteracting360 = true;
                    onPointerDownPointerX360 = event.clientX;
                    onPointerDownPointerY360 = event.clientY;
                    onPointerDownLon360 = lon360;
                    onPointerDownLat360 = lat360;
                    const canvas = renderer360?.domElement;
                    if (canvas && event.pointerType === 'mouse') {
                        canvas.style.cursor = 'grabbing';
                    }
                }

                function onPointerMove360(event) {
                    if (isUserInteracting360 === true) {
                        event.preventDefault();
                        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                        const sensitivity = isMobile ? 0.15 : 0.2;
                        lon360 = (onPointerDownPointerX360 - event.clientX) * sensitivity + onPointerDownLon360;
                        lat360 = (event.clientY - onPointerDownPointerY360) * sensitivity + onPointerDownLat360;
                    }
                }

                function onPointerUp360() {
                    isUserInteracting360 = false;
                    const canvas = renderer360?.domElement;
                    if (canvas) {
                        canvas.style.cursor = 'grab';
                    }
                }

                function onDocumentMouseWheel360(event) {
                    event.preventDefault();
                    camera360.fov += event.deltaY * 0.05;
                    camera360.fov = Math.max(20, Math.min(95, camera360.fov));
                    camera360.updateProjectionMatrix();
                }

                function onWindowResize360() {
                    const container = document.getElementById('canvas-container-360');
                    const containerWidth = container.offsetWidth;
                    const containerHeight = container.offsetHeight;
                    camera360.aspect = containerWidth / containerHeight;
                    camera360.updateProjectionMatrix();
                    renderer360.setSize(containerWidth, containerHeight);
                }
                window.toggleFullscreen360 = function() {
                    const visorContainer = document.getElementById('visor-main-container');
                    const fullscreenBtn = document.getElementById('fullscreenBtn360');
                    const icon = fullscreenBtn.querySelector('.material-symbols-rounded');
                    
                    if (!document.fullscreenElement) {
                        if (visorContainer.requestFullscreen) {
                            visorContainer.requestFullscreen();
                        } else if (visorContainer.webkitRequestFullscreen) {
                            visorContainer.webkitRequestFullscreen();
                        } else if (visorContainer.mozRequestFullScreen) {
                            visorContainer.mozRequestFullScreen();
                        } else if (visorContainer.msRequestFullscreen) {
                            visorContainer.msRequestFullscreen();
                        }
                        icon.textContent = 'fullscreen_exit';
                        if (navigator.vibrate) navigator.vibrate(30);
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                        icon.textContent = 'fullscreen';
                    }
                };
                document.addEventListener('fullscreenchange', function() {
                    const fullscreenBtn = document.getElementById('fullscreenBtn360');
                    const icon = fullscreenBtn ? fullscreenBtn.querySelector('.material-symbols-rounded') : null;
                    if (icon) {
                        icon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
                    }
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    const canvas = renderer360?.domElement;
                    if (canvas && isMobile) {
                        if (document.fullscreenElement) {
                            canvas.style.touchAction = 'none';
                        } else {
                            canvas.style.touchAction = 'pan-y';
                        }
                    }
                    const mobileHint = document.getElementById('mobile-fullscreen-hint');
                    if (isMobile && mobileHint) {
                        const hasImage = window.rooms360 && window.rooms360[window.currentRoomIndex]?.texture;
                        mobileHint.style.display = (!document.fullscreenElement && hasImage) ? 'block' : 'none';
                    }
                    setTimeout(onWindowResize360, 100);
                });
                
                document.addEventListener('webkitfullscreenchange', function() {
                    const fullscreenBtn = document.getElementById('fullscreenBtn360');
                    const icon = fullscreenBtn ? fullscreenBtn.querySelector('.material-symbols-rounded') : null;
                    if (icon) {
                        icon.textContent = document.webkitFullscreenElement ? 'fullscreen_exit' : 'fullscreen';
                    }
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    const canvas = renderer360?.domElement;
                    if (canvas && isMobile) {
                        if (document.webkitFullscreenElement) {
                            canvas.style.touchAction = 'none';
                        } else {
                            canvas.style.touchAction = 'pan-y';
                        }
                    }
                    const mobileHint = document.getElementById('mobile-fullscreen-hint');
                    if (isMobile && mobileHint) {
                        const hasImage = window.rooms360 && window.rooms360[window.currentRoomIndex]?.texture;
                        mobileHint.style.display = (!document.webkitFullscreenElement && hasImage) ? 'block' : 'none';
                    }
                    
                    setTimeout(onWindowResize360, 100);
                });

                let frameCount = 0;
                function animate360() {
                    if (!visor360Initialized) {
                        return;
                    }
                    if (!renderer360) {
                        return;
                    }
                    if (frameCount < 3) {
                        frameCount++;
                    }
                    
                    requestAnimationFrame(animate360);
                    update360();
                }

                function update360() {
                    if (!camera360 || !renderer360 || !scene360) return;
                    
                    lat360 = Math.max(-85, Math.min(85, lat360));
                    phi360 = THREE.MathUtils.degToRad(90 - lat360);
                    theta360 = THREE.MathUtils.degToRad(lon360);

                    const target = new THREE.Vector3();
                    target.x = 500 * Math.sin(phi360) * Math.cos(theta360);
                    target.y = 500 * Math.cos(phi360);
                    target.z = 500 * Math.sin(phi360) * Math.sin(theta360);

                    camera360.lookAt(target);
                    renderer360.render(scene360, camera360);
                }
                window.deleteCurrentRoom = function() {
                    const rooms360 = window.rooms360;
                    let currentRoomIndex = window.currentRoomIndex;
                    rooms360[currentRoomIndex] = { 
                        texture: null, 
                        textureData: null, 
                        name: 'Sin foto', 
                        lon: 0, 
                        lat: 0 
                    };
                    try {
                        window.loadRoom(currentRoomIndex);
                    } catch (e) {
                    }
                    if (typeof guardarDatos === 'function') {
                        guardarDatos();
                    } else {
                    }
                };
            
