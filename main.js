// ===============================
// Exportar resultados a Excel y PDF
// ===============================

// Genera una tabla lógica de decisión para exportar
function generarTablaExport(numWeeks, totalWeekCost, ivaMes, totalMesConIVA, marginConfigs) {
  let rows = [];
  rows.push(["Semanas", numWeeks]);
  rows.push(["Costo mensual sin margen", `$${totalWeekCost.toLocaleString()}`]);
  rows.push(["IVA (21%)", `$${ivaMes.toLocaleString()}`]);
  rows.push(["Total con IVA", `$${totalMesConIVA.toLocaleString()}`]);
  rows.push(["---", "---"]);
  marginConfigs.forEach(m => {
    const iva = m.value * 0.21;
    const totalConIVA = m.value + iva;
    rows.push([
      `Margen ${m.name}`,
      `Subtotal: $${m.value.toLocaleString()}`
    ]);
    rows.push([
      "IVA (21%)", `$${iva.toLocaleString()}`
    ]);
    rows.push([
      "Total con IVA", `$${totalConIVA.toLocaleString()}`
    ]);
    rows.push(["Presupuesto mensual", ""]); // separador
  });
  return rows;
}

// Exportar a Excel
document.getElementById("btnExportExcel").addEventListener("click", () => {
  // Recalcular para obtener los datos actuales
  const numWeeks = +document.getElementById("numWeeks").value;
  const ing = +document.getElementById("ingenieros").value;
  const tec = +document.getElementById("tecnicos").value;
  const valIng = +document.getElementById("valorIng").value;
  const valTec = +document.getElementById("valorTec").value;
  const valSup = +document.getElementById("valorSup").value;
  const hSem = +document.getElementById("horasSem").value;
  const diasSem = +document.getElementById("diasSem").value;
  const hFinde = +document.getElementById("horasFinde").value;
  const turnosFinde = +document.getElementById("turnosFinde").value;
  const viat = +document.getElementById("viaticos").value;
  const m1 = +document.getElementById("m1").value / 100;
  const m2 = +document.getElementById("m2").value / 100;
  const m3 = +document.getElementById("m3").value / 100;
  const m4 = +document.getElementById("m4").value / 100;

  let totalWeekCost = 0;
  for (let w = 0; w < numWeeks; w++) {
    const supName = document.getElementById(`week${w}_supervisor`).value;
    const supHours = +document.getElementById(`week${w}_supHours`).value;
    const turnoSem = (ing * valIng + tec * valTec) * hSem + viat + (supName ? valSup * supHours : 0);
    const totalSem = turnoSem * diasSem;
    const turnoFind = (ing * valIng + tec * valTec) * hFinde + viat;
    const totalFind = turnoFind * turnosFinde;
    const totalSemana = totalSem + totalFind;
    totalWeekCost += totalSemana;
  }
  const IVA_RATE = 0.21;
  const ivaMes = totalWeekCost * IVA_RATE;
  const totalMesConIVA = totalWeekCost + ivaMes;
  const marginConfigs = [
    { name: "25%", value: totalWeekCost * (1 + m1) },
    { name: "50%", value: totalWeekCost * (1 + m2) },
    { name: "75%", value: totalWeekCost * (1 + m3) },
    { name: "100%", value: totalWeekCost * (1 + m4) }
  ];
  const rows = generarTablaExport(numWeeks, totalWeekCost, ivaMes, totalMesConIVA, marginConfigs);
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Simulador");
  XLSX.writeFile(wb, "SimuladorGuardias.xlsx");
});

