
// Selectors
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
const footerLinks = document.querySelectorAll(".footer-section a");
const burger = document.getElementById("burgerBtn");
const navMenu = document.querySelector("nav ul");
// Page switching
function hideAllPages() {
  pages.forEach(p => {
    p.style.display = "none";
    p.style.opacity = 0;
  });
}

function showPage(id) {
  hideAllPages();
  const page = document.getElementById(id);
  if (page) {
    page.style.display = "block";
    setTimeout(() => page.style.opacity = 1, 50);
  }
   updateActiveLink(id);
}
 

// Default page
showPage("home");

// Map footer link text to IDs
const footerMap = {
  "home": "home",
  "schedule": "schedule",
  "report issue": "report",
  "recycling centers": "recycle"
};
// Function to update active navigation link
function updateActiveLink(target) {
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.dataset.target === target) {
      link.classList.add("active");
    }
  });
}
// Navigation link events

[...navLinks, ...footerLinks].forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    // Determine target page
    let target = link.dataset.target;
    if (!target) {
      const text = link.textContent.trim().toLowerCase();
      target = footerMap[text];
    }
    if (target) {
      showPage(target);
      updateActiveLink(target);
    }

    // Close mobile menu if open
    if (navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
    }
  });
});


// Burger menu toggle
burger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("show");
  }
});

// Home page buttons
document.querySelector(".report-btn")?.addEventListener("click", () => showPage("report"));
document.querySelector(".schedule-btn")?.addEventListener("click", () => showPage("schedule"));
document.querySelector(".rprt-btn")?.addEventListener("click", () => showPage("report"));
document.querySelector(".schdl-btn")?.addEventListener("click", () => showPage("schedule"));

// Schedule page

