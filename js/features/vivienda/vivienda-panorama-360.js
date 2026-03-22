
                let scene360, camera360, renderer360, sphere360, material360;
                let isUserInteracting360 = false;
                let lon360 = 0, lat360 = 0, phi360 = 0, theta360 = 0;
                let onPointerDownPointerX360 = 0, onPointerDownPointerY360 = 0;
                let onPointerDownLon360 = 0, onPointerDownLat360 = 0;
                let visor360Initialized = false;
                let gyroEnabled360 = false;
                let gyroPermissionRequested360 = false;
                let gyroBaseAlpha360 = null, gyroBaseBeta360 = null, gyroBaseGamma360 = null;
                let gyroLastAlpha360 = null;
                let gyroAccumulatedYaw360 = 0;
                let gyroAnchorLon360 = 0, gyroAnchorLat360 = 0;
                let gyroTargetLon360 = 0, gyroTargetLat360 = 0;
                let immersiveFallback360 = false;
                window.rooms360 = [{ texture: null, textureData: null, name: 'Sin foto', lon: 0, lat: 0 }];
                window.currentRoomIndex = 0;

                function isMobile360() {
                    return /Mobi|Android/i.test(navigator.userAgent);
                }

                function isNativeFullscreen360() {
                    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
                }

                function isFullscreen360() {
                    return immersiveFallback360 || isNativeFullscreen360();
                }

                function resetGyro360() {
                    gyroBaseAlpha360 = null;
                    gyroBaseBeta360 = null;
                    gyroBaseGamma360 = null;
                    gyroLastAlpha360 = null;
                    gyroAccumulatedYaw360 = 0;
                    gyroAnchorLon360 = lon360;
                    gyroAnchorLat360 = lat360;
                    gyroTargetLon360 = lon360;
                    gyroTargetLat360 = lat360;
                }

                function shortestAngleDelta360(current, base) {
                    let delta = current - base;
                    while (delta > 180) delta -= 360;
                    while (delta < -180) delta += 360;
                    return delta;
                }

                function applyGyroDeadZone360(delta, deadZone) {
                    return Math.abs(delta) < deadZone ? 0 : delta;
                }

                function clampGyroDelta360(delta, maxAbs) {
                    return Math.max(-maxAbs, Math.min(maxAbs, delta));
                }

                function normalizeAngle360(angle) {
                    let normalized = angle % 360;
                    if (normalized > 180) normalized -= 360;
                    if (normalized < -180) normalized += 360;
                    return normalized;
                }

                function getScreenAngle360() {
                    const rawAngle = (screen.orientation && typeof screen.orientation.angle === 'number')
                        ? screen.orientation.angle
                        : (typeof window.orientation === 'number' ? window.orientation : 0);
                    let angle = rawAngle % 360;
                    if (angle < 0) angle += 360;
                    return angle;
                }

                function syncImmersive360State(forceActive) {
                    const active = typeof forceActive === 'boolean' ? forceActive : isFullscreen360();
                    const visorContainer = document.getElementById('visor-main-container');
                    document.body.classList.toggle('visor360-immersive', !!active);
                    if (visorContainer) visorContainer.classList.toggle('visor360-faux-fullscreen', !!immersiveFallback360);
                    const mobileHint = document.getElementById('mobile-fullscreen-hint');
                    if (mobileHint && isMobile360()) {
                        const hasImage = window.rooms360 && window.rooms360[window.currentRoomIndex] && window.rooms360[window.currentRoomIndex].texture;
                        mobileHint.style.display = (!active && hasImage) ? 'block' : 'none';
                    }
                    const canvas = renderer360 && renderer360.domElement;
                    if (canvas && isMobile360()) {
                        canvas.style.touchAction = active ? 'none' : 'pan-y';
                    }
                }

                async function requestGyroPermission360() {
                    if (!isMobile360()) return false;
                    if (gyroEnabled360) return true;
                    if (gyroPermissionRequested360) return gyroEnabled360;
                    gyroPermissionRequested360 = true;
                    try {
                        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                            const permission = await DeviceOrientationEvent.requestPermission();
                            gyroEnabled360 = permission === 'granted';
                        } else {
                            gyroEnabled360 = true;
                        }
                    } catch (e) {
                        gyroEnabled360 = false;
                    }
                    return gyroEnabled360;
                }

                function onDeviceOrientation360(event) {
                    if (!gyroEnabled360 || !isFullscreen360() || isUserInteracting360) return;
                    if (typeof event.alpha !== 'number' || typeof event.beta !== 'number' || typeof event.gamma !== 'number') return;
                    const screenAngle = getScreenAngle360();
                    let horizontalRaw = event.gamma;
                    let verticalRaw = event.beta;

                    if (screenAngle === 90) {
                        horizontalRaw = -event.beta;
                        verticalRaw = event.gamma;
                    } else if (screenAngle === 270) {
                        horizontalRaw = event.beta;
                        verticalRaw = -event.gamma;
                    } else if (screenAngle === 180) {
                        horizontalRaw = -event.gamma;
                        verticalRaw = -event.beta;
                    }

                    if (gyroBaseAlpha360 === null || gyroBaseBeta360 === null || gyroBaseGamma360 === null) {
                        gyroBaseAlpha360 = event.alpha;
                        gyroLastAlpha360 = event.alpha;
                        gyroAccumulatedYaw360 = 0;
                        gyroBaseBeta360 = verticalRaw;
                        gyroBaseGamma360 = horizontalRaw;
                        gyroAnchorLon360 = lon360;
                        gyroAnchorLat360 = lat360;
                        gyroTargetLon360 = lon360;
                        gyroTargetLat360 = lat360;
                        return;
                    }
                    let deltaYaw = shortestAngleDelta360(event.alpha, gyroLastAlpha360);
                    const deltaBeta = applyGyroDeadZone360(Math.max(-55, Math.min(55, verticalRaw - gyroBaseBeta360)), 0.8);
                    gyroLastAlpha360 = event.alpha;
                    if (Math.abs(deltaYaw) > 18) {
                        return;
                    }
                    deltaYaw = applyGyroDeadZone360(clampGyroDelta360(deltaYaw, 5), 0.2);
                    gyroAccumulatedYaw360 += deltaYaw;
                    gyroTargetLon360 = gyroAnchorLon360 - gyroAccumulatedYaw360 * 1.05;
                    gyroTargetLat360 = gyroAnchorLat360 + deltaBeta * 0.85;
                }

                async function enterNativeFullscreen360() {
                    const root = document.documentElement;
                    try {
                        if (root.requestFullscreen) {
                            const result = root.requestFullscreen();
                            if (result && typeof result.then === 'function') await result;
                            return true;
                        }
                        if (root.webkitRequestFullscreen) {
                            root.webkitRequestFullscreen();
                            return true;
                        }
                        if (root.mozRequestFullScreen) {
                            root.mozRequestFullScreen();
                            return true;
                        }
                        if (root.msRequestFullscreen) {
                            root.msRequestFullscreen();
                            return true;
                        }
                    } catch (e) {
                    }
                    return false;
                }

                async function exitNativeFullscreen360() {
                    try {
                        if (document.exitFullscreen) {
                            const result = document.exitFullscreen();
                            if (result && typeof result.then === 'function') await result;
                            return;
                        }
                        if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                            return;
                        }
                        if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                            return;
                        }
                        if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    } catch (e) {
                    }
                }

                function syncFullscreenUi360() {
                    const fullscreenBtn = document.getElementById('fullscreenBtn360');
                    const icon = fullscreenBtn ? fullscreenBtn.querySelector('.material-symbols-rounded') : null;
                    if (icon) icon.textContent = isFullscreen360() ? 'fullscreen_exit' : 'fullscreen';
                    syncImmersive360State();
                    resetGyro360();
                    setTimeout(onWindowResize360, 100);
                }

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
                    const isMobile = isMobile360();
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
                    window.addEventListener('deviceorientation', onDeviceOrientation360, true);
                    window.addEventListener('orientationchange', function () {
                        resetGyro360();
                        setTimeout(onWindowResize360, 120);
                    }, { passive: true });

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
                            const isMobile = isMobile360();
                            const mobileHint = document.getElementById('mobile-fullscreen-hint');
                            if (isMobile && mobileHint) {
                                const isFullscreen = isFullscreen360();
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
                        const isMobile = isMobile360();
                        const mobileHint = document.getElementById('mobile-fullscreen-hint');
                        if (isMobile && mobileHint) {
                            const isFullscreen = isFullscreen360();
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
                    const isMobile = isMobile360();
                    const isFullscreen = isFullscreen360();
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
                    if (gyroEnabled360 && isFullscreen360()) {
                        resetGyro360();
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
                window.toggleFullscreen360 = async function() {
                    if (!isFullscreen360()) {
                        const nativeEntered = await enterNativeFullscreen360();
                        immersiveFallback360 = !nativeEntered;
                        syncImmersive360State(true);
                        await requestGyroPermission360();
                        resetGyro360();
                        if (navigator.vibrate) navigator.vibrate(30);
                    } else {
                        const wasNative = isNativeFullscreen360();
                        immersiveFallback360 = false;
                        if (wasNative) await exitNativeFullscreen360();
                        syncImmersive360State(false);
                    }
                    syncFullscreenUi360();
                };
                document.addEventListener('fullscreenchange', syncFullscreenUi360);
                document.addEventListener('webkitfullscreenchange', syncFullscreenUi360);
                document.addEventListener('mozfullscreenchange', syncFullscreenUi360);
                document.addEventListener('MSFullscreenChange', syncFullscreenUi360);

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

                    if (gyroEnabled360 && isFullscreen360() && !isUserInteracting360) {
                        lon360 += shortestAngleDelta360(gyroTargetLon360, lon360) * 0.10;
                        lat360 += (gyroTargetLat360 - lat360) * 0.12;
                    }
                    
                    lon360 = normalizeAngle360(lon360);
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
            
