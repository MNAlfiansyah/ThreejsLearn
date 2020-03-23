var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height: 1.5, speed: 0.1 };

var loadingScreen = {
    scene: new THREE.Scene(),
    camera : new THREE.PerspectiveCamera(80, 1360/720, 0.1, 1000),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
}
var LOADING_MANAGER = null;
var RESOURCES_LOADED = false;

var models = {
    tent: {
        obj: "/assets/object/Tent_Poles_01.obj",
        mtl: "/assets/object/Tent_Poles_01.mtl",
        mesh: null
    },
    tent2: {
        obj: "/assets/object/Tent_01.obj",
        mtl: "/assets/object/Tent_01.mtl",
        mesh: null
    },
    tree: {
        obj: "/assets/object/Tree_01.obj",
        mtl: "/assets/object/Tree_01.mtl",
        mesh: null
    }
};

var meshes = {};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(80, 1280/720, 0.1, 1000);

    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();

    loadingManager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    }

    loadingManager.onLoad = function () {
        console.log("LOADED ALL RESOURCE");
        RESOURCES_LOADED = true;    
        onResourcesLoaded();
    }

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color: 0xff9999, wireframe: true})
    );
    mesh.position.y += 1;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    // scene.add(mesh);
        
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20,20, 20,20),
        new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false})
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xff5c33, 1, 15);
    light.position.set(-3,6, 3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    var textureLoader = new THREE.TextureLoader(loadingManager);
    textureLoader.setCrossOrigin ('anonymous');
    crateTexture = new textureLoader.load("assets/crate/crate0_diffuse.png");
    crateBumpMap = new textureLoader.load("assets/crate/crate0_bump.png")
    crateNormalMap = new textureLoader.load("assets/crate/crate0_normal.png")
    crate = new THREE.Mesh(
        new THREE.BoxGeometry(2,2,2),
        new THREE.MeshPhongMaterial({ 
            color:0xffffff,
            map:crateTexture,
            bumpMap:crateBumpMap,
            normalMap:crateNormalMap
        })
    );  
    crate.position.set(2.5, 2/2 , 2.5);
    crate.receiveShadow = true;
    crate.castShadow = true;
    // scene.add(crate);

    // var mtlLoader = new THREE.MTLLoader(loadingManager);
    // mtlLoader.setBaseUrl( "http://threejs.test/assets/object/" );
    // mtlLoader.load("/assets/object/Tree_01.mtl", function(materials){
		
	// 	materials.preload();
	// 	var objLoader = new THREE.OBJLoader(loadingManager);
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath( "http://threejs.test/assets/object/" );
	// 	objLoader.load("Tree_01.obj", function(mesh){
		
	// 		mesh.traverse(function(node){
	// 			if( node instanceof THREE.Mesh ){
	// 				node.castShadow = true;
	// 				node.receiveShadow = true;
	// 			}
	// 		});
		
	// 		scene.add(mesh);
	// 		mesh.position.set(-5, 0.5, 4);
	// 		mesh.rotation.y = -Math.PI/4;
	// 	});
	// });


    for (var _key in models) {
        (function (key) {

            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials){ 
                materials.preload();
                var objLoader = new THREE.OBJLoader(loadingManager);
                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh) {
                    mesh.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;

                });
            });
        })(_key);
        
    }

    camera.position.set(-3, player.height, -1);
    camera.lookAt(new THREE.Vector3(-15, player.height, 20));

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.getElementById("viewport")
    });
    renderer.setSize(1345, 700);
    renderer.setClearColor(new THREE.Color(0xfefefe));

    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap;

    // document.body.appendChild(renderer.domElement);

    animate();
}

function onResourcesLoaded() {
    meshes['tentc1'] = models.tent.mesh.clone();
    meshes['tentc2'] = models.tent.mesh.clone();
    meshes['tent2c1'] = models.tent2.mesh.clone();
    meshes['tent2c2'] = models.tent2.mesh.clone();
    meshes['tree1'] = models.tree.mesh.clone();
    meshes['tree2'] = models.tree.mesh.clone();
    meshes['tree3'] = models.tree.mesh.clone();
    meshes['tree4'] = models.tree.mesh.clone();
    meshes['tree5'] = models.tree.mesh.clone();

    meshes['tentc1'].position.set(-5, 0, 4);
    meshes['tentc1'].rotation.y = -Math.PI/4;
    scene.add(meshes['tentc1']);

    meshes['tree1'].position.set(-5, 0.5, 8);
    scene.add(meshes['tree1']);
    meshes['tree2'].position.set(-5.8, 0.5, 7.3);
    scene.add(meshes['tree2']);
    meshes['tree3'].position.set(-6.6, 0.5, 6.4);
    scene.add(meshes['tree3']);
    meshes['tree4'].position.set(-6.8, 0.5, 5.3);
    scene.add(meshes['tree4']);
    meshes['tree5'].position.set(-4.2, 0.5, 7.3);
    scene.add(meshes['tree5']);
}

function animate() {

    // if ( RESOURCES_LOADED == false) {
    //     requestAnimationFrame(animate);

    //     loadingScreen.box.position.x -= 0.05;
    //     if ( loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
    //     loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

    //     renderer.render(loadingScreen.scene, loadingScreen.camera);
    //     return;
    // }

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    crate.rotation.y += 0.01;

    if (keyboard[87]) { // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]) { // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) { // A Key
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
    if (keyboard[68]) { // D Key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    if (keyboard[37]) {
        camera.rotation.y -= Math.PI * 0.01;
    }
    if (keyboard[39]) {
        camera.rotation.y += Math.PI * 0.01;
    }

    renderer.render(scene, camera);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}
function updateCamera(ev) {
    let div1 = document.getElementById("div1");
	camera.position.z = -1.5 + window.scrollY / 100.0;
    if (camera.position.z == 2.9400000000000004) {
        camera.position.z = 1000;
    }
}


window.addEventListener("scroll", updateCamera);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;