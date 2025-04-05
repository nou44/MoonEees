document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.story-container');
    let index = 0;
  
    function showSlide(i) {
      containers.forEach((container, idx) => {
        if (idx === i) {
          gsap.set(container, {opacity: 0, visibility: 'visible'});
          gsap.fromTo(container.querySelector('.story-image'), 
            {x: -200, opacity: 0}, 
            {x: 0, opacity: 1, duration: 1.5, ease: 'power2.out'}
          );
          gsap.fromTo(container.querySelector('.story-text'), 
            {x: 200, opacity: 0}, 
            {x: 0, opacity: 1, duration: 1.5, ease: 'power2.out'}
          );
          gsap.to(container, {opacity: 1, duration: 1});
        } else {
          gsap.to(container, {opacity: 0, visibility: 'hidden', duration: 1});
        }
      });
    }
  
    showSlide(index);
    setInterval(() => {
      index = (index + 1) % containers.length;
      showSlide(index);
    }, 7000); // كل 30 ثانية
  });



// تأثير نبض مستمر للزر
gsap.to(".glow-btn", {
    scale: 1.05,
    boxShadow: "0 0 15px white, 0 0 30px white",
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// إعداد المشهد، الكاميرا، والمُصَيِّر لتغطية كامل الصفحة
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// ضبط خصائص الطبقة الخلفية للنجوم لتكون شاملة وخلف كل شيء
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1";
renderer.domElement.style.pointerEvents = "none";

document.body.appendChild(renderer.domElement);

// إنشاء النجوم
const starCount = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];

for (let i = 0; i < starCount; i++) {
    let x = (Math.random() - 0.5) * 2000;
    let y = (Math.random() - 0.5) * 2000;
    let z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

// إنشاء Material مع التوهج
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// إضاءة ناعمة
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// وضع الكاميرا لرؤية النجوم
camera.position.z = 1;

// إعداد التوهج (Twinkling)
let twinkleSpeed = 0.02;
let direction = 1;

// تحريك النجوم + التوهج
function animate() {
    requestAnimationFrame(animate);

    // تحريك النجوم بشكل خفيف
    stars.rotation.y += 0.0008;
    stars.rotation.x += 0.0005;

    // تطبيق تأثير التوهج (Twinkling)
    starsMaterial.opacity += direction * twinkleSpeed;
    if (starsMaterial.opacity >= 1) {
        starsMaterial.opacity = 1;
        direction = -1;
    } else if (starsMaterial.opacity <= 0.5) {
        starsMaterial.opacity = 0.5;
        direction = 1;
    }

    renderer.render(scene, camera);
}
animate();

// تحديث عند تغيير الحجم
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
// إنشاء مجموعة الشهب
const meteors = new THREE.Group();
scene.add(meteors);

// دالة لإنشاء شهب جديدة
function createMeteor() {
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const meteor = new THREE.Mesh(geometry, material);

    // تحديد نقطة البداية العشوائية للشهاب
    meteor.position.set(
        (Math.random() - 0.5) * 1500, // عرض الشاشة
        Math.random() * 800 + 400,    // فوق الشاشة
        (Math.random() - 0.5) * 1000  // العمق
    );

    meteors.add(meteor);

    // تحريك الشهاب إلى أسفل بزاوية
    const speed = Math.random() * 2 + 2; // سرعة عشوائية لكل شهاب

    function animateMeteor() {
        if (meteor.position.y < -500) {
            meteors.remove(meteor);
            return;
        }

        meteor.position.x += speed * 0.5;
        meteor.position.y -= speed;

        requestAnimationFrame(animateMeteor);
    }

    animateMeteor();
}

// تشغيل الشهب بشكل متكرر
setInterval(createMeteor, 200);

// ** تفاعل الشهب مع الماوس **
window.addEventListener("mousemove", (event) => {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = -(event.clientY / window.innerHeight) * 2 + 1;

    // إنشاء شهاب بالقرب من الماوس عند التحريك
    if (Math.random() < 0.1) {
        createMeteorAtPosition(x * 800, y * 400);
    }
});

// إنشاء شهاب في موقع معين (عند الماوس)
function createMeteorAtPosition(x, y) {
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const meteor = new THREE.Mesh(geometry, material);

    meteor.position.set(x, y, Math.random() * -500);
    meteors.add(meteor);

    const speed = Math.random() * 2 + 1.5;

    function animateMeteor() {
        if (meteor.position.y < -500) {
            meteors.remove(meteor);
            return;
        }
        meteor.position.x += speed * 0.5;
        meteor.position.y -= speed;
        requestAnimationFrame(animateMeteor);
    }

    animateMeteor();
}

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".feature-card").forEach(card => {
        gsap.fromTo(card, 
            { opacity: 0, scale: 0.8, y: 50 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out",
              scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  onEnter: () => gsap.to(card, { opacity: 1, scale: 1, y: 0, duration: 0.6 }),
                  onLeaveBack: () => gsap.to(card, { opacity: 0, scale: 0.8, y: 50, duration: 0.6 })
              }
            }
        );
    });
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // تأثير الأنيميشن على القسم بالكامل
    gsap.from(".roadmap-section", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".roadmap-section",
            start: "top 80%", // يبدأ عند وصول القسم إلى 80% من الشاشة
            end: "bottom top", // يبدأ الأنيميشن عند بداية القسم وينتهي عند نهايته
            toggleActions: "restart none none none", // يبدأ الأنيميشن من جديد كل مرة يدخل فيها المستخدم إلى القسم
        }
    });

    // تأثير الأنيميشن على كل عنصر داخل الخط الزمني
    gsap.utils.toArray(".timeline-item").forEach((item, index) => {
        gsap.fromTo(item,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
              scrollTrigger: {
                  trigger: item,
                  start: "top 85%", // يبدأ الأنيميشن عندما يكون العنصر في الـ 85% من الشاشة
                  end: "bottom top", // ينتهي الأنيميشن عندما يتجاوز العنصر الأعلى
                  toggleActions: "restart none none none", // يبدأ الأنيميشن من جديد كل مرة يعود فيها العنصر
              }
            }
        );
    });
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const mintingAnim = gsap.timeline({
        scrollTrigger: {
            trigger: ".minting-section",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "restart none restart none",
        }
    });

    mintingAnim.from(".minting-section", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });

    mintingAnim.from(".mint-box", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.5");

    mintingAnim.from(".nft-img", {
        opacity: 0,
        scale: 0.5,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(1.5)"
    }, "-=0.5");
});
document.getElementById("mint-btn").addEventListener("click", function() {
    window.open("https://opensea.io/collection/YOUR_COLLECTION_NAME", "_blank");
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".about-content", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "restart none restart none",
        }
    });

    gsap.from(".about-image img", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: ".about-image",
            start: "top 85%",
            toggleActions: "restart none restart none",
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.fromTo(".about-section", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none none"
        }}
    );
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".about-container", 
        { opacity: 0, scale: 0.8, y: 50 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out", scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }}
    );

    gsap.fromTo(".image-box", 
        { opacity: 0, scale: 0.6, rotation: -15 }, 
        { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "power3.out", scrollTrigger: {
            trigger: ".image-box",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }}
    );

    gsap.fromTo(".info-box h2, .info-box h4, .info-box p, .portfolio-btn", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", scrollTrigger: {
            trigger: ".info-box",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }}
    );
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.fromTo(".footer", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            toggleActions: "play none none reverse"
        }}
    );
});
document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector('.footer-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('active');
            } else {
                footer.classList.remove('active'); // إعادة الأنيميشن عند مغادرة القسم
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(footer);
});