// Exportar a PDF
document.getElementById("btnExportPDF").addEventListener("click", () => {
  // Recalcular para obtener los datos actuales
  const numWeeks = +document.getElementById("numWeeks").value;
  const ing = +document.getElementById("ingenieros").value;
  const tec = +document.getElementById("tecnicos").value;
  const valIng = +document.getElementById("valorIng").value;
  const valTec = +document.getElementById("valorTec").value;
  const valSup = +document.getElementById("valorSup").value;
  const hSem = +document.getElementById("horasSem").value;
  const diasSem = +document.getElementById("diasSem").value;
  const hFinde = +document.getElementById("horasFinde").value;
  const turnosFinde = +document.getElementById("turnosFinde").value;
  const viat = +document.getElementById("viaticos").value;
  const m1 = +document.getElementById("m1").value / 100;
  const m2 = +document.getElementById("m2").value / 100;
  const m3 = +document.getElementById("m3").value / 100;
  const m4 = +document.getElementById("m4").value / 100;

  let totalWeekCost = 0;
  for (let w = 0; w < numWeeks; w++) {
    const supName = document.getElementById(`week${w}_supervisor`).value;
    const supHours = +document.getElementById(`week${w}_supHours`).value;
    const turnoSem = (ing * valIng + tec * valTec) * hSem + viat + (supName ? valSup * supHours : 0);
    const totalSem = turnoSem * diasSem;
    const turnoFind = (ing * valIng + tec * valTec) * hFinde + viat;
    const totalFind = turnoFind * turnosFinde;
    const totalSemana = totalSem + totalFind;
    totalWeekCost += totalSemana;
  }
  const IVA_RATE = 0.21;
  const ivaMes = totalWeekCost * IVA_RATE;
  const totalMesConIVA = totalWeekCost + ivaMes;
  const marginConfigs = [
    { name: "25%", value: totalWeekCost * (1 + m1) },
    { name: "50%", value: totalWeekCost * (1 + m2) },
    { name: "75%", value: totalWeekCost * (1 + m3) },
    { name: "100%", value: totalWeekCost * (1 + m4) }
  ];
  const rows = generarTablaExport(numWeeks, totalWeekCost, ivaMes, totalMesConIVA, marginConfigs);
  const doc = new window.jspdf.jsPDF();
  doc.text("Simulador de Guardias Técnicas", 14, 14);
  doc.autoTable({
    head: [["Concepto", "Valor"]],
    body: rows,
    startY: 22,
    theme: 'grid',
    styles: { fontSize: 10 }
  });
  doc.save("SimuladorGuardias.pdf");
});

// ===============================
// Simulador de Guardias Técnicas
// ===============================

// Nombres de los participantes
const engineerNames = ["Martinez Walter", "Baginay Lucas", "Mesa Carlos", "Tribulo Matias"];
const technicianNames = ["Garita Axel", "Villen Facundo", "Franco Alan", "Heimsath Ivan"];
const supervisorNames = ["Maximiliano Aguirre", "Esteban Correa", "Belen Santomil"];

// Tooltips para campos
const tooltips = {
  numWeeks: "Cantidad de semanas a simular en el mes.",
  ingenieros: "Cantidad de ingenieros por semana.",
  tecnicos: "Cantidad de técnicos por semana.",
  valorSup: "Valor por hora para el supervisor.",
  valorIng: "Valor por hora para cada ingeniero.",
  valorTec: "Valor por hora para cada técnico.",
  horasSem: "Cantidad de horas por turno semanal.",
  diasSem: "Cantidad de turnos semanales.",
  horasFinde: "Cantidad de horas por turno de fin de semana.",
  turnosFinde: "Cantidad de turnos de fin de semana.",
  viaticos: "Viáticos por jornada (opcional).",
  m1: "Margen de rentabilidad 1.",
  m2: "Margen de rentabilidad 2.",
  m3: "Margen de rentabilidad 3.",
  m4: "Margen de rentabilidad 4."
};

// Agrega tooltips y placeholders a los inputs
window.addEventListener('DOMContentLoaded', () => {
  Object.keys(tooltips).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.title = tooltips[id];
      if (el.type === 'number') {
        el.placeholder = tooltips[id];
      }
    }
  });
});

// Renderiza los selectores de semana
function renderWeekSelectors() {
  const numWeeks = +document.getElementById("numWeeks").value;
  const ing = +document.getElementById("ingenieros").value;
  const tec = +document.getElementById("tecnicos").value;
  let html = '';
  for (let w = 0; w < numWeeks; w++) {
    html += `<div class="week-section"><div class="week-title">Semana ${w+1}:</div>`;
    for (let i = 0; i < ing; i++) {
      html += `<label for="week${w}_engineer${i}">Ingeniero ${i+1}:</label>
        <select id="week${w}_engineer${i}" name="week${w}_engineer${i}">
          ${engineerNames.map(name => `<option>${name}</option>`).join('')}
        </select>`;
    }
    for (let i = 0; i < tec; i++) {
      html += `<label for="week${w}_technician${i}">Técnico ${i+1}:</label>
        <select id="week${w}_technician${i}" name="week${w}_technician${i}">
          ${technicianNames.map(name => `<option>${name}</option>`).join('')}
        </select>`;
    }
    // Supervisor selector y input horas
    html += `<label for="week${w}_supervisor">Supervisor:</label>
      <select id="week${w}_supervisor" name="week${w}_supervisor">
        <option value="">(Sin supervisor)</option>
        ${supervisorNames.map(name => `<option>${name}</option>`).join('')}
      </select>
      <label for="week${w}_supHours">Horas supervisor semana ${w+1}:</label>
      <input type="number" min="0" max="96" step="1" value="12" id="week${w}_supHours" name="week${w}_supHours" placeholder="Horas de supervisor" title="Cantidad de horas trabajadas por el supervisor en la semana">`;
    html += `</div>`;
  }
  document.getElementById("weeks-selector").innerHTML = html;
}

