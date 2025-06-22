import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ProgressScreen = ({ route }) => {
  const avatar = route.params?.avatar;
  const [selectedTab, setSelectedTab] = useState('achievements');

  const achievements = [
    {
      title: 'İlk Keşif',
      description: 'İlk keşif noktasını ziyaret ettin',
      progress: 100,
      icon: 'explore',
    },
    {
      title: 'Ekipman Ustası',
      description: '5 farklı ekipman kullandın',
      progress: 60,
      icon: 'backpack',
    },
    {
      title: 'Araç Koleksiyoncusu',
      description: '3 farklı araç kullandın',
      progress: 33,
      icon: 'directions-car',
    },
  ];

  const stats = [
    {
      title: 'Toplam Keşif',
      value: '12',
      icon: 'explore',
    },
    {
      title: 'Tamamlanan Görevler',
      value: '8',
      icon: 'assignment',
    },
    {
      title: 'Kazanılan Rozetler',
      value: '5',
      icon: 'military-tech',
    },
  ];

  const renderAvatar = () => {
    if (!avatar?.avatarUrl) return null;

    return (
      <View style={styles.avatarContainer}>
        <WebView
          source={{ uri: 'https://viewer.readyplayer.me/avatar' }}
          style={styles.avatarViewer}
          injectedJavaScript={`
            window.addEventListener('message', function(event) {
              if (event.data.type === 'vps.ready') {
                window.postMessage(JSON.stringify({
                  type: 'load-avatar',
                  url: '${avatar.avatarUrl}'
                }));
              }
            });
          `}
        />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>İlerleme</Text>
          {renderAvatar()}
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'achievements' && styles.selectedTab,
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <MaterialIcons
              name="emoji-events"
              size={24}
              color={selectedTab === 'achievements' ? '#1976D2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'achievements' && styles.selectedTabText,
              ]}
            >
              Başarılar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'stats' && styles.selectedTab]}
            onPress={() => setSelectedTab('stats')}
          >
            <MaterialIcons
              name="insights"
              size={24}
              color={selectedTab === 'stats' ? '#1976D2' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'stats' && styles.selectedTabText,
              ]}
            >
              İstatistikler
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'achievements' ? (
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <MaterialIcons
                  name={achievement.icon}
                  size={32}
                  color="#1976D2"
                />
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${achievement.progress}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <MaterialIcons name={stat.icon} size={32} color="#1976D2" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
  },
  avatarContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 5,
    marginBottom: 20,
  },
  avatarViewer: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  selectedTab: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  selectedTabText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    padding: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: width * 0.45,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    marginVertical: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProgressScreen; 