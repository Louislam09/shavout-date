// All JavaScript from the <script> block in index.html
// ... existing code ...
// (Paste the entire script block here, without <script> tags)

// Global variables
let currentMode = "mode1";
let calculatedDates = [];

// Base dates for 2025 - Adjusted to ensure Pentecost falls on June 1st
const BASE_DATES = {
  passover: new Date(2025, 3, 10), // April 10, 2025 (Nissan 14)
  unleavenedBread: new Date(2025, 3, 12), // April 12, 2025 (Nissan 15)
  waveOffering: new Date(2025, 3, 13), // April 13, 2025 (Nissan 16 - Wave Offering)
  lastUnleavenedBread: new Date(2025, 3, 18), // April 18, 2025 (Nissan 22)
  firstSabbath: new Date(2025, 3, 13), // April 13, 2025 (Nissan 16)
  pentecost: new Date(2025, 5, 1), // June 1, 2025 (Pentecost)
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Utility functions
function getNextSunday(date) {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  result.setDate(result.getDate() + daysUntilSunday);
  return result;
}

function getNextSaturday(date) {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek + 7) % 7;
  result.setDate(result.getDate() + daysUntilSaturday);
  return result;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getOrdinal(num) {
  const ordinals = ["", "1º", "2º", "3º", "4º", "5º", "6º", "7º"];
  return ordinals[num] || `${num}º`;
}

// Calculate dates based on mode
function calculateDates() {
  calculatedDates = [];

  // Add base dates
  calculatedDates.push(
    { date: BASE_DATES.passover, label: "Pesaj (Nissan 14)", type: "base" },
    {
      date: BASE_DATES.unleavenedBread,
      label: "Primer día de los panes sin levadura (Nissan 15)",
      type: "base",
    },
    {
      date: BASE_DATES.waveOffering,
      label: "Día de la Ofrenda Mecida (Nissan 16)",
      type: "base",
    },
    {
      date: BASE_DATES.lastUnleavenedBread,
      label: "Último día de los panes sin levadura (Nissan 22)",
      type: "base",
    },
    {
      date: BASE_DATES.firstSabbath,
      label: "Primer Shabat después de Nissan 15",
      type: "base",
    }
  );

  if (currentMode === "mode1") {
    // Calculate backwards from Pentecost to get the start date
    const pentecost = new Date(BASE_DATES.pentecost);
    const startSunday = addDays(pentecost, -49); // 49 days before Pentecost

    for (let week = 0; week < 7; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = addDays(startSunday, week * 7 + day);
        calculatedDates.push({
          date: currentDate,
          label: `Semana ${week + 1}, Día ${day + 1}`,
          type: "counting",
          weekNumber: week + 1,
          dayNumber: week * 7 + day + 1,
        });
      }
    }

    calculatedDates.push({
      date: pentecost,
      label: "Pentecostés (50º día)",
      type: "pentecost",
    });
  } else if (currentMode === "mode2") {
    // Calculate backwards from Pentecost to get the first Sabbath
    const pentecost = new Date(BASE_DATES.pentecost);
    const seventhSabbath = addDays(pentecost, -1); // Day before Pentecost
    const firstSabbath = addDays(seventhSabbath, -42); // 6 weeks before seventh Sabbath

    let currentSabbath = new Date(firstSabbath);

    for (let i = 0; i < 7; i++) {
      calculatedDates.push({
        date: new Date(currentSabbath),
        label: `${getOrdinal(i + 1)} Shabat`,
        type: "sabbath",
        weekNumber: i + 1,
      });
      currentSabbath = addDays(currentSabbath, 7);
    }

    calculatedDates.push({
      date: pentecost,
      label: "Pentecostés (día después del 7º Shabat)",
      type: "pentecost",
    });
  } else if (currentMode === "mode3") {
    // Calculate backwards from Pentecost to get the start date
    const pentecost = new Date(BASE_DATES.pentecost);
    const startDate = addDays(pentecost, -49); // 49 days before Pentecost

    for (let day = 1; day <= 50; day++) {
      const currentDate = addDays(startDate, day - 1);
      const weekNumber = Math.ceil(day / 7);

      if (day === 50) {
        calculatedDates.push({
          date: pentecost,
          label: "Pentecostés (50º día desde Nissan 16)",
          type: "pentecost",
        });
      } else {
        calculatedDates.push({
          date: currentDate,
          label: `Día ${day} de 50`,
          type: "counting",
          weekNumber: weekNumber,
          dayNumber: day,
        });
      }
    }
  }
}

