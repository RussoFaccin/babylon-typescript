import * as BABYLON from "babylonjs";

const settings = {
    debug: false,
};

export class MainScene extends BABYLON.Scene {
    private mainCamera: BABYLON.ArcRotateCamera;
    private mainLight: BABYLON.HemisphericLight;
    constructor(engine, canvas) {
        super(engine);
        // Camera
        this.mainCamera = new BABYLON.ArcRotateCamera(
            "Main Camera",
            Math.PI / 8,
            1.3,
            25,
            BABYLON.Vector3.Zero(),
            this,
        );

        this.mainCamera.attachControl(canvas);
        // Light
        this.mainLight = new BABYLON.HemisphericLight(
            "MainLight",
            new BABYLON.Vector3(1, 1, 0),
            this,
        );
        // Skybox
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("_assets/textures/env", this);
        skyboxMaterial.reflectionTexture.coordinatesMode =
            BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        // Physics
        const gravityVector = new BABYLON.Vector3(0, -9.8, 0);
        const physicsPlugin = new BABYLON.AmmoJSPlugin();
        this.enablePhysics(gravityVector, physicsPlugin);
        // Meshes
        this.loadMeshes();
    }
    private loadMeshes() {
        // Ground
        BABYLON.SceneLoader.ImportMesh(
            "",
            "_assets/",
            "floor.glb",
            this,
            (meshes) => {
                const groundOptions = {
                    depth: 16,
                    height: 0.1,
                    width: 16,
                };

                const groundCollider = BABYLON.MeshBuilder.CreateBox(
                    "Ground Collider",
                    groundOptions,
                );
                groundCollider.isVisible = settings.debug;
                groundCollider.physicsImpostor = new BABYLON.PhysicsImpostor(
                    groundCollider,
                    BABYLON.PhysicsImpostor.BoxImpostor,
                    { mass: 0 },
                    this,
                );
                const meshRoot = new BABYLON.Mesh("", this);
                meshRoot.physicsImpostor = new BABYLON.PhysicsImpostor(
                    meshRoot,
                    BABYLON.PhysicsImpostor.NoImpostor,
                    { mass: 0 },
                    this,
                );
                meshRoot.addChild(meshes[0]);
                meshRoot.addChild(groundCollider);
            },
        );
        // Crate
        BABYLON.SceneLoader.ImportMesh(
            "",
            "_assets/",
            "crate.glb",
            this,
            (meshes) => {
                // Loaded mesh
                meshes[0].position.set(0, -7, 0);
                // Collider
                const crateColl = BABYLON.MeshBuilder.CreateBox(
                    "CrateCollision",
                    { size: 2 },
                    this,
                );
                crateColl.isVisible = settings.debug;
                crateColl.position.set(0, 0, 0);
                // Physics root
                const crateRoot = new BABYLON.Mesh("", this);
                crateRoot.addChild(meshes[0]);
                crateRoot.addChild(crateColl);
                crateRoot.position.set(0, 7, 0);
                crateRoot.rotation.set(10, 0, 10);
                // Enable physics
                crateColl.physicsImpostor = new BABYLON.PhysicsImpostor(
                    crateColl,
                    BABYLON.PhysicsImpostor.BoxImpostor,
                    { mass: 0 },
                    this,
                );

                crateRoot.physicsImpostor = new BABYLON.PhysicsImpostor(
                    crateRoot,
                    BABYLON.PhysicsImpostor.NoImpostor,
                    { mass: 3, restitution: 0.2 },
                    this,
                );
            },
        );
    }
}
