import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

function loadScript(name) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(name, import.meta.url);
    script.onload = resolve; script.onerror = () => { script.remove(); reject(new Error('Missing ' + name)); };
    document.head.append(script);
  });
}
let dataPromise;
async function data() {
  if (!dataPromise) dataPromise = Promise.all([loadScript('host.js'), loadScript('solar_data.js'), loadScript('solar.js')]).catch(e => { dataPromise = null; throw e; });
  await dataPromise;
}
const matrix = rows => new THREE.Matrix4().set(...rows.flat());
function boxMatrix(part) {
  const mid = part.min.map((v,i) => (v + part.max[i])/2);
  const size = part.min.map((v,i) => part.max[i]-v);
  return new THREE.Matrix4().compose(new THREE.Vector3(...mid),new THREE.Quaternion(),new THREE.Vector3(...size));
}
export async function mount(target, plant) {
  await data();
  if (!target.isConnected || !target.closest("dialog")?.open) return;
  const host = window.TOWER_HOST;
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0xeef0e7);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38,1,.1,2000); camera.up.set(0,0,1);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping = false; controls.minDistance=2; controls.maxDistance=650;
  const hemi = new THREE.HemisphereLight(0xffffff,0x888888,1.8); hemi.position.set(0,0,150); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff,1.8); sun.position.set(-80,-100,180); scene.add(sun);
  const cube = new THREE.BoxGeometry(1,1,1);
  const materials = [];
  const basic = color => {const m = new THREE.MeshStandardMaterial({color,roughness:.9});materials.push(m);return m;};
  const addBoxes = (parts,parent=scene) => {
    const mesh = new THREE.InstancedMesh(cube,basic(0xffffff),parts.length);
    parts.forEach((p,i)=>{mesh.setMatrixAt(i,boxMatrix(p));mesh.setColorAt(i,new THREE.Color(p.presentationColor || p.color));}); mesh.instanceMatrix.needsUpdate=true; parent.add(mesh); return mesh;
  };
  const tower = addBoxes(host.voxels.map(p=>({...p,presentationColor:'#ffffff'}))); tower.userData.ids=host.voxels.map(p=>p.id);
  const context = new THREE.Group(); scene.add(context); addBoxes(host.context,context);
  addBoxes(host.site);
  for (const kind of ['slab','railing']) {
    const parts = host.balconyParts.filter(p=>p.kind===kind);
    const mesh = new THREE.InstancedMesh(cube,basic(0xffffff),parts.length*host.placements.length);
    let i=0;
    for(const placement of host.placements) for(const part of parts) {mesh.setMatrixAt(i,matrix(placement.transform).multiply(boxMatrix(part)));mesh.setColorAt(i,new THREE.Color(part.color));i++;}
    mesh.instanceMatrix.needsUpdate=true;scene.add(mesh);
  }
  // Exact cell outlines reveal the original grid without shrinking the source cubes.
  const lines=[];
  for(let z=0;z<=100;z+=4) lines.push(0,0,z,32,0,z,32,0,z,32,32,z,32,32,z,0,32,z,0,32,z,0,0,z);
  for(let a=0;a<=32;a+=4) lines.push(a,0,0,a,0,100,a,32,0,a,32,100,0,a,0,0,a,100,32,a,0,32,a,100);
  for(let a=0;a<=32;a+=4) lines.push(a,0,100,a,32,100,0,a,100,32,a,100);
  const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
  const lineMat=new THREE.LineBasicMaterial({color:0xc0c2c3});scene.add(new THREE.LineSegments(lineGeo,lineMat));
  target.replaceChildren(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Unplanted architectural baseline, 384 balconies and numbered voxels');
  let disposed=false;
  function render(){if(!disposed) renderer.render(scene,camera);}
  function resize(){if(disposed)return;const w=target.clientWidth,h=target.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
  function view(name){
    if(name==='balcony'){camera.position.set(12,-17,10);controls.target.set(6,-1,6);}
    else if(name==='context'){camera.position.set(270,-310,260);controls.target.set(16,16,25);}
    else{camera.position.set(140,-170,115);controls.target.set(16,16,48);}
    controls.update();render();
    target.closest('.tower-preview').querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===name)));
  }
  const root=target.closest('.tower-preview');
  const raycaster=new THREE.Raycaster();let pointerDown;
  renderer.domElement.addEventListener('pointerdown',event=>{pointerDown=[event.clientX,event.clientY];});
  renderer.domElement.addEventListener('pointerup',event=>{
    if(!pointerDown || Math.hypot(event.clientX-pointerDown[0],event.clientY-pointerDown[1])>5)return;
    const box=renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(2*(event.clientX-box.left)/box.width-1,1-2*(event.clientY-box.top)/box.height),camera);
    const hit=raycaster.intersectObject(tower)[0];
    if(hit){voxelInput.value=tower.userData.ids[hit.instanceId];root.querySelector('.voxel-inspector').open=true;selectVoxel();}
  });
  const selectedGeo=new THREE.EdgesGeometry(new THREE.BoxGeometry(4.04,4.04,4.04));
  const selectedMat=new THREE.LineBasicMaterial({color:0xe36925,depthTest:false});
  const selectedBox=new THREE.LineSegments(selectedGeo,selectedMat);selectedBox.renderOrder=10;selectedBox.visible=false;scene.add(selectedBox);
  const voxelInput=root.querySelector('#tower-voxel');
  const list=root.querySelector('#tower-voxel-ids');
  host.voxels.forEach(v=>{const opt=document.createElement('option');opt.value=v.id;list.append(opt);});
  function selectVoxel(focus=false){
    const id=voxelInput.value.trim().toLowerCase();const voxel=host.voxels.find(v=>v.id===id);
    if(!voxel){root.querySelector('#tower-voxel-info').textContent='Enter a valid voxel ID: 1–64 with a level suffix a–y, for example 2b.';return;}
    window.towerSelectedVoxel=id;selectedBox.position.set(...voxel.min.map((v,i)=>(v+voxel.max[i])/2));selectedBox.visible=true;
    const attachments=host.placements.filter(p=>p.entryVoxel===id);
    root.querySelector('#tower-voxel-info').textContent='Voxel '+id+' · elevation '+voxel.min[2]+'–'+voxel.max[2]+' m · '+(attachments.length ? attachments.map(p=>p.face+' face, bay '+p.bay+' balcony').join('; ') : 'No balcony entry at this cell')+'. Selection stays fixed when species changes.';
    if(focus){controls.target.copy(selectedBox.position);camera.position.copy(selectedBox.position).add(new THREE.Vector3(selectedBox.position.x<16?-18:18,selectedBox.position.y<16?-24:24,12));controls.update();}
    window.renderTowerSolar?.(id,root.querySelector('#tower-solar'));
    window.updatePlantSolarVoxel?.(id);
    render();
  }
  voxelInput.onchange=()=>selectVoxel();voxelInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();selectVoxel(true);}};
  root.addEventListener('tower-voxel-jump',e=>{voxelInput.value=e.detail.id;root.querySelector('.voxel-inspector').open=true;selectVoxel(true);});
  root.querySelector('#tower-spotlight').onclick=()=>selectVoxel(true);
  root.querySelector('#tower-clear-voxel').onclick=()=>{window.towerSelectedVoxel=null;voxelInput.value='';selectedBox.visible=false;root.querySelector('#tower-voxel-info').textContent='Select an original 4 m cell to locate it on the tower.';root.querySelector('#tower-solar').replaceChildren();render();};
  root.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>view(b.dataset.camera));
  root.querySelector('#tower-context').onchange=e=>{context.visible=e.target.checked;render();};
  root.querySelector('#tower-rotate').onclick=()=>{camera.position.sub(controls.target).applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/4).add(controls.target);controls.update();render();};
  controls.addEventListener('change',render);
  const observer=new ResizeObserver(resize);observer.observe(target);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();root.querySelector('#tower-status').textContent='3D context lost. Reopen the Tower view to reload.';});
  root.querySelector('#tower-status').textContent='Unplanted architectural baseline · 1,600 cells · 384 balconies · 64 surrounding buildings.';
  root.querySelector('#tower-fit').textContent='Selected species: '+plant.name+'. Planted tower views use native fixed renders; this interactive host remains unplanted.'+(plant.route?' Catalogue placement guidance: '+plant.route:'');
  root.querySelector('#tower-source').textContent='Architectural source SHA-256: '+host.provenance.sha256+'. Exact source box geometry and saved occurrence transforms. White tower presentation finish as requested; original display colours retained for other parts. Plants are not part of this baseline.';
  window.__towerPreview={id:plant.id,planted:false,instances:host.placements.length,voxels:host.voxels.length,context:host.context.length};
  function dispose(){
    if(disposed)return;window.towerCameraState={position:camera.position.toArray(),target:controls.target.toArray()};disposed=true;observer.disconnect();controls.dispose();
    cube.dispose();lineGeo.dispose();lineMat.dispose();selectedGeo.dispose();selectedMat.dispose();materials.forEach(m=>m.dispose());
    renderer.dispose();renderer.forceContextLoss();window.__towerPreview=null;
  }
  window.disposeTowerPreview=dispose;
  view('tower');resize();
  if(window.towerCameraState){camera.position.fromArray(window.towerCameraState.position);controls.target.fromArray(window.towerCameraState.target);controls.update();render();}
  window.renderTowerSolar?.(window.towerSelectedVoxel || '1a',root.querySelector('#tower-solar'));
  if(window.towerSelectedVoxel){voxelInput.value=window.towerSelectedVoxel;selectVoxel();}
}


