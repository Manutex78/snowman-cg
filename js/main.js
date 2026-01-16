import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// Código do Boneco de Neve
let boneco, chapeu, bracoEsq, bracoDir;

// Função para criar o boneco de neve na cena
function criarBoneco(scene) {
  // Cria um grupo para organizar todas as partes do boneco
  boneco = new THREE.Group();
  scene.add(boneco);

  // Materiais com propriedades realistas (baseado em materiais e luzes)
  const branco = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.0 });
  const preto = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9, metalness: 0.1 });
  const laranja = new THREE.MeshStandardMaterial({ color: 0xff8833, roughness: 0.7, metalness: 0.0, emissive: 0x331100 });
  const vermelho = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.6, metalness: 0.0 });
  const verde = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.0 });
  const azul = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.5, metalness: 0.0 });
  const vermelhoEscuro = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.8, metalness: 0.2 }); // vermelho escuro para o chapéu
  const marrom = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9, metalness: 0.1 });

  // Base do boneco (bola inferior)
  const base = new THREE.Mesh(new THREE.SphereGeometry(1.5), branco);
  base.position.y = 1.5;
  boneco.add(base);

  // Tronco do boneco (bola média)
  const tronco = new THREE.Mesh(new THREE.SphereGeometry(1.1), branco);
  tronco.position.y = 3.3;
  boneco.add(tronco);

  // Ombros para ligar os braços ao tronco
  const ombroEsq = new THREE.Mesh(new THREE.SphereGeometry(0.3), branco);
  ombroEsq.position.set(-1.0, 3.758, 0);
  boneco.add(ombroEsq);
  
  const ombroDir = new THREE.Mesh(new THREE.SphereGeometry(0.3), branco);
  ombroDir.position.set(1.0, 3.758, 0);
  boneco.add(ombroDir);

  // Botões decorativos no tronco
  const botoes = [vermelho, verde, azul];
  function botao(yoffset, cor) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), cor);
    b.position.set(0, 3.3 + yoffset, 1.0);
    b.castShadow = true;
    b.receiveShadow = true;
    return b;
  }
  boneco.add(botao(-0.25, vermelho), botao(0, verde), botao(0.25, azul));

  // Cabeça do boneco
  const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.7), branco);
  cabeca.position.y = 4.8;
  boneco.add(cabeca);

  // Braços simples (sem articulação)
  bracoEsq = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), marrom);
  bracoEsq.position.set(-1.5, 3.558, 0);
  bracoEsq.rotation.z = -Math.PI / 3; // diagonal para baixo-esquerda
  boneco.add(bracoEsq);
  
  bracoDir = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), marrom);
  bracoDir.position.set(1.5, 3.558, 0);
  bracoDir.rotation.z = Math.PI / 3; // diagonal para baixo-direita
  boneco.add(bracoDir);
  
  // Garantir sombras nos braços
  bracoEsq.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  bracoDir.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  // Olhos do boneco
  function olho(x) {
    const o = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      preto
    );
    o.position.set(x, 4.9, 0.6);
    return o;
  }
  boneco.add(olho(-0.2), olho(0.2));

  // Boca (três pontos)
  const boca1 = new THREE.Mesh(new THREE.SphereGeometry(0.03), preto);
  boca1.position.set(-0.1, 4.6, 0.65);
  const boca2 = new THREE.Mesh(new THREE.SphereGeometry(0.03), preto);
  boca2.position.set(0, 4.55, 0.65);
  const boca3 = new THREE.Mesh(new THREE.SphereGeometry(0.03), preto);
  boca3.position.set(0.1, 4.6, 0.65);
  boneco.add(boca1, boca2, boca3);

  // Nariz articulado (cenoura)
  const narizGroup = new THREE.Group();
  const nariz = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.6),
    laranja
  );
  nariz.rotation.x = Math.PI / 2;
  nariz.position.set(0, 0, 0);
  narizGroup.add(nariz);

  narizGroup.position.set(0, 4.8, 0.7);
  boneco.add(narizGroup);

  // Referência para animação
  boneco.userData.narizGroup = narizGroup;

  // Cachecol do boneco
  const cachecol = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.1, 8, 16),
    vermelho
  );
  cachecol.rotation.x = Math.PI / 2;
  cachecol.position.y = 4.2;
  boneco.add(cachecol);

  // Chapéu do boneco (ligado à hierarquia para derreter com o boneco)
  chapeu = new THREE.Group();
  const aba = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.1),
    vermelhoEscuro
  );
  const topo = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.8),
    vermelhoEscuro
  );
  topo.position.y = 0.45;
  chapeu.add(aba, topo);
  chapeu.position.set(0, 5.5, 0);
  scene.add(chapeu);

  // Sombras para todas as partes do boneco
  boneco.traverse(o => {
    if (o.isMesh) o.castShadow = true;
  });
}

