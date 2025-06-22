import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const vehicleOptions = [
  { 
    id: 'magic_carpet', 
    name: 'Sihirli Halı', 
    icon: '🪄', 
    description: 'Gökyüzünde süzülerek keşfet!',
    color: ['#9C27B0', '#673AB7']
  },
  { 
    id: 'airplane', 
    name: 'Uçak', 
    icon: '✈️', 
    description: 'Hızlı ve güvenli bir yolculuk!',
    color: ['#2196F3', '#03A9F4']
  },
  { 
    id: 'rocket', 
    name: 'Roket', 
    icon: '🚀', 
    description: 'Uzayın sınırlarını zorla!',
    color: ['#F44336', '#FF5722']
  },
  { 
    id: 'hot_air_balloon', 
    name: 'Sıcak Hava Balonu', 
    icon: '🎈', 
    description: 'Yavaş ama keyifli bir macera!',
    color: ['#4CAF50', '#8BC34A']
  },
];

const VehicleScreen = ({ navigation, route }) => {
  const { avatar, equipments = [] } = route.params;
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Avatar URL temizle
  const cleanAvatarUrl = avatar.avatarUrl.replace(/\\/g, '').replace(/"/g, '');
  
  // Seçilen ekipmanları bul
  const selectedEquipmentItems = (equipments || []).map(id => {
    const equipment = { id };
    // Ekipman bilgilerini ekle (gerçek uygulamada bir veri kaynağından gelecek)
    switch(id) {
      case 'binoculars':
        equipment.name = 'Sanal Dürbün';
        equipment.icon = '🔭';
        break;
      case 'compass':
        equipment.name = 'Sihirli Pusula';
        equipment.icon = '🧭';
        break;
      case 'notebook':
        equipment.name = 'Not Defteri';
        equipment.icon = '📒';
        break;
      case 'camera':
        equipment.name = 'Fotoğraf Makinesi';
        equipment.icon = '📷';
        break;
      default:
        equipment.name = 'Ekipman';
        equipment.icon = '🎒';
    }
    return equipment;
  });
  
  // Avatar viewer HTML
  const avatarViewerHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            width: 100vw; 
            height: 100vh; 
            background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
          }
          
          .stars {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
          }
          
          .star {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            opacity: 0.5;
          }
          
          /* Animasyonlar */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes sparkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.3; transform: scale(0.8); }
          }
          
          /* Araç seçimi göstergeleri */
          .vehicle-indicator {
            position: fixed;
            bottom: 20px; /* Ekranın en altına yakın */
            left: 20px; /* Sol tarafa yerleştir */
            text-align: center;
            font-size: 16px;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            z-index: 1000; /* En üstte görünmesi için */
            background-color: rgba(33, 150, 243, 0.8);
            padding: 8px 15px;
            border-radius: 30px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 200px; /* Daha küçük genişlik */
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            right: auto; /* Sağ tarafı otomatik olarak ayarlama */
            margin: 0; /* Marjinleri sıfırla */
          }
          
          .vehicle-indicator.show {
            opacity: 1;
            transform: translateY(0);
          }
          
          /* Sihirli halı */
          .magic-carpet-scene {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
          
          .carpet {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 240px;
            height: 160px;
            background: linear-gradient(90deg, #8E24AA, #5E35B1);
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            animation: carpet-float 3s ease-in-out infinite;
            z-index: 5;
            perspective: 500px;
            transform-style: preserve-3d;
            transform: translateX(-50%) rotateX(60deg);
          }
          
          .carpet-inner {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 4px solid #E1BEE7;
            border-radius: 6px;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.3);
          }
          
          .carpet-pattern {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            background-image: 
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 15px,
                rgba(255, 255, 255, 0.2) 15px,
                rgba(255, 255, 255, 0.2) 20px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 15px,
                rgba(255, 255, 255, 0.1) 15px,
                rgba(255, 255, 255, 0.1) 20px
              );
            border-radius: 4px;
          }
          
          .carpet-design {
            position: absolute;
            top: 30px;
            left: 30px;
            right: 30px;
            bottom: 30px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 10px;
          }
          
          .carpet-design-element {
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .carpet-design-element:nth-child(odd) {
            background-color: rgba(255, 193, 7, 0.2);
          }
          
          .carpet-design-element:nth-child(5) {
            background-color: rgba(255, 87, 34, 0.3);
            border-radius: 50%;
          }
          
          .carpet-glow {
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            background: radial-gradient(ellipse at center, rgba(156, 39, 176, 0.6) 0%, rgba(156, 39, 176, 0) 70%);
            filter: blur(15px);
            opacity: 0.7;
            z-index: 4;
            animation: glow-pulse 2s ease-in-out infinite alternate;
          }
          
          .carpet-edge {
            position: absolute;
            height: 10px;
            width: 240px;
            background-color: #4A148C;
            left: 0;
            z-index: 6;
          }
          
          .carpet-edge-top {
            top: 0;
            border-radius: 10px 10px 0 0;
          }
          
          .carpet-edge-bottom {
            bottom: 0;
            border-radius: 0 0 10px 10px;
          }
          
          .carpet-fringe {
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 10px;
            z-index: 6;
            display: flex;
            justify-content: space-between;
          }
          
          .fringe {
            width: 4px;
            height: 10px;
            background-color: #E1BEE7;
            margin: 0 2px;
          }
          
          .sparkle {
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
            animation: sparkle 2s ease-in-out infinite;
          }
          
          /* Uçak */
          .airplane-scene {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .clouds-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, #64B5F6, #1E88E5);
            z-index: -1;
          }
          
          .airplane {
            position: absolute;
            bottom: 45%;
            left: 40%; /* Biraz sola kaydır */
            transform: translateX(-50%);
            z-index: 10;
            perspective: 1000px;
          }
          
          .airplane-body {
            position: relative;
            width: 320px;
            height: 100px;
            background: linear-gradient(to bottom, #FFFFFF 60%, #F5F5F5 100%);
            border-radius: 30% 70% 20% 20%; /* Daha aerodinamik şekil */
            transform-style: preserve-3d;
            animation: plane-float 8s ease-in-out infinite;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            border: 1px solid #E0E0E0;
            transform: rotate(5deg); /* Hafif yukarı doğru uçuyor gibi */
          }
          
          /* Uçak gövdesindeki çizgi */
          .airplane-stripe {
            position: absolute;
            height: 15px;
            width: 100%;
            background-color: #2196F3;
            top: 40%;
            left: 0;
            z-index: 2;
          }
          
          /* Uçak pencereleri */
          .airplane-windows {
            position: absolute;
            top: 25px;
            right: 40px;
            width: 200px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            z-index: 3;
          }
          
          .airplane-window {
            position: relative;
            width: 30px;
            height: 30px;
            background-color: #E3F2FD;
            border-radius: 50%;
            border: 2px solid #BBDEFB;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
            margin: 0 10px;
          }
          
          /* Avatar'ın bakacağı pencere */
          .window-avatar {
            background-color: rgba(227, 242, 253, 0.6);
            overflow: visible;
            position: relative;
          }
          
          /* Uçak kanadı */
          .airplane-wing {
            position: absolute;
            width: 180px;
            height: 30px;
            background: linear-gradient(to bottom, #2196F3, #1976D2);
            bottom: -10px;
            left: 70px;
            border-radius: 10px 50% 50% 10px;
            transform: skewX(-10deg);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1;
          }
          
          /* Uçak kuyruğu */
          .airplane-tail {
            position: absolute;
            width: 50px;
            height: 60px;
            background: linear-gradient(to right, #2196F3, #1976D2);
            right: -20px;
            top: -30px;
            border-radius: 5px 20px 0 0;
            transform: skewX(-20deg);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1;
          }
          
          /* Uçak burnu */
          .airplane-nose {
            position: absolute;
            width: 50px;
            height: 50px;
            background: linear-gradient(to right, #FFFFFF, #F5F5F5);
            left: -25px;
            top: 25px;
            border-radius: 50% 0 0 50%;
            border-left: 1px solid #E0E0E0;
            z-index: 2;
          }
          
          /* Kokpit camı */
          .airplane-cockpit {
            position: absolute;
            width: 60px;
            height: 35px;
            background-color: rgba(227, 242, 253, 0.8);
            border-radius: 50% 20px 20px 50%;
            top: 15px;
            left: 20px;
            border: 2px solid #BBDEFB;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
            z-index: 3;
          }
          
          /* Roket */
          .rocket-scene {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #000000, #1A237E);
            overflow: hidden;
          }
          
          .star-field {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          }
          
          .rocket {
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            animation: rocket-float 4s ease-in-out infinite;
          }
          
          .rocket-body {
            position: relative;
            width: 60px;
            height: 180px;
            background: linear-gradient(to bottom, #F44336 40%, #D32F2F 100%);
            border-radius: 30px 30px 0 0;
            z-index: 2;
          }
          
          .rocket-head {
            position: absolute;
            top: -30px;
            left: 0;
            width: 60px;
            height: 60px;
            background-color: #E0E0E0;
            border-radius: 50% 50% 0 0;
            z-index: 3;
          }
          
          .rocket-window {
            position: absolute;
            width: 30px;
            height: 30px;
            background-color: #E3F2FD;
            border-radius: 50%;
            top: 40px;
            left: 15px;
            border: 5px solid #BBDEFB;
            z-index: 4;
          }
          
          .rocket-fin {
            position: absolute;
            width: 20px;
            height: 40px;
            background-color: #D32F2F;
            bottom: 0;
            border-radius: 0 10px 0 0;
            z-index: 1;
          }
          
          .fin-left { left: -20px; transform: skewY(30deg); }
          .fin-right { right: -20px; transform: skewY(-30deg); }
          
          .rocket-flame {
            position: absolute;
            bottom: -60px;
            left: 15px;
            width: 30px;
            height: 60px;
            z-index: 1;
          }
          
          .flame-inner {
            position: absolute;
            bottom: 0;
            left: 5px;
            width: 20px;
            height: 40px;
            background: linear-gradient(to top, #FFEB3B, #FF9800);
            border-radius: 10px 10px 20px 20px;
            animation: flame-flicker 0.2s ease-in-out infinite alternate;
          }
          
          .flame-outer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 30px;
            height: 60px;
            background: linear-gradient(to top, rgba(255, 152, 0, 0.5), rgba(255, 235, 59, 0));
            border-radius: 10px 10px 20px 20px;
            animation: flame-flicker 0.5s ease-in-out infinite alternate 0.1s;
          }
          
          @keyframes flame-flicker {
            0% { transform: scaleX(0.8) scaleY(0.8); opacity: 0.8; }
            100% { transform: scaleX(1.1) scaleY(1.1); opacity: 1; }
          }
          
          @keyframes rocket-float {
            0% { transform: translateX(-50%) translateY(0) rotate(0deg); }
            25% { transform: translateX(-50%) translateY(-20px) rotate(1deg); }
            50% { transform: translateX(-50%) translateY(-40px) rotate(0deg); }
            75% { transform: translateX(-50%) translateY(-20px) rotate(-1deg); }
            100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          }
          
          /* Balon */
          .balloon-scene {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #64B5F6, #BBDEFB);
          }
          
          .balloon-container {
            position: absolute;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            animation: balloon-float 5s ease-in-out infinite;
            z-index: 10;
          }
          
          .balloon-top {
            position: relative;
            width: 120px;
            height: 160px;
            background: radial-gradient(circle at 60% 40%, #EF5350, #B71C1C);
            border-radius: 60px 60px 60px 60px / 80px 80px 40px 40px;
            box-shadow: inset 10px -10px 20px rgba(0, 0, 0, 0.2);
            z-index: 2;
          }
          
          .balloon-highlight {
            position: absolute;
            width: 40px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            top: 30px;
            left: 20px;
          }
          
          .balloon-basket {
            position: relative;
            width: 60px;
            height: 40px;
            background: linear-gradient(to bottom, #8D6E63, #5D4037);
            border-radius: 5px;
            margin-top: 20px;
            z-index: 3;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
          }
          
          .balloon-rope {
            position: absolute;
            width: 2px;
            height: 30px;
            background-color: #5D4037;
            top: -30px;
            z-index: 1;
          }
          
          .rope-1 { left: 10px; transform: rotate(-10deg); }
          .rope-2 { left: 30px; }
          .rope-3 { left: 50px; transform: rotate(10deg); }
          
          @keyframes balloon-float {
            0% { transform: translateX(-50%) translateY(0) rotate(0deg); }
            33% { transform: translateX(-50%) translateY(-15px) rotate(2deg); }
            66% { transform: translateX(-50%) translateY(-30px) rotate(-2deg); }
            100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          }
          
          /* Avatar konumlandırma */
          .avatar-container {
            position: absolute;
            z-index: 20;
            transform-origin: center bottom;
            transition: all 0.5s ease;
          }
          
          .avatar-carpet {
            bottom: 130px;
            left: 50%;
            transform: translateX(-50%) scale(0.7);
          }
          
          .avatar-airplane {
            position: fixed;
            bottom: auto;
            top: auto;
            left: auto;
            transform: translate(-50%, -50%) scale(0.35);
            clip-path: circle(25% at 50% 20%); /* Sadece başı göster */
            z-index: 30; /* En üstte görünmesi için */
          }
          
          .avatar-rocket {
            bottom: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-20px) scale(0.4);
            clip-path: circle(40% at 50% 30%); /* Yuvarlak pencere efekti ile sadece başı göster */
          }
          
          .avatar-balloon {
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%) translateY(30px) scale(0.5);
            clip-path: inset(0% 0% 40% 0%); /* Üst ve orta kısmı göster, alt kısmı gizle */
          }
        </style>
      </head>
      <body>
        <div class="stars" id="stars"></div>
        <div id="vehicleIndicator" class="vehicle-indicator"></div>
        
        <!-- Araç sahneleri -->
        <div id="magicCarpetScene" class="magic-carpet-scene" style="display: none;">
          <div class="carpet">
            <div class="carpet-edge carpet-edge-top"></div>
            <div class="carpet-edge carpet-edge-bottom"></div>
            <div class="carpet-inner">
              <div class="carpet-pattern"></div>
              <div class="carpet-design">
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
                <div class="carpet-design-element"></div>
              </div>
            </div>
            <div class="carpet-fringe" id="carpetFringe"></div>
          </div>
          <div class="carpet-glow"></div>
          <div id="carpetSparkles"></div>
        </div>
        
        <div id="airplaneScene" class="airplane-scene" style="display: none;">
          <div class="clouds-background"></div>
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
          
          <div class="airplane">
            <div class="airplane-body">
              <div class="airplane-stripe"></div>
              <div class="airplane-nose"></div>
              <div class="airplane-tail"></div>
              <div class="airplane-wing"></div>
              <div class="airplane-cockpit"></div>
              <div class="airplane-windows">
                <div class="airplane-window"></div>
                <div class="airplane-window window-avatar"></div>
                <div class="airplane-window"></div>
                <div class="airplane-window"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="rocketScene" class="rocket-scene" style="display: none;">
          <div class="star-field" id="starField"></div>
          
          <div class="rocket">
            <div class="rocket-head"></div>
            <div class="rocket-body">
              <div class="rocket-window"></div>
              <div class="rocket-fin fin-left"></div>
              <div class="rocket-fin fin-right"></div>
            </div>
            <div class="rocket-flame">
              <div class="flame-outer"></div>
              <div class="flame-inner"></div>
            </div>
          </div>
        </div>
        
        <div id="balloonScene" class="balloon-scene" style="display: none;">
          <div class="balloon-container">
            <div class="balloon-top">
              <div class="balloon-highlight"></div>
            </div>
            <div class="balloon-rope rope-1"></div>
            <div class="balloon-rope rope-2"></div>
            <div class="balloon-rope rope-3"></div>
            <div class="balloon-basket"></div>
          </div>
        </div>
        
        <!-- Avatar container -->
        <div id="avatarContainer" class="avatar-container">
          <model-viewer
            id="avatarModel"
            src="${cleanAvatarUrl}"
            camera-controls="false"
            auto-rotate="false"
            camera-orbit="0deg 75deg 105%"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 200%"
            camera-target="0m 1m 0m"
            environment-image="neutral"
            shadow-intensity="1"
            exposure="1"
            style="width: 300px; height: 300px; background-color: transparent;"
          ></model-viewer>
        </div>
        
        <script>
          // Yıldız efekti oluştur
          const starsContainer = document.getElementById('stars');
          const starCount = 30;
          
          for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Rastgele boyut (1-3px)
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // Rastgele konum
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Rastgele parlaklık
            star.style.opacity = Math.random() * 0.7 + 0.3;
            
            starsContainer.appendChild(star);
          }
          
          // Roket için yıldız alanı oluştur
          const createStarField = () => {
            const starField = document.getElementById('starField');
            if (!starField) return;
            
            for (let i = 0; i < 100; i++) {
              const star = document.createElement('div');
              star.className = 'star';
              
              // Rastgele boyut (1-3px)
              const size = Math.random() * 3 + 1;
              star.style.width = size + 'px';
              star.style.height = size + 'px';
              
              // Rastgele konum
              star.style.left = Math.random() * 100 + '%';
              star.style.top = Math.random() * 100 + '%';
              
              // Rastgele parlaklık
              star.style.opacity = Math.random() * 0.9 + 0.1;
              
              starField.appendChild(star);
            }
          };
          
          // Halı için parıltı efekti oluştur
          const createCarpetSparkles = () => {
            const sparklesContainer = document.getElementById('carpetSparkles');
            if (!sparklesContainer) return;
            
            // Önce mevcut parıltıları temizle
            sparklesContainer.innerHTML = '';
            
            // Yeni parıltılar ekle
            for (let i = 0; i < 30; i++) {
              const sparkle = document.createElement('div');
              sparkle.className = 'sparkle';
              
              // Rastgele boyut (3-8px)
              const size = Math.random() * 5 + 3;
              sparkle.style.width = size + 'px';
              sparkle.style.height = size + 'px';
              
              // Rastgele konum - halının etrafında
              const carpetRect = document.querySelector('.carpet').getBoundingClientRect();
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2 + 50; // Halının yaklaşık konumu
              
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 150 + 50;
              const x = centerX + Math.cos(angle) * distance;
              const y = centerY + Math.sin(angle) * distance;
              
              sparkle.style.left = x + 'px';
              sparkle.style.top = y + 'px';
              
              // Rastgele animasyon gecikmesi
              sparkle.style.animationDelay = Math.random() * 3 + 's';
              sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
              
              sparklesContainer.appendChild(sparkle);
            }
            
            // Halı saçakları oluştur
            const fringeContainer = document.getElementById('carpetFringe');
            if (fringeContainer) {
              fringeContainer.innerHTML = '';
              for (let i = 0; i < 40; i++) {
                const fringe = document.createElement('div');
                fringe.className = 'fringe';
                fringeContainer.appendChild(fringe);
              }
            }
          };
          
          // Araç göstergesini güncelle
          const updateVehicleIndicator = (vehicleName) => {
            const indicator = document.getElementById('vehicleIndicator');
            indicator.textContent = vehicleName + ' seçildi!';
            indicator.classList.add('show');
            
            // Daha kısa süre göster
            setTimeout(() => {
              indicator.classList.remove('show');
            }, 2000);
          };
          
          // Araç animasyonu ve avatar konumlandırma
          window.updateVehicle = function(vehicleId) {
            // Tüm sahneleri gizle
            document.getElementById('magicCarpetScene').style.display = 'none';
            document.getElementById('airplaneScene').style.display = 'none';
            document.getElementById('rocketScene').style.display = 'none';
            document.getElementById('balloonScene').style.display = 'none';
            
            // Avatar container sınıflarını temizle
            const avatarContainer = document.getElementById('avatarContainer');
            avatarContainer.className = 'avatar-container';
            avatarContainer.style.position = 'absolute';
            avatarContainer.style.left = '50%';
            avatarContainer.style.bottom = 'auto';
            avatarContainer.style.top = 'auto';
            avatarContainer.style.transform = 'translateX(-50%) scale(0.7)';
            avatarContainer.style.clipPath = 'none';
            
            // Avatar model viewer'ı al
            const avatarModel = document.getElementById('avatarModel');
            
            if (vehicleId === 'magic_carpet') {
              // Sihirli halı - Avatar halının üzerinde
              document.getElementById('magicCarpetScene').style.display = 'block';
              avatarContainer.classList.add('avatar-carpet');
              createCarpetSparkles();
              updateVehicleIndicator('Sihirli Halı');
              
              // Avatar'ı halı üzerinde oturur pozisyonda göster
              avatarModel.setAttribute('camera-orbit', '0deg 75deg 105%');
              avatarContainer.style.bottom = '130px';
              
            } else if (vehicleId === 'airplane') {
              // Uçak - Avatar penceresinden dışarı bakıyor
              document.getElementById('airplaneScene').style.display = 'block';
              
              // Bildirim göster
              updateVehicleIndicator('Uçak');
              
              // Uçak sahnesini gösterdikten sonra avatarı konumlandır
              setTimeout(() => {
                try {
                  // Avatar penceresini bul
                  const avatarWindow = document.querySelector('.window-avatar');
                  
                  if (avatarWindow) {
                    // Pencerenin sayfadaki gerçek konumunu al
                    const windowRect = avatarWindow.getBoundingClientRect();
                    
                    // Avatarı pencerenin içine yerleştir
                    avatarContainer.style.position = 'fixed';
                    avatarContainer.style.top = (windowRect.top + windowRect.height/2 - 80) + 'px'; 
                    avatarContainer.style.left = (windowRect.left + windowRect.width/2) + 'px';
                    
                    // Daha büyük ölçek ve daha sınırlı kırpma (sadece baş göster)
                    avatarContainer.style.transform = 'translate(-50%, -50%) scale(0.35)';
                    avatarContainer.style.clipPath = 'circle(25% at 50% 20%)';
                    
                    // Daha yüksek z-index ile her zaman görünür olmasını sağla
                    avatarContainer.style.zIndex = '30';
                    
                    // Avatar kamera açısını ayarla - yandan baksın
                    avatarModel.setAttribute('camera-orbit', '-30deg 75deg 105%');
                    
                    console.log('Avatar positioned in window:', {
                      top: avatarContainer.style.top,
                      left: avatarContainer.style.left,
                      windowRect: {
                        top: windowRect.top,
                        left: windowRect.left,
                        width: windowRect.width,
                        height: windowRect.height
                      }
                    });
                  }
                } catch (error) {
                  console.error('Error positioning avatar in window:', error);
                }
              }, 500); // Daha uzun bir gecikme süresi
              
            } else if (vehicleId === 'rocket') {
              // Roket - Avatar pencerenin içinde, sadece başı görünüyor
              document.getElementById('rocketScene').style.display = 'block';
              avatarContainer.classList.add('avatar-rocket');
              createStarField();
              updateVehicleIndicator('Roket');
              
              // Roketin penceresinden bakıyor gibi göster
              avatarModel.setAttribute('camera-orbit', '0deg 45deg 105%');
              
              // Avatarı roketin pencere kısmına yerleştir
              const rocketWindow = document.querySelector('.rocket-window');
              if (rocketWindow) {
                const rocketWindowRect = rocketWindow.getBoundingClientRect();
                const rocketRect = document.querySelector('.rocket').getBoundingClientRect();
                avatarContainer.style.left = (rocketWindowRect.left + rocketWindowRect.width/2) + 'px';
                avatarContainer.style.bottom = (rocketRect.height - (rocketWindowRect.top - rocketRect.top) - rocketWindowRect.height/2) + 'px';
              }
              
            } else if (vehicleId === 'hot_air_balloon') {
              // Sıcak hava balonu - Avatar sepetin içinde
              document.getElementById('balloonScene').style.display = 'block';
              avatarContainer.classList.add('avatar-balloon');
              updateVehicleIndicator('Sıcak Hava Balonu');
              
              // Balonun sepetinde oturur pozisyonda göster
              avatarModel.setAttribute('camera-orbit', '0deg 60deg 105%');
              
              // Avatarı balonun sepet kısmına yerleştir
              const basket = document.querySelector('.balloon-basket');
              if (basket) {
                const basketRect = basket.getBoundingClientRect();
                const balloonRect = document.querySelector('.balloon-container').getBoundingClientRect();
                avatarContainer.style.left = (basketRect.left + basketRect.width/2) + 'px';
                avatarContainer.style.bottom = (balloonRect.height - (basketRect.top - balloonRect.top) - basketRect.height/2) + 'px';
              }
            }
          }
        </script>
      </body>
    </html>
  `;
  
  // WebView'e mesaj gönder
  const sendMessageToWebView = (webViewRef, message) => {
    if (webViewRef && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.updateVehicle('${message}');
        true;
      `);
    }
  };
  
  // WebView referansı
  const webViewRef = React.useRef(null);
  
  // Araç seçildiğinde WebView'e mesaj gönder
  React.useEffect(() => {
    if (selectedVehicle) {
      sendMessageToWebView(webViewRef, selectedVehicle);
    }
  }, [selectedVehicle]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Keşif Aracını Seç</Text>
        <Text style={styles.subtitle}>Maceraya nasıl çıkmak istersin?</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarTitleContainer}>
            <Text style={styles.avatarEmoji}>🦸</Text>
            <Text style={styles.avatarTitle}>Süper Kahraman</Text>
            <Text style={styles.avatarEmoji}>⚡</Text>
          </View>
          <View style={styles.avatarFrame}>
            <WebView
              ref={webViewRef}
              source={{ html: avatarViewerHTML }}
              style={styles.webview}
              scrollEnabled={false}
            />
            <View style={styles.avatarDecorationTop}></View>
            <View style={styles.avatarDecorationBottom}></View>
          </View>
          
          <View style={styles.equipmentContainer}>
            <Text style={styles.equipmentTitle}>Seçilen Ekipmanlar:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.equipmentScroll}>
              {selectedEquipmentItems.map((item) => (
                <View key={item.id} style={styles.equipmentItem}>
                  <Text style={styles.equipmentIcon}>{item.icon}</Text>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.vehiclesContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {vehicleOptions.map(vehicle => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => setSelectedVehicle(vehicle.id)}
              >
                <LinearGradient
                  colors={vehicle.color}
                  style={[
                    styles.vehicleGradient,
                    selectedVehicle === vehicle.id && styles.selectedVehicle
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.vehicleIconContainer}>
                    <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                    <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
                  </View>
                  {selectedVehicle === vehicle.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, !selectedVehicle && styles.disabledButton]}
          onPress={() => selectedVehicle && navigation.navigate('Oath', { 
            avatar, 
            equipments, 
            vehicle: selectedVehicle 
          })}
          disabled={!selectedVehicle}
        >
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 10,
  },
  headerContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarContainer: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  avatarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
  },
  avatarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginHorizontal: 5,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarFrame: {
    flex: 1,
    position: 'relative',
    borderTopWidth: 0,
    borderColor: '#2196F3',
    overflow: 'hidden',
  },
  avatarDecorationTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(33, 150, 243, 0.3)',
  },
  avatarDecorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(33, 150, 243, 0.3)',
  },
  webview: {
    flex: 1,
  },
  equipmentContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderTopWidth: 1,
    borderTopColor: '#BBDEFB',
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  equipmentScroll: {
    flexDirection: 'row',
  },
  equipmentItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#BBDEFB',
    width: 80,
  },
  equipmentIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  equipmentName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#1976D2',
  },
  vehiclesContainer: {
    flex: 1.2,
    marginLeft: 8,
  },
  vehicleCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleGradient: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVehicle: {
    borderColor: '#FFD600',
    borderWidth: 3,
  },
  vehicleIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vehicleIcon: {
    fontSize: 30,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vehicleDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD600',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedBadgeText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  backButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    width: '30%',
  },
  backButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '65%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleScreen;