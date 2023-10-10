//--------------------------------------------------------------------------------------------------
let canvasElement      = null;
let canvasClickCounter = 0;
let mouseMoved         = false;

// harcoded material UUIDs, but one could fetch those from the 3dverse API
const materials = [
    { id: 'white', uuid: '8b4539e6-95c7-48ac-9100-7e9c39849745' },
    { id: 'red'  , uuid: '66ea7d28-464c-46f3-81e4-4ce0c297c9ed' },
    { id: 'blue' , uuid: '4d836cbc-321e-4ed4-a6c3-6d5e589ef855' }
];

//--------------------------------------------------------------------------------------------------
const camera_controller_types =
{
    orbit   : 1,
    editor  : 4
};

//--------------------------------------------------------------------------------------------------
window.addEventListener('load', InitApp);

//--------------------------------------------------------------------------------------------------
async function InitApp()
{
    console.log("Initializing...");

    canvasElement                    = document.getElementById('display_canvas');
    // cross-browser compatibility to lock the mouse pointer
    canvasElement.requestPointerLock = canvasElement.requestPointerLock || canvasElement.mozRequestPointerLock || canvasElement.webkitPointerLockElement;
    document.exitPointerLock         = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    SDK3DVerse.setViewports([
        {
            id: 0,
            left                    : 0.0,
            top                     : 0.0,
            width                   : 1.0,
            height                  : 1.0,
            defaultControllerType   : camera_controller_types.orbit
        }
    ]);

    SetResolution();

    // Use setTimeout as a debounce util to prevent updating the resolution
    // on each single resize window event triggered by the mouse move
    let debounceResizeTimeout = null;
    window.addEventListener('resize', () =>
    {
        if(debounceResizeTimeout)
        {
            clearTimeout(debounceResizeTimeout);
        }
        debounceResizeTimeout = setTimeout(() =>
        {
            SetResolution(false);
            debounceResizeTimeout = null;
        }, 100);
    });

    console.log("Connecting...");
    // Create or join a session
    const sessionCreated = await Connect();
    // The renderer streamer is connected and receives frames.
    // The editor api is connected and the scene graph is ready.
    // We can start to use the scene from here
    FadeOut();
    SetInformation("");

    // Change Camera speed
    SDK3DVerse.updateControllerSetting(
        {
            speed : 0.5
        }
    );

    if (sessionCreated)
    {
        // Do stuff specific after the session creation (not done if the existing session is joined)
    }
    else
    {
        // Do stuff specific after the session join (not done if the session was just created)
    }

    // Install virtual joysticks if mobile device is detected
    const joysticksContainer = document.getElementById('joysticks');
    // The promise installExtension is resolved only if the SDK3DVerse.EditorAPI is connected
    await SDK3DVerse.installExtension(SDK3DVerse_VirtualJoystick_Ext, null, joysticksContainer);

    // Do stuff specific after the session creation or join
    bindMouseEvents();
}

//--------------------------------------------------------------------------------------------------
function SetInformation(str)
{
    const infoSpan      = document.getElementById('info_span');
    infoSpan.innerHTML  = str;
    console.debug(str);
}

//--------------------------------------------------------------------------------------------------
function FadeOut()
{
    const fade = document.getElementById('fade');
    fade.style.animation = "fadeOut linear 2s";
}

//--------------------------------------------------------------------------------------------------
function SetResolution(showInfo = true)
{
    const container     = document.getElementById('container');
    const canvasSize    = container.getBoundingClientRect();
    //const canvasSize    = {width: window.innerWidth, height: window.innerHeight};

    const largestDim    = Math.max(canvasSize.width, canvasSize.height);
    const MAX_DIM       = 1600;
    const scale         = (largestDim > MAX_DIM) ? (MAX_DIM / largestDim) : 1;

    let w               = Math.floor(canvasSize.width);
    let h               = Math.floor(canvasSize.height);
    const aspectRatio   = w/h;

    if(w > h)
    {
        // landscape
        w = Math.floor(aspectRatio * h);
    }
    else
    {
        // portrait
        h = Math.floor(w / aspectRatio);
    }
    SDK3DVerse.setResolution(w, h, scale);

    if(showInfo)
    {
        SetInformation(`Setting resolution to ${w} x ${h} (scale=${scale})`);
    }
}

//--------------------------------------------------------------------------------------------------
async function Connect()
{
    SetInformation("Connecting to 3dverse...");

    const connectionInfo = await SDK3DVerse.webAPI.createOrJoinSession(AppConfig.sceneUUID);
    SDK3DVerse.setupDisplay(canvasElement);
    SDK3DVerse.startStreamer(connectionInfo);
    await SDK3DVerse.connectToEditor();

    SetInformation("Connection to 3dverse established...");
    return connectionInfo.sessionCreated;
}

//--------------------------------------------------------------------------------------------------
function bindMouseEvents()
{
    canvasElement.addEventListener('mousedown', onMouseDown);
}

//--------------------------------------------------------------------------------------------------
function onMouseDown()
{
    if(canvasClickCounter === 0)
    {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        mouseMoved = false;
    }

    canvasClickCounter++;
}

//--------------------------------------------------------------------------------------------------
async function onMouseUp(event)
{
    if(canvasClickCounter > 0 && --canvasClickCounter === 0)
    {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        if(mouseMoved)
        {
            document.exitPointerLock();
        }
    }

    if(event.button !== 0 || mouseMoved)
    {
        // if not main button or mouse moved then do nothing
        return;
    }

    const {entity, pickedPosition} = await SDK3DVerse.engineAPI.castScreenSpaceRay(event.clientX, event.clientY, false, false);
    if(entity)
    {
        toggleMaterial(entity);
    }
}

//--------------------------------------------------------------------------------------------------
function onMouseMove()
{
    window.removeEventListener('mousemove', onMouseMove);
    mouseMoved = true;
    canvasElement.requestPointerLock();
}

//--------------------------------------------------------------------------------------------------
function toggleMaterial(entity)
{
    if(!entity.isAttached('material_ref'))
    {
        return;
    }

    const materialComponent       = entity.getComponent('material_ref');
    let   { value: materialUUID } = materialComponent;
    let   currentMaterialIndex    = materials.findIndex(m => m.uuid === materialUUID);

    // if the materialUUID is not found then current currentMaterialIndex=-1+1=0
    ++currentMaterialIndex;
    // loop on the materials array
    currentMaterialIndex = currentMaterialIndex === materials.length ? 0 : currentMaterialIndex;

    materialUUID = materials[currentMaterialIndex].uuid;
    entity.setComponent('material_ref', { ...materialComponent, value: materialUUID });
    SDK3DVerse.engineAPI.propagateChanges();
}