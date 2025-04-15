// Initialize GSAP animations
gsap.from(".glass-card", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.2,
    ease: "power2.out"
  });
  
  // Create particles effect
  function initParticles() {
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      document.querySelector(".particles").appendChild(particle);
      
      particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1
      });
    }
    
    function updateParticles() {
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = window.innerHeight + 10;
          p.x = Math.random() * window.innerWidth;
        }
        
        p.element.style.width = `${p.size}px`;
        p.element.style.height = `${p.size}px`;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = Math.random() * 0.5 + 0.1;
        p.element.style.background = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
      });
      
      requestAnimationFrame(updateParticles);
    }
    
    updateParticles();
  }
  
  document.addEventListener("DOMContentLoaded", initParticles);
  
  // Chart configuration
  // Updated Chart Configuration with fixed ping axis
const combinedChart = new Chart(document.getElementById('combinedChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Download (Mbps)',
          data: [],
          borderColor: '#6e44ff',
          backgroundColor: 'rgba(110, 68, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6e44ff',
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y'
        },
        {
          label: 'Upload (Mbps)',
          data: [],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00d4ff',
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y'
        },
        {
          label: 'Ping (ms)',
          data: [],
          borderColor: '#ff8906',
          backgroundColor: 'rgba(255, 137, 6, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#ff8906',
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 12
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 14, 23, 0.95)',
          titleColor: '#fffffe',
          bodyColor: '#a7a9be',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          usePointStyle: true,
          bodyFont: {
            family: 'Poppins',
            size: 12
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(2) + 
                        (context.dataset.label.includes('Mbps') ? ' Mbps' : ' ms');
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 11
            },
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          position: 'left',
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 11
            },
            callback: function(value) {
              return value + ' Mbps';
            }
          },
          title: {
            display: true,
            text: 'Speed (Mbps)',
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 12
            }
          }
        },
        y1: {
          position: 'right',
          beginAtZero: false,
          grid: {
            drawOnChartArea: false,
            drawBorder: false
          },
          ticks: {
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 11
            },
            callback: function(value) {
              return value + ' ms';
            }
          },
          title: {
            display: true,
            text: 'Ping (ms)',
            color: '#a7a9be',
            font: {
              family: 'Poppins',
              size: window.innerWidth < 768 ? 10 : 12
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Make chart responsive on window resize
  window.addEventListener('resize', function() {
    combinedChart.resize();
  });
  
  // Test control variables
  let intervalId = null;
  let testRunning = false;
  const startStopBtn = document.getElementById("startStopBtn");
  
  // Button state management
  function updateButtonState(running) {
    const icon = startStopBtn.querySelector(".btn-icon i");
    const text = startStopBtn.querySelector(".btn-text");
    
    if (running) {
      icon.className = "fas fa-stop";
      text.textContent = "Stop Test";
      startStopBtn.classList.add("btn-danger");
      startStopBtn.classList.remove("btn-primary");
    } else {
      icon.className = "fas fa-play";
      text.textContent = "Start Test";
      startStopBtn.classList.add("btn-primary");
      startStopBtn.classList.remove("btn-danger");
    }
  }
  
  // Toggle test function
  function toggleTest() {
    if (!testRunning) {
      startTest();
    } else {
      stopTest();
    }
  }
  
  // Start test function
  function startTest() {
    const duration = document.getElementById("duration").value;
    const frequency = document.getElementById("frequency").value;
  
    fetch("/start_test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration: duration, frequency: frequency })
    }).then(() => {
      clearInterval(intervalId);
      document.getElementById("progress").innerText = "0%";
      document.getElementById("elapsed").innerText = "0s";
      document.getElementById("resultTable").innerHTML = "";
      document.getElementById("progress-fill").style.width = "0%";
      resetChart();
  
      testRunning = true;
      updateButtonState(true);
      intervalId = setInterval(fetchStatus, 1000);
  
      // Hide export buttons while test is running
      document.getElementById("resultButtons").style.display = "none";
      
      // Animation for test start
      gsap.fromTo("#progress-fill", 
        { width: "0%" },
        { width: "100%", duration: duration, ease: "none" }
      );
    });
  }
  
  // Stop test function
  function stopTest() {
    fetch("/stop_test").then(() => {
      clearInterval(intervalId);
      testRunning = false;
      updateButtonState(false);
      
      // Stop progress bar animation
      gsap.killTweensOf("#progress-fill");
    });
  }
  
  // Fetch status function
  function fetchStatus() {
    fetch("/get_status")
      .then(response => response.json())
      .then(data => {
        document.getElementById("progress").innerText = data.progress + "%";
        document.getElementById("elapsed").innerText = data.elapsed_time + "s";
  
        const table = document.getElementById("resultTable");
        table.innerHTML = "";
        
        // Update chart with new data
        combinedChart.data.labels = [];
        combinedChart.data.datasets.forEach(dataset => dataset.data = []);
  
        data.data.forEach(entry => {
          const row = document.createElement("tr");
          
          const timestampCell = document.createElement("td");
          timestampCell.textContent = entry.timestamp;
          
          const downloadCell = document.createElement("td");
          downloadCell.textContent = entry.download;
          downloadCell.className = "speed-value";
          
          const uploadCell = document.createElement("td");
          uploadCell.textContent = entry.upload;
          uploadCell.className = "speed-value";
          
          const pingCell = document.createElement("td");
          pingCell.textContent = entry.ping;
          pingCell.className = "ping-value";
          
          const ipCell = document.createElement("td");
          ipCell.textContent = entry.ip;
          
          row.appendChild(timestampCell);
          row.appendChild(downloadCell);
          row.appendChild(uploadCell);
          row.appendChild(pingCell);
          row.appendChild(ipCell);
          
          table.appendChild(row);
  
          if (entry.download !== "Error") {
            combinedChart.data.labels.push(entry.timestamp);
            combinedChart.data.datasets[0].data.push(entry.download);
            combinedChart.data.datasets[1].data.push(entry.upload);
            combinedChart.data.datasets[2].data.push(entry.ping);
          }
        });
  
        combinedChart.update();
  
        if (data.status === "completed") {
          clearInterval(intervalId);
          testRunning = false;
          updateButtonState(false);
          document.getElementById("resultButtons").style.display = "flex";
          
          // Animate results appearance
          gsap.from("#resultButtons button", {
            duration: 0.5,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out"
          });
          
          // Animate table rows
          gsap.from("#resultTable tr", {
            duration: 0.3,
            x: -20,
            opacity: 0,
            stagger: 0.05,
            ease: "power1.out"
          });
        }
      });
  }
  
  // Reset chart function
  function resetChart() {
    combinedChart.data.labels = [];
    combinedChart.data.datasets.forEach(dataset => dataset.data = []);
    combinedChart.update();
  }
  
  // Download results function
  function downloadResults() {
    // Add animation feedback
    const button = event.currentTarget;
    gsap.to(button, {
      duration: 0.3,
      scale: 0.9,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    });
    
    window.location.href = "/download";
  }
  
  // Generate PDF function
  function generatePDF() {
    // Add animation feedback
    const button = event.currentTarget;
    gsap.to(button, {
      duration: 0.3,
      scale: 0.9,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    });
    
    window.location.href = "/generate_pdf";
  }
  
  // Initialize event listeners
  document.addEventListener("DOMContentLoaded", () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          duration: 0.2,
          scale: 1.05,
          ease: "power1.out"
        });
      });
      
      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          duration: 0.2,
          scale: 1,
          ease: "power1.out"
        });
      });
    });
    
    // Add animation to table rows on hover
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches("td")) {
        gsap.to(e.target.parentElement, {
          duration: 0.2,
          backgroundColor: "rgba(110, 68, 255, 0.05)",
          ease: "power1.out"
        });
      }
    });
    
    document.addEventListener("mouseout", (e) => {
      if (e.target.matches("td")) {
        gsap.to(e.target.parentElement, {
          duration: 0.2,
          backgroundColor: "transparent",
          ease: "power1.out"
        });
      }
    });
  });
// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      combinedChart.resize();
    }, 200);
  });