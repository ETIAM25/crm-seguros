// 1. BASE DE DATOS E INICIALIZACIÓN
let db = JSON.parse(localStorage.getItem('crm_data')) || {
    clientes: [
        { id: 1, fecha: "13/05/2026", nombre: "Esteban Martiarena", vehiculo: "VW Gol Trend", matricula: "94521", cia: "Rivadavia", estado: "Activo", totalReferencia: "15000" }
    ],
    estadisticas: { ventas: 450200, activas: 1, siniestros: 0 }
};

function guardarEnLocalStorage() {
    localStorage.setItem('crm_data', JSON.stringify(db));
}

// 2. FUNCIÓN DE NAVEGACIÓN (Controla qué se ve en pantalla)
function navegar(seccion, elemento) {
    // Marcamos el botón activo en el menú lateral
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if(elemento) elemento.classList.add('active');

    const contenedor = document.getElementById('contenedor-principal');

    switch(seccion) {
        case 'dashboard':
            contenedor.innerHTML = `
                <h1>Dashboard</h1>
                <div class="stats-grid">
                    <div class="stat-card"><h3>Ventas Totales</h3><div class="value">$ ${db.estadisticas.ventas.toLocaleString('es-AR')}</div></div>
                    <div class="stat-card"><h3>Pólizas / Cotizaciones</h3><div class="value">${db.clientes.length}</div></div>
                </div>
                <section class="card">
                    <span class="card-title">Últimos Movimientos</span>
                    <ul class="feature-list">
                        ${db.clientes.slice(-5).reverse().map(c => `
                            <li class="feature-item"><strong>${c.nombre}</strong> - ${c.vehiculo} <span class="status-check">${c.estado}</span></li>
                        `).join('')}
                    </ul>
                </section>`;
            break;

        case 'clientes':
            contenedor.innerHTML = `
                <h1>Cartera de Clientes / Presupuestos</h1>
                <section class="card">
                    <table class="recent-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Matrícula</th>
                                <th>Vehículo</th>
                                <th>Compañía</th>
                                <th>Precio Ref.</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${db.clientes.map(c => `
                                <tr>
                                    <td>${c.fecha}</td>
                                    <td><strong>${c.nombre}</strong></td>
                                    <td><small>${c.matricula || '---'}</small></td>
                                    <td>${c.vehiculo}</td>
                                    <td>${c.cia || (c.detalles ? c.detalles[0].compania : 'N/A')}</td>
                                    <td>$ ${parseFloat(c.totalReferencia || 0).toLocaleString('es-AR')}</td>
                                    <td><span class="badge" style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:10px; font-size:12px;">${c.estado}</span></td>
                                </tr>
                            `).reverse().join('')} 
                        </tbody>
                    </table>
                </section>`;
            break;

        case 'cotizacion':
            contenedor.innerHTML = `
                <div class="header-cotizacion" style="display:flex; justify-content:space-between; align-items:center;">
                    <h1>Nueva Cotización Pro</h1>
                    <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir PDF</button>
                </div>
                <section class="card">
                    <span class="card-title">Datos del Asegurado</span>
                    <div class="grid-inputs">
                        <div class="form-group"><label>Asegurado</label><input type="text" id="nom" placeholder="Nombre completo"></div>
                        <div class="form-group"><label>Vehículo / Año</label><input type="text" id="veh" placeholder="Ej: VW Amarok 2024"></div>
                        <div class="form-group"><label>N° Matrícula Productor</label><input type="text" id="matricula" placeholder="Ej: 94521"></div>
                    </div>
                </section>
                <div class="insurance-grid">
                    ${[1, 2].map(i => `
                        <article class="card company-card">
                            <div class="company-header">
                                <select class="cia-select">
                                    <option>Federación Patronal</option>
                                    <option>Mercantil Andina</option>
                                    <option>Rivadavia</option>
                                    <option>Sancor</option>
                                </select>
                                <div class="price-tag">$ <input type="number" class="precio-input" placeholder="0.00"></div>
                            </div>
                            <div class="feature-list">
                                <div class="feature-item">Resp. Civil <input type="checkbox" checked></div>
                                <div class="feature-item">Robo/Incendio <input type="checkbox" checked></div>
                                <div class="feature-item">Granizo <input type="checkbox"></div>
                                <div class="feature-item">Cristales <input type="checkbox"></div>
                            </div>
                        </article>
                    `).join('')}
                </div>
                <div class="actions-bar" style="margin-top:20px; text-align:right;">
                    <button class="btn" style="background:#10b981; color:white;" onclick="ejecutarGuardado()">✅ Guardar en CRM</button>
                </div>`;
            break;

        case 'polizas':
            contenedor.innerHTML = `
                <h1>Gestión de Pólizas Vigentes</h1>
                <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                    <button class="btn" style="background: #1a56db; color: white;">Todas</button>
                    <button class="btn" style="background: #fff; border: 1px solid #ddd;">Vencen pronto</button>
                </div>
                <section class="card">
                    <table class="recent-table">
                        <thead>
                            <tr>
                                <th>N° Póliza</th>
                                <th>Asegurado</th>
                                <th>Compañía</th>
                                <th>Vigencia Hasta</th>
                                <th>Cuota</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${db.clientes.map(c => `
                                <tr>
                                    <td><small>#${Math.floor(Math.random() * 1000000)}</small></td>
                                    <td><strong>${c.nombre}</strong></td>
                                    <td>${c.cia || 'S/D'}</td>
                                    <td>13/05/2027</td>
                                    <td>$ ${parseFloat(c.totalReferencia || 0).toLocaleString('es-AR')}</td>
                                    <td><span class="badge" style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:10px;">Vigente</span></td>
                                    <td>
                                        <button onclick="alert('Descargando...')" style="border:none; background:none; cursor:pointer;">📄</button>
                                        <button onclick="alert('Enviando WhatsApp...')" style="border:none; background:none; cursor:pointer;">📲</button>
                                    </td>
                                </tr>
                            `).reverse().join('')} 
                        </tbody>
                    </table>
                </section>`;
            break;
    }
}

// 3. LÓGICA DE PROCESAMIENTO
function ejecutarGuardado() {
    const nom = document.getElementById('nom').value;
    const veh = document.getElementById('veh').value;
    const mat = document.getElementById('matricula').value;

    if(!nom || !veh) return alert("⚠️ Completa el nombre y vehículo.");

    const tarjetas = document.querySelectorAll('.company-card');
    const opciones = Array.from(tarjetas).map(t => ({
        compania: t.querySelector('.cia-select').value,
        precio: t.querySelector('.precio-input').value || "0"
    }));

    const nuevo = { 
        id: Date.now(), 
        fecha: new Date().toLocaleDateString(),
        nombre: nom, 
        vehiculo: veh, 
        matricula: mat,
        cia: opciones[0].compania,
        totalReferencia: opciones[0].precio,
        detalles: opciones,
        estado: "Cotizado" 
    };

    db.clientes.push(nuevo);
    db.estadisticas.ventas += parseFloat(nuevo.totalReferencia);
    
    guardarEnLocalStorage();
    alert("✅ Guardado con éxito.");
    
    // Redirigir a clientes para ver el resultado
    navegar('clientes', document.querySelectorAll('.nav-item')[1]);
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    navegar('dashboard', document.querySelector('.nav-item.active'));
});