// Código de Animações
let derreter = false; // Flag para animação de derretimento
let crescer = false; // Flag para animação de crescimento

// Poça de água para derretimento
const puddle = new THREE.Mesh(
  new THREE.CircleGeometry(1, 32),
  new THREE.MeshStandardMaterial({ 
    color: 0x4682B4, 
    transparent: true, 
    opacity: 0.6,
    side: THREE.DoubleSide
  })
);
puddle.rotation.x = -Math.PI / 2;
puddle.position.y = 0.01; // logo acima do chão
puddle.scale.set(0, 0, 0); // começar invisível

// Ativar derretimento
function setDerreter(v) {
  derreter = v;
}

function setCrescer(v) {
  crescer = v;
}

let chapeuNoChao = false;

function atualizarAnimacoes(t) {
  boneco.rotation.z = Math.sin(t) * 0.05;

  // Altura mínima do chapéu (chão)
  const ALTURA_CHAO_CHAPEU = 0.1;
  const ALTURA_CHAPEU = 5.4; // era 5.6

  if (!chapeuNoChao && boneco.scale.y < 0.2) {
    chapeuNoChao = true;
    chapeu.position.y = ALTURA_CHAO_CHAPEU;
  }

 if (!chapeuNoChao) {
  chapeu.position.x = boneco.position.x + Math.sin(t * 0.5) * 0.04;
  chapeu.position.z = boneco.position.z;
  chapeu.position.y = boneco.position.y + boneco.scale.y * ALTURA_CHAPEU + Math.sin(t * 0.5) * 0.06;

  chapeu.rotation.z = Math.sin(t * 0.5) * 0.15;
  }

  if (boneco.scale.y < 0.2) {
  chapeu.position.y = 0.1; // pousa no chão
  }

  if (chapeuNoChao) {
    chapeu.rotation.set(0, 0, 0);
  }

  // Animação do nariz articulado
  if (boneco.userData.narizGroup) {
    boneco.userData.narizGroup.rotation.z = Math.sin(t * 1.5) * 0.2;
  }

  if (derreter && boneco.scale.y > 0.1) {
    boneco.scale.y -= 0.002;
    boneco.position.y -= 0.002;
    // expandir poça
    const meltFactor = (1 - boneco.scale.y) / 0.9; // 0 to 1
    const puddleSize = meltFactor * 3;
    puddle.scale.set(puddleSize, puddleSize, puddleSize);
  }

  if (crescer && boneco.scale.y < 1) {
    boneco.scale.y += 0.002;
    boneco.position.y += 0.002;
    // encolher poça
    const growFactor = boneco.scale.y; // 0.1 to 1
    const puddleSize = Math.max(0, (1 - growFactor) / 0.9 * 3);
    puddle.scale.set(puddleSize, puddleSize, puddleSize);
    if (boneco.scale.y >= 1) {
      crescer = false;
      boneco.scale.set(1, 1, 1);
      boneco.position.y = 0;
      puddle.scale.set(0, 0, 0); // esconder poça
    }
  }
}

function restaurarBoneco() {
  derreter = false;
  crescer = true;
  chapeuNoChao = false;
}

// Ambiente code
// mover array de nuvens para escopo do módulo para que o atualizador possa acessá-lo
const clouds = [];
let _scene = null;
let sun, sunLight, moon, moonLight, ambientLight, sunDirectional;

// variáveis de neve
let snowPoints = null;
let positions = null;
let velocities = null;
const params = {
  count: 1500,
  area: 60,   // spread on X,Z
  height: 30, // spawn height range
};