// Validación de campos obligatorios y valores
function validarCampos() {
  let errores = [];
  const campos = [
    { id: "numWeeks", min: 1, max: 6 },
    { id: "ingenieros", min: 0, max: 4 },
    { id: "tecnicos", min: 0, max: 4 },
    { id: "valorSup", min: 0 },
    { id: "valorIng", min: 0 },
    { id: "valorTec", min: 0 },
    { id: "horasSem", min: 1 },
    { id: "diasSem", min: 1 },
    { id: "horasFinde", min: 0 },
    { id: "turnosFinde", min: 0 },
    { id: "m1", min: 0 },
    { id: "m2", min: 0 },
    { id: "m3", min: 0 },
    { id: "m4", min: 0 }
  ];
  campos.forEach(c => {
    const el = document.getElementById(c.id);
    if (!el || el.value === "" || isNaN(+el.value) || (+el.value < (c.min ?? -Infinity)) || (+el.value > (c.max ?? Infinity))) {
      errores.push(`Campo inválido: ${el ? el.title || el.id : c.id}`);
    }
  });
  return errores;
}

// Botón calcular
document.getElementById("btnCalcular").addEventListener("click", () => {
  const errores = validarCampos();
  if (errores.length) {
    document.getElementById("output").innerHTML = `<div style='color:red; font-weight:bold;'>${errores.join('<br>')}</div>`;
    return;
  }
  calcular();
});

// Botón limpiar
document.getElementById("btnReset").addEventListener("click", () => {
  document.getElementById("weekForm").reset();
  renderWeekSelectors();
  document.getElementById("output").innerHTML = "";
});

// Inputs que afectan la cantidad de selectores de semana
document.querySelectorAll("#numWeeks, #ingenieros, #tecnicos").forEach(e => {
  e.addEventListener("change", renderWeekSelectors);
});

// Inicializar selectores al cargar
renderWeekSelectors();