function getDateInfo(date) {
  return calculatedDates.find((d) => isSameDay(d.date, date));
}

function getDayClasses(dateInfo, isCurrentMonth) {
  let classes = "day";

  if (!isCurrentMonth) {
    classes += " other-month";
  }

  if (!dateInfo) return classes;

  classes += " special";

  if (!isCurrentMonth) {
    classes += " other-month";
  }

  switch (dateInfo.type) {
    case "base":
      classes += " base";
      break;
    case "pentecost":
      classes += " pentecost";
      break;
    case "sabbath":
      classes += " sabbath";
      break;
    case "counting":
      classes += " counting";
      if (dateInfo.weekNumber) {
        classes += ` week${dateInfo.weekNumber}`;
      }
      break;
  }

  return classes;
}

function renderCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  let calendarHTML = `
        <div class="calendar-month">
            <h3 class="month-title">${MONTH_NAMES[month]} ${year}</h3>
            <div class="weekdays">
                ${DAY_NAMES.map(
                  (day) => `<div class="weekday">${day}</div>`
                ).join("")}
            </div>
            <div class="days-grid">
    `;

  const current = new Date(startDate);
  while (current <= lastDay || current.getDay() !== 0) {
    const dateInfo = getDateInfo(current);
    const isCurrentMonth = current.getMonth() === month;
    const dayClasses = getDayClasses(dateInfo, isCurrentMonth);

    calendarHTML += `
            <div class="${dayClasses}">
                ${current.getDate()}
                ${
                  dateInfo
                    ? `
                    <div class="tooltip">
                        <div style="font-weight: 500;">${dateInfo.label}</div>
                        ${
                          dateInfo.dayNumber
                            ? `<div>Día ${dateInfo.dayNumber}</div>`
                            : ""
                        }
                    </div>
                `
                    : ""
                }
            </div>
        `;

    current.setDate(current.getDate() + 1);
  }

  calendarHTML += `
            </div>
        </div>
    `;

  return calendarHTML;
}

function updateModeDescription() {
  const descriptions = {
    mode1:
      "Cuenta 7 semanas completas (49 días) comenzando desde el domingo después de la Ofrenda Mecida. Pentecostés es el día 50.",
    mode2:
      "Cuenta 7 Shabats semanales comenzando desde el sábado después de Nissan 15. Pentecostés es el día después del 7º Shabat.",
    mode3:
      "Cuenta exactamente 50 días desde la Ofrenda Mecida (Nissan 16). El día 50 es Pentecostés.",
  };

  document.getElementById("mode-description").textContent =
    descriptions[currentMode];
}

function updateLegend() {
  const items = [
    { color: "background: #1f2937", label: "Fechas Base de Festivales" },
    { color: "background: #ef4444", label: "Pentecostés" },
  ];

  if (currentMode === "mode1" || currentMode === "mode3") {
    items.push({
      color: "background: linear-gradient(to right, #fecaca, #f3e8ff)",
      label: "Conteo de Semanas",
    });
  }

  if (currentMode === "mode2") {
    items.push({ color: "background: #3b82f6", label: "Shabats" });
  }

  const legendHTML = items
    .map(
      (item) => `
        <div class="legend-item">
            <div class="legend-color" style="${item.color}"></div>
            <span>${item.label}</span>
        </div>
    `
    )
    .join("");

  document.getElementById("legend-items").innerHTML = legendHTML;
}

function updateSummary() {
  const pentecostDates = calculatedDates.filter((d) => d.type === "pentecost");
  const summaryHTML = pentecostDates
    .map(
      (pentecost) => `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
            <span class="badge">Pentecostés</span>
            <span>
                ${pentecost.date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
        </div>
    `
    )
    .join("");

  document.getElementById("summary-content").innerHTML = summaryHTML;
}

function renderCalendars() {
  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML =
    renderCalendar(2025, 3) + // April
    renderCalendar(2025, 4) + // May
    renderCalendar(2025, 5) + // June
    renderCalendar(2026, 0); // June
}

function updateDisplay() {
  calculateDates();
  updateModeDescription();
  updateLegend();
  renderCalendars();
  updateSummary();
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Mode buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document
        .querySelectorAll(".btn")
        .forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Update current mode
      currentMode = this.dataset.mode;

      // Update display
      updateDisplay();
    });
  });

  // Initial render
  updateDisplay();
});