// Função para criar o ambiente (árvores, flores, casas, montanhas, nuvens, sol, lua, neve)
function criarAmbiente(scene) {
  // Armazenar referência da cena para atualizadores de módulo
  _scene = scene;
  const branco = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const verde = new THREE.MeshStandardMaterial({ color: 0x2f5f2f });
  const castanho = new THREE.MeshStandardMaterial({ color: 0x6b4f2a });
  const rosa = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
  const amarelo = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const roxo = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
  const cinza = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const marrom = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

  function arbusto(x, z) {
    const a = new THREE.Group();
    const s = 0.6 + Math.random() * 1.0; // escala aleatória 0.6 - 1.6
    const base = new THREE.Mesh(new THREE.SphereGeometry(0.8 * s), verde);
    const neve = new THREE.Mesh(new THREE.SphereGeometry(0.85 * s, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), branco);
    neve.position.y = 0.2 * s;
    a.add(base, neve);
    // pequena variação na altura para que os arbustos não fiquem todos planos
    a.position.set(x, 0.6 * s + 0.15, z);
    a.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }});
    scene.add(a);
  }

  function arvore(x, z) {
    const a = new THREE.Group();
    const s = 0.8 + Math.random() * 1.0; // escala aleatória 0.8 - 1.8
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * s, 0.4 * s, 2 * s), castanho);
    tronco.position.y = 1 * s;
    const copa = new THREE.Mesh(new THREE.ConeGeometry(1.5 * s, 3 * s), verde);
    copa.position.y = 3 * s;
    const neve = new THREE.Mesh(new THREE.ConeGeometry(1.55 * s, 1.5 * s), branco);
    neve.position.y = 4 * s;
    a.add(tronco, copa, neve);
    a.position.set(x, 0, z);
    a.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }});
    scene.add(a);
  }

  // Adicionar mais elementos aleatórios
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    const dist = Math.sqrt(x*x + z*z);
    if (dist > 10) { // evitar área do boneco de neve
      arbusto(x, z);
    }
  }

  for (let i = 0; i < 12; i++) {
    const x = (Math.random() - 0.5) * 120;
    const z = (Math.random() - 0.5) * 120;
    const dist = Math.sqrt(x*x + z*z);
    if (dist > 15) {
      arvore(x, z);
    }
  }


  arbusto(-6, -4);
  arbusto(5, -3);
  arbusto(-4, 6);
  arbusto(6, 5);

  arvore(-10, -8);
  arvore(8, -9);
  arvore(-9, 9);
  arvore(9, 8);


  // --- NUVENS & SOL ---

  function nuvem(x, y, z, scale = 1) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });

    const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.3 * scale, 16, 16), mat);
    const c2 = new THREE.Mesh(new THREE.SphereGeometry(1.0 * scale, 16, 16), mat);
    const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.9 * scale, 16, 16), mat);

    c1.position.set(0, 0, 0);
    c2.position.set(1.4 * scale, 0.12 * scale, 0.3 * scale);
    c3.position.set(-1.4 * scale, 0.06 * scale, 0.2 * scale);

    g.add(c1, c2, c3);
    g.position.set(x, y, z);
    // deriva horizontal mais lenta
    g.userData.speed = 0.004 + Math.random() * 0.008;
    g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; }});
    scene.add(g);
    clouds.push(g);
  }

  function criarSol() {
    sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffee88 })
    );
    sun.position.set(12, 14, -20);
    sun.scale.set(1.5, 1.5, 1.5);
    _scene.add(sun);

    sunLight = new THREE.PointLight(0xffee88, 1.2, 200);
    sunLight.position.copy(sun.position);
    _scene.add(sunLight);

    // Reutilizar DirectionalLight existente se presente, caso contrário criar um
    sunDirectional = _scene.children.find(c => c.isDirectionalLight);
    if (!sunDirectional) {
      sunDirectional = new THREE.DirectionalLight(0xfff0cc, 1.0);
      sunDirectional.position.copy(sun.position);
      sunDirectional.castShadow = true;
      sunDirectional.shadow.mapSize.set(2048, 2048);
      sunDirectional.shadow.camera.near = 0.5;
      sunDirectional.shadow.camera.far = 200;
      sunDirectional.shadow.camera.left = -30;
      sunDirectional.shadow.camera.right = 30;
      sunDirectional.shadow.camera.top = 30;
      sunDirectional.shadow.camera.bottom = -30;
      _scene.add(sunDirectional);
      // garantir que o alvo esteja na cena para orientação correta das sombras
      sunDirectional.target.position.set(0, 0, 0);
      _scene.add(sunDirectional.target);
    } else {
      // garantir que lança sombra e está configurado
      sunDirectional.castShadow = true;
      sunDirectional.shadow.mapSize.set(2048, 2048);
    }
  }

  function criarLua() {
    moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xddeeff, emissive: 0x223344, transparent: true, opacity: 0.95 })
    );
    moon.position.set(-12, 14, 20);
    moon.scale.set(1.1, 1.1, 1.1);
    scene.add(moon);

    moonLight = new THREE.PointLight(0x99bbff, 0.4, 200);
    moonLight.position.copy(moon.position);
    scene.add(moonLight);
  }

  function criarNeve(scene) {
    const count = params.count;
    positions = new Float32Array(count * 3);
    velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[3 * i + 0] = (Math.random() - 0.5) * params.area; // x
      positions[3 * i + 1] = Math.random() * params.height + 0.1;  // y
      positions[3 * i + 2] = (Math.random() - 0.5) * params.area; // z
      velocities[i] = 0.01 + Math.random() * 0.04; // velocidade de queda
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xe0f0ff, // tom azul claro para neve
      size: 0.06,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    });

    snowPoints = new THREE.Points(geo, mat);
    snowPoints.frustumCulled = false; // continuar atualizando mesmo quando fora da câmera
    snowPoints.name = 'neve';
    scene.add(snowPoints);
  }

  // criar 3 nuvens em posições e tamanhos diferentes (mais largas e lentas)
  nuvem(-12, 12, -22, 2.6);
  nuvem(2, 14, -16, 2.2);
  nuvem(9, 11, -19, 3.0);

  criarSol();
  // criarLua(); // removido

  criarNeve(scene);

  // encontrar luz ambiente criada em main.js para modulá-la
  ambientLight = _scene.children.find(c => c.isAmbientLight);
  if (!ambientLight) { // fallback se não presente
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    _scene.add(ambientLight);
  } else {
    ambientLight.intensity = 0.4; // fixo
  }

}