// ===============================
// Lógica de cálculo (idéntica a la original, con comentarios)
// ===============================
function calcular() {
  // Leer valores de los inputs
  const numWeeks = +document.getElementById("numWeeks").value;
  const ing = +document.getElementById("ingenieros").value;
  const tec = +document.getElementById("tecnicos").value;
  const valIng = +document.getElementById("valorIng").value;
  const valTec = +document.getElementById("valorTec").value;
  const valSup = +document.getElementById("valorSup").value;
  const hSem = +document.getElementById("horasSem").value;
  const diasSem = +document.getElementById("diasSem").value;
  const hFinde = +document.getElementById("horasFinde").value;
  const turnosFinde = +document.getElementById("turnosFinde").value;
  const viat = +document.getElementById("viaticos").value;
  const m1 = +document.getElementById("m1").value / 100;
  const m2 = +document.getElementById("m2").value / 100;
  const m3 = +document.getElementById("m3").value / 100;
  const m4 = +document.getElementById("m4").value / 100;

  let earnings = {};
  [...engineerNames, ...technicianNames, ...supervisorNames].forEach(n => earnings[n] = 0);

  let weekHtml = '';
  let totalWeekCost = 0;

  for (let w = 0; w < numWeeks; w++) {
    let engs = [], techs = [], sups = [];
    for (let i = 0; i < ing; i++) {
      const name = document.getElementById(`week${w}_engineer${i}`).value;
      const engEarning = valIng * hSem * diasSem + valIng * hFinde * turnosFinde;
      earnings[name] += engEarning;
      engs.push(name);
    }
    for (let i = 0; i < tec; i++) {
      const name = document.getElementById(`week${w}_technician${i}`).value;
      const techEarning = valTec * hSem * diasSem + valTec * hFinde * turnosFinde;
      earnings[name] += techEarning;
      techs.push(name);
    }
    // Supervisor y sus horas
    const supName = document.getElementById(`week${w}_supervisor`).value;
    const supHours = +document.getElementById(`week${w}_supHours`).value;
    let supEarning = 0;
    if (supName) {
      supEarning = valSup * supHours;
      earnings[supName] += supEarning;
      sups.push({ name: supName, hours: supHours, earning: supEarning });
    }

    // Cálculo de costos semana (ingenieros, técnicos y supervisor)
    const turnoSem = (ing * valIng + tec * valTec) * hSem + viat + (supName ? valSup * supHours : 0);
    const totalSem = turnoSem * diasSem;
    const turnoFind = (ing * valIng + tec * valTec) * hFinde + viat; // supervisor solo suma las horas semanales personalizadas
    const totalFind = turnoFind * turnosFinde;
    const totalSemana = totalSem + totalFind;
    totalWeekCost += totalSemana;

    let rows = '';
    engs.forEach(n => rows += `<div class="member-row"><span class="engineer-name member-name">${n}</span> gana <b>$${(valIng * hSem * diasSem + valIng * hFinde * turnosFinde).toLocaleString()}</b> esta semana</div>`);
    techs.forEach(n => rows += `<div class="member-row"><span class="technician-name member-name">${n}</span> gana <b>$${(valTec * hSem * diasSem + valTec * hFinde * turnosFinde).toLocaleString()}</b> esta semana</div>`);
    sups.forEach(sup => rows += `<div class="member-row"><span class="supervisor-name member-name">${sup.name}</span> gana <b>$${sup.earning.toLocaleString()}</b> por ${sup.hours} hs esta semana</div>`);

    rows += `<div class="week-cost">Costo total equipo semana ${w+1}: <b>$${totalSemana.toLocaleString()}</b></div>`;
    weekHtml += `<div class="week-box"><div class="week-label">Semana ${w+1}:</div>${rows}</div>`;
  }

  // IVA
  const IVA_RATE = 0.21;
  const ivaMes = totalWeekCost * IVA_RATE;
  const totalMesConIVA = totalWeekCost + ivaMes;

  const summary = `
    <div class="results-summary">
      <div>
        <div class="summary-title">Costo total del mes (sin margen):</div>
        <div class="summary-item">Subtotal: $${totalWeekCost.toLocaleString()}</div>
        <div class="summary-item">IVA (21%): $${ivaMes.toLocaleString()}</div>
        <div class="summary-item" style="font-weight:bold; color:#e97132;">Total con IVA: $${totalMesConIVA.toLocaleString()}</div>
      </div>
    </div>`;

  const marginConfigs = [
    { name: "25%", color: "#e97132", value: totalWeekCost * (1 + m1), emoji: "📊" },
    { name: "50%", color: "#28a745", value: totalWeekCost * (1 + m2), emoji: "📊" },
    { name: "75%", color: "#ffd33d", value: totalWeekCost * (1 + m3), emoji: "📊" },
    { name: "100%", color: "#d73a49", value: totalWeekCost * (1 + m4), emoji: "📊" }
  ];

  const resultBoxes = marginConfigs.map(m => {
    const iva = m.value * IVA_RATE;
    const totalConIVA = m.value + iva;
    return `
    <div class="result-card" style="border-left:8px solid ${m.color};margin-bottom:8px;">
      <div class="result-title">${m.emoji} Margen ${m.name}</div>
      <div class="result-number" style="color:${m.color};">Subtotal: $${m.value.toLocaleString()}</div>
      <div class="result-label">IVA (21%): $${iva.toLocaleString()}</div>
      <div class="result-label" style="font-weight:bold; color:${m.color};">Total con IVA: $${totalConIVA.toLocaleString()}</div>
      <div class="result-label">Presupuesto mensual</div>
    </div>
    `;
  }).join('');

  let earningsRows = '';
  for (const [name, amount] of Object.entries(earnings)) {
    if (amount > 0) {
      let roleClass = engineerNames.includes(name) ? "engineer-name" :
                      technicianNames.includes(name) ? "technician-name" : "supervisor-name";
      earningsRows += `<div class="earnings-row"><span class="${roleClass} member-name">${name}</span> gana <span>$${amount.toLocaleString()}</span> en el mes</div>`;
    }
  }

  const earningsBox = `
    <div class="earnings-resume">
      <div style="font-weight:bold; margin-bottom:10px;">💵 Resumen de ganancias individuales</div>
      ${earningsRows}
    </div>
  `;

  const output = `
    <h2 style="color:#e97132;">🧮 Resumen del Simulador</h2>
    ${summary}
    <h3 style="margin-top:22px;color:#e97132;">💰 Presupuestos según margen</h3>
    <div class="results-resume">${resultBoxes}</div>
    <div class="week-results">${weekHtml}</div>
    ${earningsBox}
  `;

  document.getElementById("output").innerHTML = output;
}
