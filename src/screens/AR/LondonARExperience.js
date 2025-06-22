import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
// import { GLView } from 'expo-gl';
// import * as THREE from 'three';
// import { Renderer } from 'expo-three';
// import { Asset } from 'expo-asset';

const LondonARExperience = ({ navigation, route }) => {
  const { avatar, equipment, vehicle, nextStop } = route.params || {};
  const [arStarted, setArStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // const onContextCreate = async (gl) => {
  //   // Three.js setup ve model yükleme kodları geçici olarak kaldırıldı
  //   console.log('GL context oluşturuldu, Three.js kurulumu atlanıyor.');
    
  //   // Boş bir render döngüsü veya tek seferlik render
  //   const render = () => {
  //     // requestAnimationFrame(render); // Sürekli render döngüsünü kapat
  //     // gl.endFrameEXP(); // Çerçeveyi sonlandır
  //   };
  //   // render();
  // };

  const handleComplete = () => {
    navigation.replace('Map', { avatar, equipment, vehicle, currentStop: nextStop });
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Kamera izni bekleniyor...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Kamera erişimi reddedildi</Text></View>;
  }

  const { width } = Dimensions.get('window');
  const arViewHeight = 400;

  const onContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / arViewHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, arViewHeight);

    // 3D "Hello Londra" yazısı
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
      const textGeometry = new THREE.TextGeometry('Hello Londra', {
        font: font,
        size: 0.3,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x1976D2, shininess: 100 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-1, 0, 0);
      scene.add(textMesh);
    });

    // Işık
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  };

  return (
    <View style={styles.container}>
      {!arStarted ? (
        <>
          <Text style={styles.title}>Londra AR Deneyimi</Text>
          <Text style={styles.emoji}>🎡</Text>
          <Text style={styles.info}>Gerçek dünyada Big Ben'i bulmaya hazır mısın?</Text>
          <TouchableOpacity style={styles.button} onPress={() => setArStarted(true)}>
            <Text style={styles.buttonText}>Londra Deneyimini Başlat</Text>
          </TouchableOpacity>
        </>
      ) : !completed ? (
        <>
          <View style={{ width: '100%', height: arViewHeight, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
            {console.log('Camera.Constants:', Camera?.Constants)}
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFillObject}
              type={Camera?.Constants?.Type?.back || 'back'}
              ratio={'16:9'}
            />
            <GLView
              style={StyleSheet.absoluteFillObject}
              onContextCreate={onContextCreate}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setCompleted(true)}>
            <Text style={styles.buttonText}>Görevi Tamamla</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.emoji}>🎖️</Text>
          <Text style={styles.info}>Big Ben Rozeti Kazandın!</Text>
          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>Sonraki Göreve Geç</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    position: 'relative',
  },
  fakeCameraBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#222',
    opacity: 0.3,
    zIndex: 1,
    borderRadius: 16,
  },
  helloLondonArContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  helloLondonArText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#1976D2',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 12,
    letterSpacing: 3,
    textAlign: 'center',
    elevation: 10,
    backgroundColor: 'rgba(25, 118, 210, 0.7)',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  helloLondonContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloLondonText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1976D2',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
    textAlign: 'center',
    elevation: 8,
    // Animasyon efekti için basit opacity animasyonu eklenebilir
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 20,
  },
  arContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LondonARExperience;