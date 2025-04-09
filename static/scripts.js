let loadingData = false;
let isHorizontalLayout = false;

async function handleDirectoriesTab() {
    switchTab('directories');
    if (!loadingData) {
        await loadDirectories();
    }
}

async function forceReloadDirectories() {
    loadingData = false;
    await loadDirectories();
}

async function loadDirectories() {
    if (loadingData) return;
    
    loadingData = true;
    // Criar o loadingOverlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            Carregando dados dos diretórios...
            <p>Este processo pode demorar</p>
            <p>☕</p>
        </div>
    `;
    
    const directoriesDiv = document.getElementById('directories');
    const contentContainer = document.querySelector('.directory-content');
    
    // Limpar conteúdo anterior e adicionar loading
    contentContainer.innerHTML = '';
    directoriesDiv.prepend(loadingOverlay);
    loadingOverlay.style.display = 'flex';
    
    // Adicionar botão de atualizar primeiro
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.textContent = 'Atualizar';
    refreshBtn.onclick = forceReloadDirectories;
    contentContainer.appendChild(refreshBtn);

    try {
        // Primeiro carrega os mountpoints para criar os esqueletos
        const mountsResponse = await fetch('/data');
        const { mountpoints } = await mountsResponse.json();
        
        createSkeletons(mountpoints, contentContainer);
        
        // Agora carrega os dados completos
        const dirResponse = await fetch('/directory_data');
        const dirData = await dirResponse.json();
        
        await populateTables(dirData, contentContainer);
        
    } catch (error) {
        alert('Erro: ' + error);
    } finally {
        if (directoriesDiv.contains(loadingOverlay)) {
            directoriesDiv.removeChild(loadingOverlay);
        }
    }
}

function createSkeletons(mountpoints, container) {
    mountpoints.forEach(mp => {
        const skeleton = document.createElement('div');
        skeleton.className = 'table-wrapper skeleton';
        skeleton.innerHTML = `
            <h3 class="skeleton-title">${mp}</h3>
            <table class="skeleton-table">
                <tr><th>Diretório</th><th>Tamanho</th></tr>
                ${Array(5).fill().map(() => `
                    <tr>
                        <td><div class="skeleton-line"></div></td>
                        <td><div class="skeleton-line"></div></td>
                    </tr>
                `).join('')}
            </table>
        `;
        container.appendChild(skeleton);
    });
}

async function populateTables(data, container) {
    const wrappers = container.querySelectorAll('.table-wrapper');
    
    for (const [index, mp] of Object.keys(data).entries()) {
        if (wrappers[index]) {
            const wrapper = wrappers[index];
            wrapper.classList.remove('skeleton');
            wrapper.innerHTML = buildTableContent(mp, data[mp]);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

function buildTableContent(mp, data) {
    return `
        <h3>${mp} (${formatBytes(data.total_used)}) (${data.percent}%)</h3>
        <table border="1">
            <tr><th>Diretório</th><th>Tamanho</th></tr>
            ${(data.items || []).map(item => `
                <tr><td>${item.path}</td><td>${item.size}</td></tr>
            `).join('')}
        </table>
    `;
}

function formatBytes(bytes) {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(2)} GB`;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active-tab'));
    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active-tab');
}

function toggleLayout() {
    const container = document.querySelector('.charts-container');
    const btn = document.querySelector('.layout-btn');
    
    container.classList.toggle('horizontal');
    isHorizontalLayout = !isHorizontalLayout;
    
    btn.textContent = isHorizontalLayout 
        ? "Layout Vertical" 
        : "Layout Horizontal";
    
    window.dispatchEvent(new Event('resize'));
}