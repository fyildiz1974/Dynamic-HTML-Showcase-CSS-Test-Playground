// Sayfa yüklendiğinde
window.addEventListener('DOMContentLoaded', function () {
    const savedCSS = localStorage.getItem("selectedCSS");
    const customCSS = localStorage.getItem("customCSS");
    const cssSelector = document.getElementById("css-selector");

    // Eğer özel CSS kodları varsa ve başka bir CSS kaynağı seçilmemişse
    if (customCSS && (!savedCSS || savedCSS === "custom")) {
        applyInlineCustomCSS(customCSS);
        document.getElementById("customCSSInput").value = customCSS;
        cssSelector.value = ""; // "Select CSS" görünür olsun
        localStorage.setItem("selectedCSS", "custom");
    }

    // blob: URL'leri engelle
    else if (savedCSS && savedCSS.startsWith("blob:")) {
        const defaultCSS = "assets/css/style.css";
        loadCSS(defaultCSS);
        localStorage.setItem("selectedCSS", defaultCSS);
        cssSelector.value = defaultCSS;
    }

    // Normal CSS dosyası
    else if (savedCSS) {
        loadCSS(savedCSS);
        let found = false;
        for (let i = 0; i < cssSelector.options.length; i++) {
            if (cssSelector.options[i].value === savedCSS) {
                found = true;
                cssSelector.value = savedCSS;
                break;
            }
        }
        if (!found) cssSelector.value = "";
    }
});

// CSS dosyasını yükle
function loadCSS(cssUrl) {
    clearAllCSS();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    link.id = "dynamic-stylesheet";
    document.head.appendChild(link);
}

// Tüm CSS'leri temizle
function clearAllCSS() {
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove());
}

// Select menüsü değişince
document.getElementById("css-selector").addEventListener("change", function () {
    const selectedValue = this.value;
    if (selectedValue !== "") {
        loadCSS(selectedValue);
        localStorage.setItem("selectedCSS", selectedValue);
        localStorage.removeItem("customCSS");
        document.getElementById("customCSSInput").value = ""; // textarea temizlenir
    }
});

// Upload edilen CSS dosyasını uygula
document.getElementById("css-uploader-button").addEventListener("click", function () {
    const fileInput = document.getElementById("css-uploader");
    const file = fileInput.files[0];

    if (file && file.name.endsWith(".css")) {
        const url = URL.createObjectURL(file);
        loadCSS(url);
        localStorage.setItem("selectedCSS", url);
        localStorage.removeItem("customCSS");
        document.getElementById("css-selector").value = "";
        document.getElementById("customCSSInput").value = "";
    } else {
        alert("Please upload a valid .css file.");
    }
});

// Reset to default
document.getElementById("reset-default").addEventListener("click", function () {
    const defaultCSS = "assets/css/style.css";
    loadCSS(defaultCSS);
    localStorage.setItem("selectedCSS", defaultCSS);
    localStorage.removeItem("customCSS");
    document.getElementById("css-selector").value = defaultCSS;
    document.getElementById("customCSSInput").value = "";
});

// CSS Reset
document.getElementById("css-reset").addEventListener("click", function () {
    const resetCSSPath = "assets/css/reset.css";
    loadCSS(resetCSSPath);
    localStorage.setItem("selectedCSS", resetCSSPath);
    localStorage.removeItem("customCSS");
    document.getElementById("css-selector").value = resetCSSPath;
    document.getElementById("customCSSInput").value = "";
});

// URL'den CSS uygula
document.getElementById("css-url-button").addEventListener("click", function () {
    const urlInput = document.getElementById("css-url").value.trim();
    if (urlInput !== "" && urlInput.endsWith(".css")) {
        loadCSS(urlInput);
        localStorage.setItem("selectedCSS", urlInput);
        localStorage.removeItem("customCSS");
        document.getElementById("css-selector").value = "";
        document.getElementById("customCSSInput").value = "";
    } else {
        alert("Please enter a valid URL that ends with .css");
    }
});

// Özel CSS uygula
function applyInlineCustomCSS(cssCode) {
    clearAllCSS(); // Tüm stilleri kaldır
    const styleTag = document.createElement("style");
    styleTag.id = "custom-style";
    styleTag.textContent = cssCode;
    document.head.appendChild(styleTag);
}

// Apply butonu (textarea)
function applyCustomCSS() {
    const cssCode = document.getElementById("customCSSInput").value.trim();
    if (cssCode !== "") {
        applyInlineCustomCSS(cssCode);
        localStorage.setItem("customCSS", cssCode);
        localStorage.setItem("selectedCSS", "custom");
        document.getElementById("css-selector").value = "";
    } else {
        alert("Please write some CSS code before applying.");
    }
}

// "Clear Cache" butonuna tıklandığında çalışacak fonksiyon
document.getElementById("clear-cache").addEventListener("click", function () {
    // localStorage ve sessionStorage'ı temizleyelim
    localStorage.clear();  // localStorage'ı temizle
    sessionStorage.clear(); // sessionStorage'ı temizle

    // Sayfadaki dinamik CSS'leri temizle (önceden yüklenen)
    clearAllCSS();

    // Eğer varsa textarea'yı temizleyelim (Özel CSS alanı)
    document.getElementById("customCSSInput").value = "";

    // Sayfayı yenileyelim
    window.location.reload(); // Sayfayı yeniden yükle
});