// Função para atualizar o ciclo do dia e da noite
// function atualizarCicloDia(t) { ... } // removido

// atualizador de neve
let _time = 0;
function atualizarNeve() {
  if (!snowPoints) return;
  _time += 1 / 60;

  const pos = snowPoints.geometry.attributes.position.array;
  const count = pos.length / 3;

  for (let i = 0; i < count; i++) {
    const idx = 3 * i;

    // cair
    pos[idx + 1] -= velocities[i];

    // deriva horizontal suave para um aspeto natural
    pos[idx + 0] += Math.sin(_time + i) * 0.0015;
    pos[idx + 2] += Math.cos(_time * 0.5 + i) * 0.001;

    // respawn quando passar pelo chão (y <= 0)
    if (pos[idx + 1] < 0) {
      pos[idx + 0] = (Math.random() - 0.5) * params.area;
      pos[idx + 1] = params.height + Math.random() * 2;
      pos[idx + 2] = (Math.random() - 0.5) * params.area;
      velocities[i] = 0.01 + Math.random() * 0.04;
    }
  }

  snowPoints.geometry.attributes.position.needsUpdate = true;
  // subtle rotation for parallax
  snowPoints.rotation.y += 0.0005;
}

// exported updater to animate clouds (module-level)
function atualizarAmbiente(t) {
  for (const c of clouds) {
    c.position.x += c.userData.speed * Math.sin(t * 0.1 + c.position.z);
    // Envolve horizontalmente
    if (c.position.x > 40) c.position.x = -40;
    if (c.position.x < -40) c.position.x = 40;
  }

  // atualizarCicloDia(t); // removido
  atualizarNeve();
}

// Criação da cena
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // azul do céu estático

// Criação da câmera
export const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 4, 10);

// Criação do renderizador
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

/* SOMBRAS */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Adiciona o renderizador ao corpo do documento
document.body.appendChild(renderer.domElement);

// Variáveis para controle de teclas e movimento da câmera
let keys = {};
let cameraRotationX = 0;
let cameraRotationY = 0;
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Evento de pressionar tecla
document.addEventListener('keydown', (event) => {
  keys[event.code] = true;
});

// Evento de soltar tecla
document.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

// Evento de mouse pressionado (para câmera ou pick)
document.addEventListener('mousedown', (event) => {
  // Atualizar posição do mouse
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bolas);

  if (intersects.length > 0) {
    selectedBola = intersects[0].object;
    dragging = true;
    // Desabilitar rotação da câmera durante drag
    isMouseDown = false;
  } else {
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
  dragging = false;
  selectedBola = null;
});