async function refreshSchedules() {
  const region = regionSelect.value;
  if (!region) return;

  try {
    const response = await fetch(`http://localhost:5000/schedules/${region}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      scheduleResults.innerHTML = `<p>No schedules found for ${region}</p>`;
    } else {
      scheduleResults.innerHTML = data
        .map(schedule => `
          <div class="schedule-card">
            <h4>${schedule.title || "Schedule"}</h4>
            <p>${schedule.description || "No description available"}</p>
            <p><strong>Time:</strong> ${schedule.time || "Not specified"}</p>
          </div>
        `)
        .join("");
    }

  } catch (err) {
    scheduleResults.innerHTML = `<p style="color:red;">Error fetching schedules: ${err.message}</p>`;
  }
}

if (regionSelect) {
  regionSelect.addEventListener("change", refreshSchedules);
}
window.refreshSchedules = refreshSchedules;

// ----- REPORT FORM -----
const reportForm = document.getElementById("reportForm");

reportForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const reportData = {
    district: document.getElementById("district").value,
    location: document.getElementById("location").value,
    issueType: document.getElementById("issueType").value,
    description: document.getElementById("description").value,
    contact: document.getElementById("contactNumber").value
  };

  try {
    const res = await fetch("http://localhost:5000/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });

    if(res.ok){
      alert("Report submitted successfully!");
      reportForm.reset();
    } else {
      const err = await res.json();
      alert("Error: " + err.message);
    }
  } catch (error) {
    alert("Server error: " + error.message);
  }
});


// Recycling page
const centers = [
  { name: "Kigali City Recycling Center", district: "Gasabo", location: "KN 5 Ave, Kimihurura", materials: ["Plastic","Glass","Papers","Metal"], hours: "Mon-Sat: 8:00 AM - 5:00 PM" , phone:"+250 xxx xxx xxx" },
  { name: "Green Point Kicukiro", district: "Kicukiro", location: "KK 15 St, Gikondo", materials: ["Plastic","E-Waste","Batteries"], hours: "Mon-Fri: 7:00 AM - 6:00 PM" , phone:"+250 xxx xxx xxx" },
  { name: "Eco Center Nyarugenge", district: "Nyarugenge", location: "KN 82 St, Nyamirambo", materials: ["Papers","Cardboard","Glass","Plastic"], hours:"Mon-Sat: 8:00 AM - 5:00 PM", phone:"+250 xxx xxx xxx" },
  { name: "Remera Recycling Hub", district:"Gasabo", location:"KG 11 Ave, Remera", materials:["Metal","Plastic","Papers"], hours:"Mon-Fri: 8:00 AM - 4:00 PM", phone:"+250 xxx xxx xxx" },
  { name: "Kanombe Green Station", district:"Kicukiro", location:"KK 19 Rd, Kanombe", materials:["Glass","Plastic","Organic Waste"], hours: "Mon-Sat: 8:00 AM - 6:00 PM", phone:"+250 xxx xxx xxx" },
  { name:"Kimisagara Eco Point", district:"Nyarugenge", location:"KN 45 St, Kimisagara", materials:["Papers","Plastic","Metals","Textiles"], hours:"Mon-Sat: 8:00 AM - 6:00 PM", phone:"+250 xxx xxx xxx" }
];

const districtFilter = document.getElementById("districtFilter");
const centersContainer = document.getElementById("centersContainer");

function renderCenters(filter="all") {
  centersContainer.innerHTML = "";
  centers.filter(c => filter==="all" || c.district===filter)
    .forEach(c => {
      const card = document.createElement("div");
      card.classList.add("crd");
      card.innerHTML = `
        <span class="badge">${c.district}</span>
        <h3>${c.name}</h3>
        <p class="location">📍 ${c.location}</p>
        <p class="materials-title">Accepted Materials</p>
        <div>${c.materials.map(m=>`<span class="material-tag">${m}</span>`).join('')}</div>
        <p class="info-row">⏱️${c.hours}</p>
        <p class="info-row">📞 ${c.phone}</p>
       
      `;
      centersContainer.appendChild(card);
    });
}
districtFilter?.addEventListener("change", e => renderCenters(e.target.value));
renderCenters("all");

//Admin page

const API_SCHEDULES = "http://localhost:5000/schedules";
const API_REPORTS = "http://localhost:5000/reports";

const scheduleForm = document.getElementById('scheduleForm');
const scheduleIdInput = document.getElementById('scheduleId');
const districtInput = document.getElementById('district');
const dayInput = document.getElementById('day');
const timeInput = document.getElementById('time');
const areasInput = document.getElementById('areas');
const typeInput = document.getElementById('wasteType');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const reportNotification = document.getElementById('reportNotification');


// On page load

window.addEventListener('DOMContentLoaded', () => {
  checkReports();
});

async function checkReports() {
  try {
    const res = await fetch(API_REPORTS);
    const reports = await res.json();

    if (reports.length > 0) {
      reportNotification.textContent = `You have ${reports.length} new report(s) submitted`;
      reportNotification.style.display = 'block';
    } else {
      reportNotification.style.display = 'none';
    }
  } catch {
    console.error("Failed to check reports");
  }
}


//  Update Schedule

scheduleForm.addEventListener("submit", async e => {
  e.preventDefault();
  console.log("Form submitted");

  const id = scheduleIdInput.value;

  const scheduleData = {
    district: districtInput.value,
    day: dayInput.value,
    time: timeInput.value,
    areas: areasInput.value,
    wasteType: typeInput.value,
  };

  try {
    if (id) {
      await fetch(`${API_SCHEDULES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
    } else {
      await fetch(API_SCHEDULES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
    }

    // Reset form
    scheduleForm.reset();
    cancelEditBtn.style.display = "none";
    saveBtn.textContent = "Add Schedule";

    } catch (err) {
    alert("Error saving schedule");
  
  }
});

// Cancel Edit
cancelEditBtn.onclick = function() {
  scheduleForm.reset();
  scheduleIdInput.value = "";
  saveBtn.textContent = "Add Schedule";

};
