let dataLoaded = false;
let isHorizontalLayout = false;

async function handleDirectoriesTab() {
    switchTab('directories');
    if (!dataLoaded) {
        await loadDirectories();
    }
}

async function forceReloadDirectories() {
    dataLoaded = false;
    await loadDirectories();
}

async function loadDirectories() {
    if (dataLoaded) return;
    
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
        const response = await fetch('/directory_data');
        const data = await response.json();
        
        for (const mp of Object.keys(data)) {
            // Criar elementos dinamicamente
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            
            const title = document.createElement('h3');
            title.textContent = `${mp} (Total Usado: ${formatBytes(data[mp].total_used)}) (${data[mp].percent}%)`;
            
            const table = document.createElement('table');
            table.border = 1;
            
            // Criar cabeçalho
            const headerRow = table.insertRow();
            headerRow.insertCell().textContent = 'Diretório';
            headerRow.insertCell().textContent = 'Tamanho';
            
            // Adicionar linhas
            (data[mp].items || []).forEach(item => {
                const row = table.insertRow();
                row.insertCell().textContent = item.path;
                row.insertCell().textContent = item.size;
            });
            
            // Montar estrutura
            wrapper.appendChild(title);
            wrapper.appendChild(table);
            contentContainer.appendChild(wrapper);
            
            // Adicionar linha separadora
            contentContainer.appendChild(document.createElement('hr'));
            
            // Pequeno delay para visualização progressiva (opcional)
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        dataLoaded = true;
    } catch (error) {
        alert('Erro: ' + error);
    } finally {
        if (directoriesDiv.contains(loadingOverlay)) {
            directoriesDiv.removeChild(loadingOverlay);
        }
    }
}

/* async function loadDirectories() {
    if (dataLoaded) return;
    
    // Criar elemento de loading dinamicamente
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            Carregando dados dos diretórios...
            <p>  Este processo pode demorar  </p>
            <p> ☕ </p>
        </div>
    `;
    
    // Adicionar o loading antes do conteúdo existente
    const directoriesDiv = document.getElementById('directories');
    directoriesDiv.prepend(loadingOverlay);
    loadingOverlay.style.display = 'flex';

    try {
        const response = await fetch('/directory_data');
        const data = await response.json();
        
        let html = `<button class="refresh-btn" onclick="forceReloadDirectories()">Atualizar</button>`;
        for (const mp of Object.keys(data)) {
            const totalUsed = formatBytes(data[mp].total_used);
            const percent = data[mp].percent;
            html += `
                <div class="table-wrapper">
                    <h3>${mp} (Total Usado: ${totalUsed}) (${percent}%)</h3>
                    <table border="1">
                        <tr><th>Diretório</th><th>Tamanho</th></tr>
                        ${(data[mp].items || []).map(item => `
                            <tr><td>${item.path}</td><td>${item.size}</td></tr>
                        `).join('')}
                    </table>
                </div>
                <hr>
            `;
        }
        
        document.querySelector('.directory-content').innerHTML = html;
        dataLoaded = true;
    } catch (error) {
        alert('Erro: ' + error);
    } finally {
        // Remover o loading após conclusão
        if (directoriesDiv.contains(loadingOverlay)) {
            directoriesDiv.removeChild(loadingOverlay);
        }
    }
} */

/* async function loadDirectories() {
    if (dataLoaded) return;
    
    document.getElementById('loading').style.display = 'flex';
    try {
        const response = await fetch('/directory_data');
        const data = await response.json();
        
        let html = `<button class="refresh-btn" onclick="forceReloadDirectories()">Atualizar</button>`;
        for (const mp of Object.keys(data)) {
            const totalUsed = formatBytes(data[mp].total_used);
            const percent = data[mp].percent;
            html += `
                <h3>${mp} (Total Usado: ${totalUsed}) (${percent}%)</h3>
                <table border="1">
                    <tr><th>Diretório</th><th>Tamanho</th></tr>
                    ${(data[mp].items || []).map(item => `
                        <tr><td>${item.path}</td><td>${item.size}</td></tr>
                    `).join('')}
                </table>
                <hr>
            `;
        }
        
        document.getElementById('directories').innerHTML = html;
        dataLoaded = true;
    } catch (error) {
        alert('Erro: ' + error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
} */

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