// Evento de movimento do mouse (rotação da câmera ou drag)
document.addEventListener('mousemove', (event) => {
  // Atualizar posição do mouse
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (dragging && selectedBola) {
    // Arrastar a bola no plano do chão
    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    selectedBola.position.x = intersection.x;
    selectedBola.position.z = intersection.z;
    // Manter y no chão
    selectedBola.position.y = 0.25;
    // Parar rolagem
    selectedBola.userData.velX = 0;
    selectedBola.userData.velZ = 0;
  } else if (isMouseDown) {
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    cameraRotationY += deltaX * 0.002;
    cameraRotationX += deltaY * 0.002;
    cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationX));
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

// Evento de roda do mouse (zoom)
document.addEventListener('wheel', (event) => {
  camera.position.z += event.deltaY * 0.01;
  camera.position.z = Math.max(2, Math.min(20, camera.position.z));
});

let bolas = [];
const MAX_BOLAS = 10;

// Pick and Drag variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedBola = null;
let dragging = false;
let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // ground plane for dragging


/* LUZES */
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 30;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

/* CHÃO  */
const groundGeo = new THREE.PlaneGeometry(200, 200);

groundGeo.computeVertexNormals();
const ground = new THREE.Mesh(
  groundGeo,
  new THREE.MeshStandardMaterial({ color: 0xf0f8ff })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* OBJETOS */
criarBoneco(scene);
scene.add(puddle); // add puddle to scene
criarAmbiente(scene);

/* INPUT */
window.addEventListener("keydown", e => {
  console.log('keydown', e.code, e.key); // confimar tecla pressionada

  if (e.code === "Space") {
    e.preventDefault(); // prevenir scroll da página

    if (bolas.length >= MAX_BOLAS) {
      const bolaRemovida = bolas.shift(); // primeira bola criada
      scene.remove(bolaRemovida);
    }

    const bola = new THREE.Mesh(
      new THREE.SphereGeometry(0.25),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.8 })
    );
    // Launch from snowman's position with offset
    const launchOffset = new THREE.Vector3(0, 4, 1);
    bola.position.copy(boneco.position).add(launchOffset);
    bola.userData.velZ = 0.18 + (Math.random() - 0.5) * 0.3; // random forward/back
    bola.userData.velX = (Math.random() - 0.5) * 0.2; // random left/right
    bola.userData.velY = 0.2; // small upward kick
    bola.castShadow = true;
    scene.add(bola);
    bolas.push(bola);
    console.log('bola created', bola.position);
  }

  if (e.key === "m" || e.key === "M") setDerreter(true);
  if (e.key === "f" || e.key === "F") restaurarBoneco();
});

const LIMITE_BOLAS = 10; // limite de bolas na cena

function atualizarBola() {
  for (let i = bolas.length - 1; i >= 0; i--) {
    const bola = bolas[i];

    // Movimento
    bola.position.x += bola.userData.velX;
    bola.position.z += bola.userData.velZ;
    bola.userData.velY -= 0.01;
    bola.position.y += bola.userData.velY;

    // >>> AQUI entram os limites do campo <<<
    bola.position.x = Math.max(-LIMITE_BOLAS, Math.min(LIMITE_BOLAS, bola.position.x));
    bola.position.z = Math.max(-LIMITE_BOLAS, Math.min(LIMITE_BOLAS, bola.position.z));

    // Colisão com o chão
    if (bola.position.y <= 0.25) {
      bola.position.y = 0.25;
      bola.userData.velY = 0;
      bola.userData.velX = 0;
      bola.userData.velZ = 0;
    }

    // Colisão com o boneco
    const distToBoneco = bola.position.distanceTo(boneco.position);
    if (distToBoneco < 2.0) {
      bola.userData.velX = 0;
      bola.userData.velZ = 0;
      bola.userData.velY = 0;
    }
  }

  requestAnimationFrame(atualizarBola);
}

atualizarBola();

// Loop de animação principal
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();
  atualizarAnimacoes(t);
  atualizarAmbiente(t);

  // O chão segue a câmera para efeito infinito
  ground.position.x = camera.position.x;
  ground.position.z = camera.position.z;

  // Atualizar câmera baseada nas teclas pressionadas
  const moveSpeed = 0.1;

  // Movimento com WASD e setas
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // Manter no plano horizontal
  direction.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(direction, camera.up).normalize();

  if (keys['KeyW'] || keys['ArrowUp']) {
    camera.position.addScaledVector(direction, moveSpeed);
  }
  if (keys['KeyS'] || keys['ArrowDown']) {
    camera.position.addScaledVector(direction, -moveSpeed);
  }
  if (keys['KeyA'] || keys['ArrowLeft']) {
    camera.position.addScaledVector(right, -moveSpeed);
  }
  if (keys['KeyD'] || keys['ArrowRight']) {
    camera.position.addScaledVector(right, moveSpeed);
  }

  // Limitar área da câmera
  camera.position.x = Math.max(-30, Math.min(30, camera.position.x));
  camera.position.z = Math.max(-30, Math.min(30, camera.position.z));

  // Atualizar rotação da câmera 
  camera.rotation.y = cameraRotationY;
  camera.rotation.x = cameraRotationX;

  renderer.render(scene, camera);
}

animate();

// Ajustar câmera e renderizador ao redimensionar a janela
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
